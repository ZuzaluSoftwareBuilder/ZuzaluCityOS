import { executeQuery } from '@/utils/ceramic';
import { GET_SPACE_INSTALLED_APPS } from '@/services/graphql/space';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return createErrorResponse('Missing spaceId', 400);
    }

    const result = await executeQuery(GET_SPACE_INSTALLED_APPS, {
      filters: {
        where: {
          sourceId: { equalTo: id },
        },
      },
      first: 100,
    });

    if (result.errors) {
      return createErrorResponse(
        'Failed to query application installation status',
        500,
      );
    }

    const installedApps = result.data.zucityInstalledAppIndex?.edges;

    return createSuccessResponse({
      installedApps,
      pageInfo: result.data.zucityInstalledAppIndex?.pageInfo,
    });
  } catch (error: unknown) {
    console.error('Error querying application installation status:', error);
    return createErrorResponse('Internal server error', 500);
  }
};
