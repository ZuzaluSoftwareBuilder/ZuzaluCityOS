import { getSpaceRepository } from '@/repositories/space';
import {
  CHECK_EXISTING_ROLE_QUERY,
  CREATE_ROLE_QUERY,
  UPDATE_ROLE_QUERY,
} from '@/services/graphql/role';
import { authenticateWithSpaceId, executeQuery } from '@/utils/ceramic';
import { dayjs } from '@/utils/dayjs';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { supabase } from '@/utils/supabase/client';
import utc from 'dayjs/plugin/utc';
import { z } from 'zod';

dayjs.extend(utc);

const followSchema = z.object({
  id: z.string().min(1, 'Resource ID is required'),
  resource: z.string().min(1, 'Resource type is required'),
  roleId: z.string().min(1, 'Role ID is required'),
  userId: z.string().min(1, 'User ID is required'),
});

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const validationResult = followSchema.safeParse(body);

    if (!validationResult.success) {
      return createErrorResponse(
        'Invalid request parameters',
        400,
        validationResult.error.format(),
      );
    }

    const { id: spaceId, resource, roleId, userId } = validationResult.data;

    const { data: rolePermissionResult } = await supabase
      .from('role_permission')
      .select(
        `
          *,
          role(
            id,
            name,
            level
          )
        `,
      )
      .or(
        `and(resource.eq.${resource},resource_id.eq.${spaceId}),and(resource.is.null,resource_id.is.null)`,
      );

    const addedRole = rolePermissionResult?.find((r) => r.role.id === roleId);
    if (!addedRole) {
      return createErrorResponse('Role not found', 404);
    }

    if (addedRole.role.level === 'owner') {
      return createErrorResponse('Owner role cannot be added', 400);
    }

    const spaceRepository = getSpaceRepository();
    const space = await spaceRepository.getById(spaceId);

    if (!space) {
      return createErrorResponse('Space not found', 404);
    }

    if (space.gated === '1') {
      return createErrorResponse('Space is gated', 400);
    }

    const error = await authenticateWithSpaceId(spaceId);
    if (error) {
      return createErrorResponse('Error getting private key', 500);
    }

    const existingRoleResult = await executeQuery(CHECK_EXISTING_ROLE_QUERY, {
      userId,
      resourceId: spaceId,
      resource: 'space',
    });

    const data = existingRoleResult.data;
    const existingRoles = data?.zucityUserRolesIndex?.edges || [];

    let result;
    if (existingRoles.length > 0) {
      result = await executeQuery(UPDATE_ROLE_QUERY, {
        input: {
          id: existingRoles[0]?.node?.id ?? '',
          content: {
            roleId,
            updated_at: dayjs().utc().toISOString(),
          },
        },
      });
    } else {
      result = await executeQuery(CREATE_ROLE_QUERY, {
        input: {
          content: {
            userId,
            resourceId: spaceId,
            source: 'space',
            roleId,
            spaceId,
            created_at: dayjs().utc().toISOString(),
            updated_at: dayjs().utc().toISOString(),
          },
        },
      });
    }

    if (result.errors) {
      return createErrorResponse('Failed to join space', 500);
    }

    return createSuccessResponse('Successfully joined space');
  } catch (error: unknown) {
    console.error('Error joining space:', error);
    return createErrorResponse('Internal server error', 500);
  }
};
