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
} from '@/services/graphql/role';
import { withInvitationValidation } from '@/middleware/invitationMiddleware';

export const dynamic = 'force-dynamic';

const handleAcceptInvitation = async (req: NextRequest, sessionData: any) => {
  const { invitation, operatorId } = sessionData;

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
      'Invitee already have a role in this resource',
      409,
    );
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

  const invitationService = InvitationService.getInstance();
  const updatedInvitation = await invitationService.updateInvitationStatus(
    invitation.id,
    InvitationStatus.ACCEPTED,
  );

  return createSuccessResponse(
    updatedInvitation,
    'Invitation accepted successfully',
  );
};

export const POST = withBasicSessionValidation(
  withInvitationValidation(handleAcceptInvitation, {
    expectedStatus: InvitationStatus.PENDING,
    validateInvitee: true,
  }),
);
