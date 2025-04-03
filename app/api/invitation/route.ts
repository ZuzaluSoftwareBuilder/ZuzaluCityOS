import { NextRequest } from 'next/server';
import { withSessionValidation } from '@/utils/authMiddleware';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { hasRequiredPermission } from '@/utils/service/role';
import { PermissionName } from '@/types';
import { InvitationStatus, createInvitationSchema } from '@/types/invitation';
import { dayjs } from '@/utils/dayjs';
import { authenticateWithSpaceId } from '@/utils/ceramic';
import { composeClient } from '@/constant';
import { SessionData } from '@/types/session';
import { CREATE_INVITATION_MUTATION } from '@/services/graphql/invitation';
import { getProfileIdByDid } from '@/services/profile/profile';
import { CHECK_EXISTING_ROLE_QUERY } from '@/services/graphql/role';

export const dynamic = 'force-dynamic';

const handleCreateInvitation = async (
  req: NextRequest,
  sessionData: SessionData,
) => {
  if (!sessionData.operatorId) {
    return createErrorResponse('Failed to get user information', 401);
  }

  const body = await req.json();
  const validationResult = createInvitationSchema.safeParse(body);

  if (!validationResult.success) {
    return createErrorResponse(
      'Invalid request parameters',
      400,
      validationResult.error.format(),
    );
  }

  const { inviteeId, id, resource, roleId, message, expiresAt } =
    validationResult.data;

  if (!hasRequiredPermission(sessionData, PermissionName.INVITE_USERS)) {
    return createErrorResponse('Permission denied', 403);
  }

  const existingRoleResult = await composeClient.executeQuery(
    CHECK_EXISTING_ROLE_QUERY.toString(),
    {
      userId: inviteeId,
      resourceId: id,
      resource,
    },
  );

  const existingRoles =
    existingRoleResult.data?.zucityUserRolesIndex?.edges || [];

  if (existingRoles.length > 0) {
    const existingRole = existingRoles[0].node;
    if (existingRole.roleId === roleId) {
      return createErrorResponse(
        'Invitee already has the same role in this resource',
        409,
      );
    }
  }

  const defaultExpiration = dayjs().add(7, 'day');
  const expirationDate = expiresAt ? dayjs(expiresAt) : defaultExpiration;

  const [inviterProfile, inviteeProfile] = await Promise.all([
    getProfileIdByDid(sessionData.operatorId),
    getProfileIdByDid(inviteeId),
  ]);

  const error = await authenticateWithSpaceId(id);
  if (error) {
    return createErrorResponse('Failed to get private key', 500);
  }

  const newInvitation = {
    inviterId: sessionData.operatorId,
    inviteeId,
    resource,
    resourceId: id,
    roleId,
    status: InvitationStatus.PENDING,
    message: message || '',
    isRead: 'false',
    inviterProfileId: inviterProfile!.id,
    inviteeProfileId: inviteeProfile!.id,
    createdAt: dayjs().toISOString(),
    expiresAt: expirationDate.toISOString(),
    lastSentAt: dayjs().toISOString(),
    ...(resource === 'space' ? { spaceId: id } : {}),
  };

  try {
    const result = await composeClient.executeQuery(
      CREATE_INVITATION_MUTATION.toString(),
      {
        input: { content: newInvitation },
      },
    );

    if (result.errors) {
      throw new Error(result.errors.map((e: any) => e.message).join(', '));
    }

    const createdInvitation = result.data?.createZucityInvitation?.document;
    return createSuccessResponse(
      createdInvitation,
      'Invitation created successfully',
    );
  } catch (error: any) {
    console.error('Failed to create invitation:', error);
    return createErrorResponse(
      'Failed to create invitation',
      500,
      error.message,
    );
  }
};

export const POST = withSessionValidation(handleCreateInvitation);
