import { NextRequest, NextResponse } from 'next/server';
import { UserRoleData } from '@/types';
import { composeClient } from '@/constant';
import { GET_MEMBERS_QUERY } from '@/services/graphql/role';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const resource = searchParams.get('resource');

  if (!id || !resource) {
    return NextResponse.json(
      { error: 'Missing required parameters: id and resource are required' },
      { status: 400 },
    );
  }

  try {
    const data = await composeClient.executeQuery<UserRoleData>(
      GET_MEMBERS_QUERY,
      {
        source: 'space',
        resourceId: id,
      },
    );

    if (data.errors) {
      return NextResponse.json(
        { error: 'Failed to fetch members' },
        { status: 500 },
      );
    }

    if ('zucityUserRolesIndex' in data.data!) {
      const userRoleData: UserRoleData = data.data as UserRoleData;
      return NextResponse.json(
        {
          data: userRoleData.zucityUserRolesIndex.edges.map(
            (edge) => edge.node,
          ),
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 },
    );
  } catch (e) {
    console.error('Unexpected error:', e);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
