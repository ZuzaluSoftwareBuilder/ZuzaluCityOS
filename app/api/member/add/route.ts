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
import { z } from 'zod';

dayjs.extend(utc);

const addRoleSchema = z.object({
  id: z.string().min(1, 'Resource ID is required'),
  resource: z.string().min(1, 'Resource type is required'),
  roleId: z.string().min(1, 'Role ID is required'),
  userId: z.string().min(1, 'User ID is required'),
});

export const POST = withSessionValidation(async (request, sessionData) => {
  try {
    const body = await request.json();
    const validationResult = addRoleSchema.safeParse(body);
    if (!validationResult.success) {
      return createErrorResponse(
        'Invalid request parameters',
        400,
        validationResult.error.format(),
      );
    }
    const { id, resource, roleId, userId } = validationResult.data;

    const { role } = sessionData;

    const addedRole = role?.find((r) => r.role.id === roleId);
    if (!addedRole) {
      return createErrorResponse('Role not found', 404);
    }

    if (addedRole.role.level === 'owner') {
      return createErrorResponse('Owner role cannot be added', 400);
    }

    const requiredPermission =
      addedRole.role.level === 'admin'
        ? PermissionName.MANAGE_ADMIN_ROLE
        : PermissionName.MANAGE_MEMBER_ROLE;
    if (!hasRequiredPermission(sessionData, requiredPermission)) {
      return createErrorResponse('Permission denied', 403);
    }

    const existingRoleResult = await getRoleRepository().getUserRole(
      id,
      resource,
      userId,
    );

    const existingRoles = existingRoleResult.data || [];

    if (existingRoles.length > 0) {
      return createErrorResponse(
        'User already has role for this resource',
        409,
      );
    }

    const error = await authenticateWithSpaceId(id);
    if (error) {
      return createErrorResponse('Error getting private key', 500);
    }
    const result = await getRoleRepository().createRole({
      userId,
      roleId: roleId,
      resourceId: id,
      source: resource,
    });

    if (result.error) {
      return createErrorResponse('Failed to add member', 500);
    }

    return createSuccessResponse('Member added');
  } catch (error: unknown) {
    console.error('Error adding member:', error);
    return createErrorResponse('Internal server error', 500);
  }
});
