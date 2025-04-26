import { Result } from '@/models/base';
import { InstalledApp } from '@/models/dapp';
import { getDappRepository } from '@/repositories/dapp';
import { PermissionName } from '@/types';
import { withSessionValidation } from '@/utils/authMiddleware';
import { authenticateWithSpaceId } from '@/utils/ceramic';
import { dayjs } from '@/utils/dayjs';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { hasRequiredPermission } from '@/utils/service/role';
import utc from 'dayjs/plugin/utc';
import { z } from 'zod';

dayjs.extend(utc);

const installDAppSchema = z
  .object({
    id: z.string().min(1, 'Resource ID is required'),
    resource: z.string().min(1, 'Resource type is required'),
    spaceId: z.string().min(1, 'Space ID is required'),
    appId: z.string().optional(),
    nativeAppName: z.string().optional(),
  })
  .refine((data) => !!data.appId || !!data.nativeAppName, {
    message: 'Either App Id or Native App Name must be provided',
    path: ['appId', 'nativeAppName'],
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
    const { spaceId, appId, nativeAppName } = validationResult.data;
    const sourceId = spaceId;
    if (!hasRequiredPermission(sessionData, PermissionName.MANAGE_APPS)) {
      return createErrorResponse('Permission denied', 403);
    }

    const error = await authenticateWithSpaceId(spaceId);
    if (error) {
      return createErrorResponse('Error getting private key', 500);
    }

    const dappRepository = getDappRepository();
    const installedAppsResult: Result<InstalledApp[]> =
      await dappRepository.getSpaceInstalledApps(spaceId);

    if (installedAppsResult.error) {
      return createErrorResponse(
        'Failed to query application installation status',
        500,
      );
    }

    const installedApps = installedAppsResult.data || [];

    const isAppAlreadyInstalled = installedApps.some((app) => {
      if (!app) return false;

      if (appId && app.installedAppId === appId) {
        return true;
      }

      if (nativeAppName && app.nativeAppName === nativeAppName) {
        return true;
      }

      return false;
    });

    if (isAppAlreadyInstalled && installedApps.length > 0) {
      const installedApp = installedApps.find((app) => {
        if (!app) return false;

        if (appId && app.installedAppId === appId) {
          return true;
        }

        if (nativeAppName && app.nativeAppName === nativeAppName) {
          return true;
        }

        return false;
      });

      if (installedApp) {
        return createSuccessResponse(
          {
            installedAppIndexId: installedApp.id,
          },
          'dApp already installed',
        );
      }
    }

    const installResult = await dappRepository.installDapp(
      spaceId,
      appId || '',
      nativeAppName,
    );
    console.log('installResult', installResult);
    if (installResult.error) {
      return createErrorResponse('Failed to install dApp', 500);
    }

    return createSuccessResponse(
      {
        installedAppIndexId: installResult.data?.id,
      },
      'dApp installed successfully',
    );
  } catch (error: unknown) {
    console.error('Error installing dApp:', error);
    return createErrorResponse('Internal server error', 500);
  }
});
