import { withSessionValidation } from '@/utils/authMiddleware';
import { dayjs } from '@/utils/dayjs';
import utc from 'dayjs/plugin/utc';
import { authenticateWithSpaceId, executeQuery } from '@/utils/ceramic';
import { UNINSTALL_DAPP_FROM_SPACE } from '@/services/graphql/space';
import { z } from 'zod';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { hasRequiredPermission } from '@/utils/service/role';
import { PermissionName } from '@/types';

dayjs.extend(utc);

const uninstallDAppSchema = z.object({
  id: z.string().min(1, 'Resource ID is required'),
  resource: z.string().min(1, 'Resource type is required'),
  installedAppIndexId: z.string().min(1, 'Installed app index ID is required'),
});

export const POST = withSessionValidation(async (request, sessionData) => {
  try {
    const body = await request.json();
    const validationResult = uninstallDAppSchema.safeParse(body);
    if (!validationResult.success) {
      return createErrorResponse(
        'Invalid request parameters',
        400,
        validationResult.error.format(),
      );
    }
    const { id, installedAppIndexId } = validationResult.data;

    if (
      !hasRequiredPermission(sessionData, PermissionName.MANAGE_APPS)
    ) {
      return createErrorResponse('Permission denied', 403);
    }

    const error = await authenticateWithSpaceId(id);
    if (error) {
      return createErrorResponse('Error getting private key', 500);
    }

    const result = await executeQuery(UNINSTALL_DAPP_FROM_SPACE, {
      input: {
        id: installedAppIndexId,
        shouldIndex: false,
      },
    });

    if (result.errors) {
      return createErrorResponse('Failed to uninstall dApp', 500);
    }

    return createSuccessResponse('dApp uninstalled successfully');
  } catch (error: unknown) {
    console.error('Error uninstalling dApp:', error);
    return createErrorResponse('Internal server error', 500);
  }
});
