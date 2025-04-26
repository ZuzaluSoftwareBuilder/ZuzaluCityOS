import { Result } from '@/models/base';
import { InstalledApp } from '@/models/dapp';
import { getDappRepository } from '@/repositories/dapp';
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

    const dappRepository = getDappRepository();
    const result: Result<InstalledApp[]> =
      await dappRepository.getSpaceInstalledApps(id);

    if (result.error) {
      return createErrorResponse(
        'Failed to query application installation status',
        500,
      );
    }

    const installedApps = result.data;

    return createSuccessResponse({
      installedApps,
      pageInfo: {}, // Note: pageInfo may need adjustment based on the actual return structure
    });
  } catch (error: unknown) {
    console.error('Error querying application installation status:', error);
    return createErrorResponse('Internal server error', 500);
  }
};
