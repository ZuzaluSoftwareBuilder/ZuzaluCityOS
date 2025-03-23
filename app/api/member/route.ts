import { NextRequest } from 'next/server';
import { UserRoleData } from '@/types';
import { GET_MEMBERS_QUERY } from '@/services/graphql/role';
import { executeQuery } from '@/utils/ceramic';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const resource = searchParams.get('resource');

  if (!id || !resource) {
    return createErrorResponse(
      'Missing required parameters: id and resource are required',
      400,
    );
  }

  try {
    const data = await executeQuery(GET_MEMBERS_QUERY, {
      source: 'space',
      resourceId: id,
    });

    if (data.errors) {
      return createErrorResponse('Failed to fetch members', 500);
    }

    if ('zucityUserRolesIndex' in data.data!) {
      return createSuccessResponse(
        data?.data?.zucityUserRolesIndex?.edges?.map((edge) => edge?.node) ||
          [],
      );
    }

    return createErrorResponse('Failed to fetch members', 500);
  } catch (e) {
    console.error('Unexpected error:', e);
    return createErrorResponse('Internal Server Error', 500);
  }
}
