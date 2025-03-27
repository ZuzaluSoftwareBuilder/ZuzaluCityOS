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

    // Update invitation status
    const updateMutation = `
      mutation UpdateInvitation($id: ID!, $content: UpdateZucityInvitationInput!) {
        updateZucityInvitation(id: $id, content: $content) {
          document {
            id
            status
            updatedAt
          }
        }
      }
    `;

    // Prepare to update invitation status
    const error = await authenticateWithSpaceId(invitation.resourceId);
    if (error) {
      return createErrorResponse('Failed to get private key', 500);
    }

    // Update invitation status to accepted
    const updateResult = await composeClient.executeQuery(updateMutation, {
      id: invitationId,
      content: {
        status: InvitationStatus.ACCEPTED,
        updatedAt: dayjs().toISOString(),
      }
    });

    if (updateResult.errors) {
      throw new Error(updateResult.errors.map((e: any) => e.message).join(', '));
    }

    // Add user role
    const createRoleResult = await executeQuery(CREATE_ROLE_QUERY, {
      input: {
        content: {
          userId: operatorId,
          resourceId: invitation.resourceId,
          source: invitation.resource,
          roleId: invitation.roleId,
          created_at: dayjs().utc().toISOString(),
          updated_at: dayjs().utc().toISOString(),
        },
      }
    });

    if (createRoleResult.errors) {
      // If adding the role fails, rollback invitation status
      await composeClient.executeQuery(updateMutation, {
        id: invitationId,
        content: {
          status: InvitationStatus.PENDING,
          updatedAt: dayjs().toISOString(),
        }
      });

      throw new Error(createRoleResult.errors.map((e: any) => e.message).join(', '));
    }

    return createSuccessResponse({ id: invitationId }, 'Invitation accepted');
  } catch (error: any) {
    console.error('Failed to accept invitation:', error);
    return createErrorResponse('Failed to accept invitation', 500, error.message);
  }
}); 