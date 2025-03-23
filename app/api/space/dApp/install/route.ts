import { withSessionValidation } from '@/utils/authMiddleware';
import { dayjs } from '@/utils/dayjs';
import utc from 'dayjs/plugin/utc';
import { authenticateWithSpaceId, executeQuery } from '@/utils/ceramic';
import { INSTALL_DAPP_TO_SPACE } from '@/services/graphql/space';
import { z } from 'zod';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { hasRequiredPermission } from '@/utils/service/role';

dayjs.extend(utc);

const installDAppSchema = z.object({
  id: z.string().min(1, 'Resource ID is required'),
  resource: z.string().min(1, 'Resource type is required'),
  spaceId: z.string().min(1, 'Space ID is required'),
  appId: z.string().min(1, 'App ID is required'),
});

export const POST = withSessionValidation(async (request, sessionData) => {
  try {
    const body = await request.json();
    const validationResult = installDAppSchema.safeParse(body);
    if (!validationResult.success) {
      return createErrorResponse(
        'Invalid request parameters',
        400,
        validationResult.error.format(),
      );
    }
    const { spaceId, appId } = validationResult.data;
    // sourceId is the same as spaceId
    const sourceId = spaceId;

    // Verify if user has permission to install dApp (admin or owner)
    if (
      !hasRequiredPermission(sessionData, 'admin') &&
      !hasRequiredPermission(sessionData, 'owner')
    ) {
      return createErrorResponse('Permission denied', 403);
    }

    // Authenticate and get private key
    const error = await authenticateWithSpaceId(spaceId);
    if (error) {
      return createErrorResponse('Error getting private key: ' + error.message, 500);
    }

    // Execute GraphQL query to install dApp
    const result = await executeQuery(INSTALL_DAPP_TO_SPACE, {
      input: {
        content: {
          spaceId,
          sourceId,
          installedAppId: appId,
          createdAt: dayjs().utc().toISOString(),
          updatedAt: dayjs().utc().toISOString(),
        },
      },
    });

    if (result.errors) {
      return createErrorResponse('Failed to install dApp', 500);
    }

    return createSuccessResponse('dApp installed successfully');
  } catch (error: unknown) {
    console.error('Error installing dApp:', error);
    return createErrorResponse('Internal server error', 500);
  }
});
