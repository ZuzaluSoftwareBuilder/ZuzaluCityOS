import { executeQuery } from '@/utils/ceramic';
import { GET_SPACE_ANNOUNCEMENTS_QUERY } from '@/services/graphql/announcements';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { hasRequiredPermission } from '@/utils/service/role';
import { PermissionName } from '@/types';
import { withSessionValidation } from '@/utils/authMiddleware';
import { z } from 'zod';

const querySchema = z.object({
  id: z.string().min(1, 'Space ID is required'),
  resource: z.string().min(1, 'Resource is required'),
});

export const POST = withSessionValidation(async (request, sessionData) => {
  try {
    const body = await request.json();
    const validationResult = querySchema.safeParse(body);
    if (!validationResult.success) {
      return createErrorResponse(
        'Invalid request parameters',
        400,
        validationResult.error.format(),
      );
    }

    const { id } = validationResult.data;

    if (!id) {
      return createErrorResponse('Missing spaceId', 400);
    }

    if (
      !hasRequiredPermission(
        sessionData,
        PermissionName.VIEW_SPACE_ANNOUNCEMENTS,
      )
    ) {
      return createErrorResponse('Permission denied', 403);
    }

    const result = await executeQuery(GET_SPACE_ANNOUNCEMENTS_QUERY, {
      id,
      first: 100,
    });

    if (result.errors) {
      return createErrorResponse('Failed to query space announcements', 500);
    }

    const spaceNode = result.data.node;

    if (!spaceNode || !('announcements' in spaceNode)) {
      return createErrorResponse('Space not found', 404);
    }

    return createSuccessResponse({
      announcements: spaceNode.announcements.edges,
      pageInfo: spaceNode.announcements.pageInfo,
    });
  } catch (error: unknown) {
    console.error('Error querying space announcements:', error);
    return createErrorResponse('Internal server error', 500);
  }
});
