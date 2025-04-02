import { NextRequest } from 'next/server';
import { withBasicSessionValidation } from '@/utils/authMiddleware';
import {
  createSuccessResponse,
  createErrorResponse,
} from '@/utils/service/response';
import { InvitationService } from '@/services/invitation/InvitationService';
import { InvitationStatus } from '@/types/invitation';
import { dayjs } from '@/utils/dayjs';
import { composeClient } from '@/constant';
import {
  CREATE_ROLE_QUERY,
  CHECK_EXISTING_ROLE_QUERY,
  UPDATE_ROLE_QUERY,
} from '@/services/graphql/role';
import { withInvitationValidation } from '@/middleware/invitationMiddleware';
import { SessionData } from '@/types/session';
import { authenticateWithSpaceId } from '@/utils/ceramic';

export const dynamic = 'force-dynamic';

const handleAcceptInvitation = async (
  req: NextRequest,
  sessionData: SessionData,
) => {
  const { invitation, operatorId } = sessionData;

  if (!invitation) {
    throw new Error('Invitation not found in session data');
  }

  try {
    const error = await authenticateWithSpaceId(invitation.resourceId);

    if (error) {
      return createErrorResponse('Failed to get private key', 500);
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
      const existingRole = existingRoles[0].node;

      if (existingRole.roleId === invitation.roleId) {
        const invitationService = InvitationService.getInstance();
        await invitationService.updateInvitationStatus(
          invitation.id,
          InvitationStatus.INVALID,
        );

        return createErrorResponse(
          'You already have this role in the resource',
          409,
        );
      }

      const updateResult = await composeClient.executeQuery(
        UPDATE_ROLE_QUERY.toString(),
        {
          input: {
            id: existingRole.id,
            content: {
              userId: operatorId,
              roleId: invitation.roleId,
              resourceId: invitation.resourceId,
              source: invitation.resource,
              updated_at: dayjs().utc().toISOString(),
              ...(invitation.resource === 'space' && {
                spaceId: invitation.resourceId,
              }),
            },
          },
        },
      );

      if (updateResult.errors) {
        throw new Error(
          updateResult.errors.map((e: any) => e.message).join(', '),
        );
      }
    } else {
      const createResult = await composeClient.executeQuery(
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

      if (createResult.errors) {
        throw new Error(
          createResult.errors.map((e: any) => e.message).join(', '),
        );
      }
    }

    const invitationService = InvitationService.getInstance();
    const updatedInvitation = await invitationService.updateInvitationStatus(
      invitation.id,
      InvitationStatus.ACCEPTED,
    );

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
};

export const POST = withBasicSessionValidation(
  withInvitationValidation(handleAcceptInvitation, {
    expectedStatus: InvitationStatus.PENDING,
    validateInvitee: true,
  }),
);
