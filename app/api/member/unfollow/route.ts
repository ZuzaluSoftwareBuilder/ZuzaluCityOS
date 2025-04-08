import { dayjs } from '@/utils/dayjs';
import utc from 'dayjs/plugin/utc';
import { authenticateWithSpaceId, executeQuery } from '@/utils/ceramic';
import {
  CHECK_EXISTING_ROLE_QUERY,
  DELETE_ROLE_QUERY,
} from '@/services/graphql/role';
import { z } from 'zod';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { supabase } from '@/utils/supabase/client';

dayjs.extend(utc);

const unfollowSchema = z.object({
  spaceId: z.string().min(1, 'Space ID is required'),
  userId: z.string().min(1, 'UserId is required'),
});

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const validationResult = unfollowSchema.safeParse(body);
    if (!validationResult.success) {
      return createErrorResponse(
        'Invalid request parameters',
        400,
        validationResult.error.format(),
      );
    }
    const { spaceId, userId } = validationResult.data;

    const existingRoleResult = await executeQuery(CHECK_EXISTING_ROLE_QUERY, {
      userId,
      resourceId: spaceId,
      resource: 'space',
    });

    const data = existingRoleResult.data;
    const existingRoles = data?.zucityUserRolesIndex?.edges || [];

    if (!existingRoles || existingRoles.length === 0) {
      return createErrorResponse(
        'User does not have a role for this resource',
        404,
      );
    }

    const userRole = existingRoles[0]?.node;
    if (!userRole?.id || !userRole.roleId) {
      return createErrorResponse('User role not found', 404);
    }

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

    if (userRole.roleId !== followerRole.role.id) {
      return createErrorResponse('User is not a follower of this space', 400);
    }

    const error = await authenticateWithSpaceId(spaceId);
    if (error) {
      return createErrorResponse('Error getting private key', 500);
    }

    const result = await executeQuery(DELETE_ROLE_QUERY, {
      input: {
        id: userRole.id!,
        shouldIndex: false,
      },
    });

    if (result.errors) {
      return createErrorResponse('Failed to unfollow space', 500);
    }

    return createSuccessResponse('Successfully unfollowed space');
  } catch (error: unknown) {
    console.error('Error unfollowing space:', error);
    return createErrorResponse('Internal server error', 500);
  }
};
