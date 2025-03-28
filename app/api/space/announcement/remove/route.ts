import { withSessionValidation } from '@/utils/authMiddleware';
import { dayjs } from '@/utils/dayjs';
import utc from 'dayjs/plugin/utc';
import { authenticateWithSpaceId, executeQuery } from '@/utils/ceramic';
import { DISABLE_ANNOUNCEMENT_INDEXING_MUTATION } from '@/services/graphql/announcements';
import { z } from 'zod';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { hasRequiredPermission } from '@/utils/service/role';
import { PermissionName } from '@/types';

dayjs.extend(utc);

const removeAnnouncementSchema = z.object({
  id: z.string().min(1, 'Space ID is required'),
  resource: z.string().min(1, 'Resource is required'),

  announcementId: z.string().min(1, 'Announcement ID is required'),
});

export const POST = withSessionValidation(async (request, sessionData) => {
  try {
    const body = await request.json();
    const validationResult = removeAnnouncementSchema.safeParse(body);
    if (!validationResult.success) {
      return createErrorResponse(
        'Invalid request parameters',
        400,
        validationResult.error.format(),
      );
    }
    const { id, announcementId } = validationResult.data;

    if (!hasRequiredPermission(sessionData, PermissionName.MANAGE_ADMIN_ROLE)) {
      return createErrorResponse('Permission denied', 403);
    }

    const error = await authenticateWithSpaceId(id);
    if (error) {
      return createErrorResponse('Error getting private key', 500);
    }

    const result = await executeQuery(DISABLE_ANNOUNCEMENT_INDEXING_MUTATION, {
      input: {
        id: announcementId,
        shouldIndex: false,
      },
    });

    if (result.errors) {
      return createErrorResponse('Failed to remove announcement', 500);
    }

    return createSuccessResponse('Announcement removed successfully');
  } catch (error: unknown) {
    console.error('Error removing announcement:', error);
    return createErrorResponse('Internal server error', 500);
  }
});
