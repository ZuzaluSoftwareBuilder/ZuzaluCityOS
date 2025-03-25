import { withSessionValidation } from '@/utils/authMiddleware';
import { dayjs } from '@/utils/dayjs';
import utc from 'dayjs/plugin/utc';
import { authenticateWithSpaceId, executeQuery } from '@/utils/ceramic';
import {
  CHECK_EXISTING_ROLE_QUERY,
  UPDATE_ROLE_QUERY,
} from '@/services/graphql/role';
import { z } from 'zod';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { hasRequiredPermission } from '@/utils/service/role';
import { PermissionName } from '@/types';

dayjs.extend(utc);

const updateRoleSchema = z.object({
  id: z.string().min(1, 'Resource ID is required'),
  resource: z.string().min(1, 'Resource type is required'),
  roleId: z.string().min(1, 'Role ID is required'),
  userId: z.string().min(1, 'User ID is required'),
});

export const POST = withSessionValidation(async (request, sessionData) => {
  try {
    const body = await request.json();

    const validationResult = updateRoleSchema.safeParse(body);
    if (!validationResult.success) {
      return createErrorResponse(
        'Invalid request parameters',
        400,
        validationResult.error.format(),
      );
    }

    const { id, resource, roleId, userId } = validationResult.data;

    const newRole = sessionData.role?.find((r) => r.role.id === roleId);
    if (!newRole) {
      return createErrorResponse('Role not found', 404);
    }

    if (newRole.role.level === 'owner') {
      return createErrorResponse('Cannot update to owner role', 400);
    }

    const requiredPermission =
      newRole.role.level === 'admin'
        ? PermissionName.MANAGE_ADMIN_ROLE
        : PermissionName.MANAGE_MEMBER_ROLE;
    if (!hasRequiredPermission(sessionData, requiredPermission)) {
      return createErrorResponse('Permission denied', 403);
    }

    const existingRoleResult = await executeQuery(CHECK_EXISTING_ROLE_QUERY, {
      userId,
      resourceId: id,
      resource,
    });

    const data = existingRoleResult.data;
    const existingRoles = data?.zucityUserRolesIndex?.edges || [];

    if (existingRoles.length === 0) {
      return createErrorResponse(
        'User does not have a role for this resource',
        404,
      );
    }

    const userExistingRole = existingRoles[0];
    const currentRoleId = userExistingRole?.node?.roleId;
    const userRoleDocId = userExistingRole?.node?.id;

    if (currentRoleId === roleId) {
      return createSuccessResponse(
        null,
        'Role is already set to the requested role',
      );
    }

    const authError = await authenticateWithSpaceId(id);
    if (authError) {
      return createErrorResponse(
        'Error authenticating with space',
        500,
        authError,
      );
    }

    const result = await executeQuery(UPDATE_ROLE_QUERY, {
      input: {
        id: userRoleDocId!,
        content: {
          roleId,
          updated_at: dayjs().utc().toISOString(),
        },
      },
    });

    if (result.errors) {
      return createErrorResponse(
        'Failed to update member role',
        500,
        result.errors,
      );
    }

    return createSuccessResponse(
      { roleId: roleId },
      'Member role updated successfully',
    );
  } catch (error: unknown) {
    console.error('Error updating member role:', error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    return createErrorResponse('Internal server error', 500, {
      message: errorMessage,
    });
  }
});
