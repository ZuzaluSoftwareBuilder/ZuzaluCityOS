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
import { supabase } from '@/utils/supabase/client';
import { GET_SPACE_QUERY_BY_ID } from '@/services/graphql/space';
import { Space } from '@/types';

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

    const existingRoleResult = await executeQuery(CHECK_EXISTING_ROLE_QUERY, {
      userId,
      resourceId: spaceId,
      resource: 'space',
    });

    const data = existingRoleResult.data as any;
    const existingRoles = (data?.zucityUserRolesIndex?.edges as []) || [];

    if (existingRoles.length > 0) {
      return createErrorResponse(
        'User already has role for this resource',
        409,
      );
    }

    const spaceResult = await executeQuery(GET_SPACE_QUERY_BY_ID, {
      id: spaceId,
    });

    const space = spaceResult.data?.node as Space;

    if (space.gated === '1') {
      return createErrorResponse('Space is not gated', 400);
    }

    const error = await authenticateWithSpaceId(spaceId);
    if (error) {
      return createErrorResponse('Error getting private key', 500);
    }

    const result = await executeQuery(CREATE_ROLE_QUERY, {
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

    if (result.errors) {
      return createErrorResponse('Failed to join space', 500);
    }

    return createSuccessResponse('Successfully joined space');
  } catch (error: unknown) {
    console.error('Error joining space:', error);
    return createErrorResponse('Internal server error', 500);
  }
};
