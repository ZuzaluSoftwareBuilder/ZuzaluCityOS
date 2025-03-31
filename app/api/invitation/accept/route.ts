import { z } from 'zod';
import { withBasicSessionValidation } from '@/utils/authMiddleware';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { dayjs } from '@/utils/dayjs';
import { authenticateWithSpaceId, executeQuery } from '@/utils/ceramic';
import { InvitationStatus } from '@/types/invitation';
import { composeClient } from '@/constant';
import {
  UPDATE_INVITATION_MUTATION,
  GET_INVITATION_BY_ID_QUERY,
} from '@/services/graphql/invitation';
import {
  CREATE_ROLE_QUERY,
  CHECK_EXISTING_ROLE_QUERY,
} from '@/services/graphql/role';

export const dynamic = 'force-dynamic';

// Accept invitation request schema
const acceptInvitationSchema = z.object({
  invitationId: z.string().min(1, 'Invitation ID is required'),
  id: z.string().min(1, 'Resource ID is required'),
  resource: z.string().min(1, 'Resource type is required'),
});

export const POST = withBasicSessionValidation(async (request, sessionData) => {
  try {
    const body = await request.json();
    const validationResult = acceptInvitationSchema.safeParse(body);

    if (!validationResult.success) {
      return createErrorResponse(
        'Invalid request parameters',
        400,
        validationResult.error.format(),
      );
    }

    const { invitationId } = validationResult.data;
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

    const expiresAt = dayjs(invitation.expiresAt);
    if (expiresAt.isBefore(dayjs())) {
      return createErrorResponse('Invitation has expired', 400);
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      return createErrorResponse(
        'Invalid invitation status, cannot be accepted',
        400,
      );
    }

    if (invitation.inviteeId.id !== operatorId) {
      return createErrorResponse(
        'You do not have permission to accept this invitation',
        403,
      );
    }

    const existingRoleResult = await composeClient.executeQuery(
      CHECK_EXISTING_ROLE_QUERY.toString(),
      {
        userId: operatorId,
        resourceId: invitation.resourceId,
        resource: invitation.resource,
      },
    );

    const existingRoles =
      existingRoleResult.data?.zucityUserRolesIndex?.edges || [];
    if (existingRoles.length > 0) {
      return createErrorResponse(
        'You already have a role in this resource',
        409,
      );
    }

    try {
      const error = await authenticateWithSpaceId(invitation.resourceId);
      if (error) {
        return createErrorResponse('Failed to get private key', 500);
      }

      const createRoleResult = await composeClient.executeQuery(
        CREATE_ROLE_QUERY.toString(),
        {
          input: {
            content: {
              userId: operatorId,
              roleId: invitation.roleId,
              resourceId: invitation.resourceId,
              source: invitation.resource,
              created_at: dayjs().utc().toISOString(),
              updated_at: dayjs().utc().toISOString(),
              ...(invitation.resource === 'space' && {
                spaceId: invitation.resourceId,
              }),
            },
          },
        },
      );

      if (createRoleResult.errors) {
        throw new Error(
          createRoleResult.errors.map((e: any) => e.message).join(', '),
        );
      }

      const createdRole =
        createRoleResult.data?.createZucityUserRoles?.document;
      if (!createdRole) {
        throw new Error('Failed to create user role: No role data returned');
      }

      console.log('Created role:', createdRole);
    } catch (error) {
      console.error('Failed to create user role:', error);
      return createErrorResponse('Failed to create user role', 500);
    }

    console.log('create user role success');

    // // 6. 验证资源访问权限
    // const accessValidationResult = await executeQuery(VALIDATE_RESOURCE_ACCESS.toString(), {
    //   userId: operatorId,
    //   resourceId: invitation.resourceId,
    //   source: invitation.resource
    // });

    // const edges = accessValidationResult.data?.zucityUserRolesIndex?.edges;
    // const hasAccess = edges && edges.length > 0;
    // if (!hasAccess) {
    //   return createErrorResponse('Failed to grant resource access', 500);
    // }

    console.log('grant resource access success');

    const updateResult = await composeClient.executeQuery(
      UPDATE_INVITATION_MUTATION.toString(),
      {
        input: {
          id: invitationId,
          content: {
            status: InvitationStatus.ACCEPTED,
            isRead: 'true',
            updatedAt: dayjs().toISOString(),
          },
        },
      },
    );

    console.log('update invitation status success');

    if (updateResult.errors) {
      throw new Error(
        updateResult.errors.map((e: any) => e.message).join(', '),
      );
    }

    const updatedInvitation =
      updateResult.data?.updateZucityInvitation?.document;
    return createSuccessResponse(
      updatedInvitation,
      'Invitation accepted successfully',
    );
  } catch (error: any) {
    console.error('Failed to accept invitation:', error);
    return createErrorResponse(
      'Failed to accept invitation',
      500,
      error.message,
    );
  }
});
