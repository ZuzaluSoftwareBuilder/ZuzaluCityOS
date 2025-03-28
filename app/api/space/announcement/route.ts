import { executeQuery } from '@/utils/ceramic';
import { GET_SPACE_ANNOUNCEMENTS_QUERY } from '@/services/graphql/announcements';
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

    const result = await executeQuery(GET_SPACE_ANNOUNCEMENTS_QUERY, {
      id,
      first: 100,
    });

    if (result.errors) {
      return createErrorResponse(
        'Failed to query space announcements',
        500,
      );
    }

    const spaceNode = result.data.node;
    
    if (!spaceNode || !('announcements' in spaceNode)) {
      return createErrorResponse('Space not found', 404);
    }

    return createSuccessResponse({
      announcements: spaceNode.announcements.edges,
      pageInfo: spaceNode.announcements.pageInfo,
    });
  } catch (error: unknown) {
    console.error('Error querying space announcements:', error);
    return createErrorResponse('Internal server error', 500);
  }
};
