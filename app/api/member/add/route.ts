import { withSessionValidation } from '@/utils/authMiddleware';
import { dayjs } from '@/utils/dayjs';
import utc from 'dayjs/plugin/utc';
import { authenticateWithSpaceId, executeQuery } from '@/utils/ceramic';
import {
  CHECK_EXISTING_ROLE_QUERY,
  CREATE_ROLE_QUERY,
} from '@/services/graphql/role';
import { z } from 'zod';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { hasRequiredPermission } from '@/utils/service/role';
import { PermissionName } from '@/types';

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

    const existingRoleResult = await executeQuery(CHECK_EXISTING_ROLE_QUERY, {
      userId,
      resourceId: id,
      resource,
    });

    const data = existingRoleResult.data as any;
    const existingRoles = (data?.zucityUserRolesIndex?.edges as []) || [];

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
    const result = await executeQuery(CREATE_ROLE_QUERY, {
      input: {
        content: {
          userId,
          resourceId: id,
          source: resource,
          created_at: dayjs().utc().toISOString(),
          updated_at: dayjs().utc().toISOString(),
          roleId,
          spaceId: id,
        },
      },
    });

    if (result.errors) {
      return createErrorResponse('Failed to add member', 500);
    }

    return createSuccessResponse('Member added');
  } catch (error: unknown) {
    console.error('Error adding member:', error);
    return createErrorResponse('Internal server error', 500);
  }
});
