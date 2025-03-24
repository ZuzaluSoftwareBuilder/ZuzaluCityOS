import { withSessionValidation } from '@/utils/authMiddleware';
import { authenticateWithSpaceId, executeQuery } from '@/utils/ceramic';
import { GET_SPACE_INSTALLED_APPS } from '@/services/graphql/space';
import { z } from 'zod';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';

const getDAppSchema = z.object({
  id: z.string().min(1, 'Resource ID is required'),
  resource: z.string().min(1, 'Resource type is required'),
  spaceId: z.string().min(1, 'Space ID is required'),
});

export const POST = withSessionValidation(async (request, sessionData) => {
  try {
    const body = await request.json();
    const validationResult = getDAppSchema.safeParse(body);
    if (!validationResult.success) {
      return createErrorResponse(
        'Invalid request parameters',
        400,
        validationResult.error.format(),
      );
    }
    
    const { spaceId: validatedSpaceId } = validationResult.data;
    
    // Authenticate and get private key
    const error = await authenticateWithSpaceId(validatedSpaceId);
    if (error) {
      return createErrorResponse('Error getting private key', 500);
    }
    
    const result = await executeQuery(GET_SPACE_INSTALLED_APPS, {
      filters: {
        where: {
          sourceId: { equalTo: validatedSpaceId }
        }
      },
      first: 100
    });
    
    if (result.errors) {
      return createErrorResponse('Failed to query application installation status', 500);
    }
    
    const installedApps = result.data.zucityInstalledAppIndex?.edges;
    
    return createSuccessResponse({
      installedApps,
      pageInfo: result.data.zucityInstalledAppIndex?.pageInfo
    });
  } catch (error: unknown) {
    console.error('Error querying application installation status:', error);
    return createErrorResponse('Internal server error', 500);
  }
});
