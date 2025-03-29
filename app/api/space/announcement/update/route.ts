import { withSessionValidation } from '@/utils/authMiddleware';
import { dayjs } from '@/utils/dayjs';
import utc from 'dayjs/plugin/utc';
import { authenticateWithSpaceId, executeQuery } from '@/utils/ceramic';
import { UPDATE_ANNOUNCEMENT_MUTATION } from '@/services/graphql/announcements';
import { z } from 'zod';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { hasRequiredPermission } from '@/utils/service/role';
import { PermissionName } from '@/types';

dayjs.extend(utc);

const updateAnnouncementSchema = z.object({
  id: z.string().min(1, 'Space ID is required'),
  resource: z.string().min(1, 'Resource is required'),

  announcementId: z.string().min(1, 'Announcement ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  tags: z.array(z.string()).optional(),
});

export const PUT = withSessionValidation(async (request, sessionData) => {
  try {
    const body = await request.json();
    const validationResult = updateAnnouncementSchema.safeParse(body);
    if (!validationResult.success) {
      return createErrorResponse(
        'Invalid request parameters',
        400,
        validationResult.error.format(),
      );
    }

    const { id, announcementId, title, description, tags } =
      validationResult.data;

    if (!hasRequiredPermission(sessionData, PermissionName.MANAGE_SPACE_ANNOUNCEMENTS)) {
      return createErrorResponse('Permission denied', 403);
    }

    const error = await authenticateWithSpaceId(id);
    if (error) {
      return createErrorResponse('Error getting private key', 500);
    }

    const result = await executeQuery(UPDATE_ANNOUNCEMENT_MUTATION, {
      input: {
        id: announcementId,
        content: {
          title,
          description,
          tags: tags?.map((tag) => ({ tag })),
          updatedAt: dayjs().utc().toISOString(),
        },
      },
    });

    if (result.errors) {
      return createErrorResponse('Failed to update announcement', 500);
    }

    return createSuccessResponse({
      announcement: result.data?.updateZucityAnnouncement?.document,
    });
  } catch (error: unknown) {
    console.error('Error updating announcement:', error);
    return createErrorResponse('Internal server error', 500);
  }
});
