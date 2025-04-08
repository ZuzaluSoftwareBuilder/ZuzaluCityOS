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

dayjs.extend(utc);

const followSchema = z.object({
  spaceId: z.string().min(1, 'Space ID is required'),
  userId: z.string().min(1, 'UserId is required'),
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

    const { spaceId, userId } = validationResult.data;

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
        `and(resource.eq.space,resource_id.eq.${spaceId}),and(resource.is.null,resource_id.is.null)`,
      );

    const followerRole = rolePermissionResult?.find(
      (rp) => rp.role.level === 'follower',
    );

    if (!followerRole) {
      return createErrorResponse('Follower role not found for this space', 404);
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
          roleId: followerRole.role.id,
          spaceId,
          created_at: dayjs().utc().toISOString(),
          updated_at: dayjs().utc().toISOString(),
        },
      },
    });

    if (result.errors) {
      return createErrorResponse('Failed to unfollow space', 500);
    }

    return createSuccessResponse('Successfully followed space');
  } catch (error: unknown) {
    console.error('Error following space:', error);
    return createErrorResponse('Internal server error', 500);
  }
};
