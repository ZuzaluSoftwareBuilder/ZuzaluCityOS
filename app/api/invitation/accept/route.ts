import { z } from 'zod';
import { withSessionValidation } from '@/utils/authMiddleware';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { dayjs } from '@/utils/dayjs';
import { authenticateWithSpaceId, executeQuery } from '@/utils/ceramic';
import { InvitationStatus } from '@/types/invitation';
import { composeClient } from '@/constant';
import { CREATE_ROLE_QUERY, CHECK_EXISTING_ROLE_QUERY } from '@/services/graphql/role';

export const dynamic = 'force-dynamic';

// Accept invitation request schema
const acceptInvitationSchema = z.object({
  invitationId: z.string().min(1, 'Invitation ID is required'),
});

export const POST = withSessionValidation(async (request, sessionData) => {
  try {
    const body = await request.json();
    const validationResult = acceptInvitationSchema.safeParse(body);

    if (!validationResult.success) {
      return createErrorResponse(
        'Invalid request parameters',
        400,
        validationResult.error.format()
      );
    }

    const { invitationId } = validationResult.data;
    const operatorId = sessionData.operatorId;

    if (!operatorId) {
      return createErrorResponse('Failed to get user information', 401);
    }

    // Query invitation information
    const query = `
      query GetInvitation($id: ID!) {
        node(id: $id) {
          ... on ZucityInvitation {
            id
            inviterId
            inviteeId
            resource
            resourceId
            roleId
            status
            createdAt
            expiresAt
          }
        }
      }
    `;

    const result = await composeClient.executeQuery(query, { id: invitationId });

    if (result.errors) {
      throw new Error(result.errors.map((e: any) => e.message).join(', '));
    }

    const invitation = result.data?.node;

    if (!invitation) {
      return createErrorResponse('Invitation not found', 404);
    }

    // Validate the invitation is not expired
    const expiresAt = dayjs(invitation.expiresAt);
    if (expiresAt.isBefore(dayjs())) {
      return createErrorResponse('Invitation has expired', 400);
    }

    // Validate the invitation status
    if (invitation.status !== InvitationStatus.PENDING) {
      return createErrorResponse('Invalid invitation status, cannot be accepted', 400);
    }

    // Validate the invitee is the current user
    if (invitation.inviteeId !== operatorId) {
      return createErrorResponse('You do not have permission to accept this invitation', 403);
    }

    // Check if user already has a role in this resource
    const existingRoleResult = await executeQuery(CHECK_EXISTING_ROLE_QUERY, {
      userId: operatorId,
      resourceId: invitation.resourceId,
      resource: invitation.resource,
    });

    const existingRolesData = existingRoleResult.data as any;
    const existingRoles = (existingRolesData?.zucityUserRolesIndex?.edges as []) || [];

    if (existingRoles.length > 0) {
      return createErrorResponse('You already have a role in this resource', 409);
    }

    // Create user role after accepting invitation
    const checkExistingQuery = `
      query CheckExistingRole($userId: String, $roleId: ID, $resourceId: String) {
        zucityUserRolesIndex(
          filters: {
            and: [
              { userId: { id: { equalTo: $userId } } }
              { roleId: { equalTo: $roleId } }
              { resourceId: { equalTo: $resourceId } }
            ]
          }
        ) {
          edges {
            node {
              id
            }
          }
        }
      }
    `;

    const checkResult = await executeQuery(CHECK_EXISTING_ROLE_QUERY, {
      userId: operatorId,
      roleId: invitation.roleId,
      resourceId: invitation.resourceId,
    });

    const existingRolesAfterCheck = checkResult?.data?.zucityUserRolesIndex?.edges || [];
    if (existingRolesAfterCheck.length === 0) {
      const createRoleQuery = `
        mutation CreateUserRole($input: CreateZucityUserRolesInput!) {
          createZucityUserRoles(input: $input) {
            document {
              id
              userId {
                id
              }
              roleId
              resourceId
              source
            }
          }
        }
      `;

      await executeQuery(CREATE_ROLE_QUERY, {
        input: {
          content: {
            userId: { id: operatorId },
            roleId: invitation.roleId,
            resourceId: invitation.resourceId,
            source: 'invitation',
            created_at: dayjs().utc().toISOString(),
            updated_at: dayjs().utc().toISOString(),
          },
        },
      });
    }

    // Update invitation status
    const updateMutation = `
      mutation UpdateInvitation($input: UpdateZucityInvitationInput!) {
        updateZucityInvitation(input: $input) {
          document {
            id
            author {
              id
            }
            inviterId
            inviteeId
            resource
            resourceId
            roleId
            status
            message
            isRead
            inviterProfileId
            inviterProfile {
              id
              username
              avatar
            }
            inviteeProfileId
            inviteeProfile {
              id
              username
              avatar
            }
            createdAt
            expiresAt
            updatedAt
            lastSentAt
          }
        }
      }
    `;

    const updateResult = await composeClient.executeQuery(updateMutation, {
      input: {
        id: invitationId,
        content: {
          status: InvitationStatus.ACCEPTED,
          isRead: true,
          updatedAt: dayjs().toISOString(),
        },
      },
    });

    if (updateResult.errors) {
      throw new Error(updateResult.errors.map((e: any) => e.message).join(', '));
    }

    const updatedInvitation = updateResult.data?.updateZucityInvitation?.document;
    return createSuccessResponse(updatedInvitation, 'Invitation accepted successfully');
  } catch (error: any) {
    console.error('Failed to accept invitation:', error);
    return createErrorResponse('Failed to accept invitation', 500, error.message);
  }
}); 