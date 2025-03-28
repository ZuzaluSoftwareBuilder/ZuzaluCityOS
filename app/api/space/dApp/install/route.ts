import { withSessionValidation } from '@/utils/authMiddleware';
import { dayjs } from '@/utils/dayjs';
import utc from 'dayjs/plugin/utc';
import { authenticateWithSpaceId, executeQuery } from '@/utils/ceramic';
import { INSTALL_DAPP_TO_SPACE, GET_SPACE_INSTALLED_APPS } from '@/services/graphql/space';
import { z } from 'zod';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { hasRequiredPermission } from '@/utils/service/role';
import { PermissionName } from '@/types';

dayjs.extend(utc);

const installDAppSchema = z.object({
  id: z.string().min(1, 'Resource ID is required'),
  resource: z.string().min(1, 'Resource type is required'),
  spaceId: z.string().min(1, 'Space ID is required'),
  appId: z.string().optional(),
  nativeAppName: z.string().optional(),
}).refine(data => !!data.appId || !!data.nativeAppName, {
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

    if (
      !hasRequiredPermission(sessionData, PermissionName.MANAGE_APPS)
    ) {
      return createErrorResponse('Permission denied', 403);
    }

    const error = await authenticateWithSpaceId(spaceId);
    if (error) {
      return createErrorResponse('Error getting private key', 500);
    }

    const installedAppsResult = await executeQuery(GET_SPACE_INSTALLED_APPS, {
      filters: {
        where: {
          sourceId: { equalTo: spaceId }
        }
      },
      first: 100
    });

    if (installedAppsResult.errors) {
      return createErrorResponse('Failed to query application installation status', 500);
    }

    const installedApps = installedAppsResult.data?.zucityInstalledAppIndex?.edges || [];
    
    const isAppAlreadyInstalled = installedApps.some(app => {
      const node = app?.node;
      if (!node) return false;
      
      if (appId && node.installedAppId === appId) {
        return true;
      }
      
      if (nativeAppName && node.nativeAppName === nativeAppName) {
        return true;
      }
      
      return false;
    });
    
    if (isAppAlreadyInstalled && installedApps.length > 0) {
      const installedApp = installedApps.find(app => {
        const node = app?.node;
        if (!node) return false;
        
        if (appId && node.installedAppId === appId) {
          return true;
        }
        
        if (nativeAppName && node.nativeAppName === nativeAppName) {
          return true;
        }
        
        return false;
      })?.node;
      
      if (installedApp) {
        return createSuccessResponse({
          installedAppIndexId: installedApp.id,
          message: 'dApp already installed'
        });
      }
    }
    
    const result = await executeQuery(INSTALL_DAPP_TO_SPACE, {
      input: {
        content: {
          spaceId,
          sourceId,
          installedAppId: appId,
          nativeAppName,
          createdAt: dayjs().utc().toISOString(),
          updatedAt: dayjs().utc().toISOString(),
        },
      },
    });

    if (result.errors) {
      return createErrorResponse('Failed to install dApp', 500);
    }

    return createSuccessResponse({
      installedAppIndexId: result.data.createZucityInstalledApp?.document.id,
    });
  } catch (error: unknown) {
    console.error('Error installing dApp:', error);
    return createErrorResponse('Internal server error', 500);
  }
});
