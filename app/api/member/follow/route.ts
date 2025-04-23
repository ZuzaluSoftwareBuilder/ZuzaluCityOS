import { getRoleRepository } from '@/repositories/role';
import { authenticateWithSpaceId } from '@/utils/ceramic';
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
      .or(`and(resource.is.null,resource_id.is.null)`);

    const followerRole = rolePermissionResult?.find(
      (rp) => rp.role?.level === 'follower',
    );

    if (!followerRole) {
      return createErrorResponse('Follower role not found for this space', 404);
    }

    const existingRoleResult = await getRoleRepository().getUserRole(
      spaceId,
      'space',
      userId,
    );

    const existingRoles = existingRoleResult.data || [];

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

    const result = await getRoleRepository().createRole({
      userId,
      roleId: followerRole.role!.id,
      resourceId: spaceId,
      source: 'space',
    });

    if (result.error) {
      return createErrorResponse('Failed to unfollow space', 500);
    }

    return createSuccessResponse('Successfully followed space');
  } catch (error: unknown) {
    console.error('Error following space:', error);
    return createErrorResponse('Internal server error', 500);
  }
};
