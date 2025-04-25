import { getRoleRepository } from '@/repositories/role';
import { PermissionName } from '@/types';
import { withSessionValidation } from '@/utils/authMiddleware';
import { authenticateWithSpaceId } from '@/utils/ceramic';
import { dayjs } from '@/utils/dayjs';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { hasRequiredPermission } from '@/utils/service/role';
import utc from 'dayjs/plugin/utc';
import { NextResponse } from 'next/server';
import { z } from 'zod';

dayjs.extend(utc);

const removeRoleSchema = z.object({
  id: z.string().min(1, 'Resource ID is required'),
  resource: z.string().min(1, 'Resource type is required'),
  userId: z.string().min(1, 'User ID is required'),
});

export const POST = withSessionValidation(async (request, sessionData) => {
  try {
    const body = await request.json();
    const validationResult = removeRoleSchema.safeParse(body);
    if (!validationResult.success) {
      return createErrorResponse(
        'Invalid request parameters',
        400,
        validationResult.error.format(),
      );
    }
    const { id, resource, userId } = validationResult.data;

    const { role } = sessionData;

    const existingRoleResult = await getRoleRepository().getUserRole(
      id,
      resource,
      userId,
    );

    const existingRoles = existingRoleResult.data || [];

    if (existingRoles.length === 0) {
      return NextResponse.json(
        { error: 'User does not have a role for this resource' },
        { status: 404 },
      );
    }

    const userExistingRole = existingRoles[0];
    const roleId = userExistingRole?.roleId;
    const userRoleId = userExistingRole?.id;

    const removedRole = role?.find((r) => r.role.id === roleId);

    if (!removedRole) {
      return createErrorResponse('Role not found', 404);
    }

    if (removedRole.role.level === 'owner') {
      return createErrorResponse('Owner role cannot be removed', 400);
    }

    const requiredPermission =
      removedRole.role.level === 'admin'
        ? PermissionName.MANAGE_ADMIN_ROLE
        : PermissionName.MANAGE_MEMBER_ROLE;
    if (!hasRequiredPermission(sessionData, requiredPermission)) {
      return createErrorResponse('Permission denied', 403);
    }

    const error = await authenticateWithSpaceId(id);
    if (error) {
      return createErrorResponse('Error getting private key', 500);
    }

    const result = await getRoleRepository().deleteRole(userRoleId!);

    if (result.error) {
      return createErrorResponse('Failed to remove member', 500);
    }

    return createSuccessResponse('Member removed');
  } catch (error: unknown) {
    console.error('Error removing member:', error);
    return createErrorResponse('Internal server error', 500);
  }
});
