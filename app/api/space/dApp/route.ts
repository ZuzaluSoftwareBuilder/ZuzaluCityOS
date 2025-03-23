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

    // TODO: Validate user permissions?
    
    const { spaceId: validatedSpaceId } = validationResult.data;
    
    // Authenticate and get private key
    const error = await authenticateWithSpaceId(validatedSpaceId);
    if (error) {
      return createErrorResponse('Error getting private key', 500);
    }
    
    // According to the comments, since there's no direct spaceId filter field in the schema, we can use two methods:
    // 1. Get all applications and filter on the client side
    // 2. Use sourceId filter (if sourceId and spaceId are the same)
    
    // Here we use method 2, because from the install route we see that sourceId and spaceId are the same
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
    
    // If further filtering is needed, we can use the filterInstalledAppsBySpaceId function
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
