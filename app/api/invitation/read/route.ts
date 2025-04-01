import { composeClient } from '@/constant';
import { GET_INVITATION_BY_ID_QUERY } from '@/services/graphql/invitation';
import { withBasicSessionValidation } from '@/utils/authMiddleware';
import { authenticateWithSpaceId } from '@/utils/ceramic';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';

export const POST = withBasicSessionValidation(async (request, sessionData) => {
  try {
    const body = await request.json();
    const { invitationId } = body;

    if (!invitationId) {
      return createErrorResponse('Invitation ID is required', 400);
    }

    const operatorId = sessionData.operatorId;
    if (!operatorId) {
      return createErrorResponse('Failed to get user information', 401);
    }

    const invitationResult = await composeClient.executeQuery(
      GET_INVITATION_BY_ID_QUERY.toString(),
      {
        id: invitationId,
      },
    );

    if (invitationResult.errors) {
      throw new Error(
        invitationResult.errors.map((e: any) => e.message).join(', '),
      );
    }

    const invitation = invitationResult.data?.node;

    if (!invitation) {
      return createErrorResponse('Invitation not found', 404);
    }

    try {

      const error = await authenticateWithSpaceId(invitation.resourceId);
      if (error) {
        return createErrorResponse('Failed to get private key', 500);
      }

      const updateResult = await composeClient.executeQuery(`
        mutation UpdateInvitation($input: UpdateZucityInvitationInput!) {
          updateZucityInvitation(input: $input) {
            document {
              id
              isRead
            }
          }
        }
      `, {
        input: {
          id: invitationId,
          content: {
            isRead: "true"
          }
        }
      });

      if (updateResult.errors) {
        console.error('GraphQL errors:', updateResult.errors);
        return createErrorResponse(
          'Failed to mark invitation as read',
          500,
          updateResult.errors
        );
      }

      return createSuccessResponse(
        updateResult.data?.updateZucityInvitation?.document,
        'Invitation marked as read successfully'
      );
    } catch (graphqlError) {
      console.error('GraphQL execution error:', graphqlError);
      return createErrorResponse('Failed to execute GraphQL operation', 500);
    }
  } catch (error: any) {
    console.error('Error marking invitation as read:', error);
    return createErrorResponse(
      'Failed to mark invitation as read',
      500,
      error.message
    );
  }
});
