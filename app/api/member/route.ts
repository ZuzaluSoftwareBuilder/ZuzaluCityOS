import { getRoleRepository } from '@/repositories/role';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { NextRequest } from 'next/server';

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
    const data = await getRoleRepository().getMembers(resource, id);

    if (data.error) {
      return createErrorResponse('Failed to fetch members', 500);
    }

    if (data.data) {
      return createSuccessResponse(data.data);
    }

    return createErrorResponse('Failed to fetch members', 500);
  } catch (e) {
    console.error('Unexpected error:', e);
    return createErrorResponse('Internal Server Error', 500);
  }
}
