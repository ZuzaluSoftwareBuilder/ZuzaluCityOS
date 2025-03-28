import { withSessionValidation } from '@/utils/authMiddleware';
import { dayjs } from '@/utils/dayjs';
import utc from 'dayjs/plugin/utc';
import { authenticateWithSpaceId, executeQuery } from '@/utils/ceramic';
import { CREATE_ANNOUNCEMENT_MUTATION } from '@/services/graphql/announcements';
import { z } from 'zod';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { hasRequiredPermission } from '@/utils/service/role';
import { PermissionName } from '@/types';

dayjs.extend(utc);

const createAnnouncementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  spaceId: z.string().min(1, 'Space ID is required'),
  id: z.string().min(1, 'Resource ID is required'),
  resource: z.string().min(1, 'Resource type is required'),
  tags: z.array(z.string()).optional(),
});

export const POST = withSessionValidation(async (request, sessionData) => {
  try {
    const body = await request.json();
    const validationResult = createAnnouncementSchema.safeParse(body);
    if (!validationResult.success) {
      return createErrorResponse(
        'Invalid request parameters',
        400,
        validationResult.error.format(),
      );
    }

    const { title, description, spaceId, tags } = validationResult.data;
    const sourceId = spaceId;

    // TODO: just admin can create announcement?
    if (!hasRequiredPermission(sessionData, PermissionName.MANAGE_ADMIN_ROLE)) {
      return createErrorResponse('Permission denied', 403);
    }

    const error = await authenticateWithSpaceId(spaceId);
    if (error) {
      return createErrorResponse('Error getting private key', 500);
    }

    const result = await executeQuery(CREATE_ANNOUNCEMENT_MUTATION, {
      input: {
        content: {
          title,
          description,
          spaceId,
          sourceId,
          tags: tags?.map((tag) => ({ tag })),
          createdAt: dayjs().utc().toISOString(),
          updatedAt: dayjs().utc().toISOString(),
        },
      },
    });

    if (result.errors) {
      return createErrorResponse('Failed to create announcement', 500);
    }

    return createSuccessResponse({
      announcement: result.data?.createZucityAnnouncement?.document,
    });
  } catch (error: unknown) {
    console.error('Error creating announcement:', error);
    return createErrorResponse('Internal server error', 500);
  }
});
