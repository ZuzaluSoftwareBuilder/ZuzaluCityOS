import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/utils/supabase/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const source = searchParams.get('source');

    if (!id || !source) {
      return NextResponse.json(
        { error: 'Missing required parameters: id and source are required' },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from('role_permission')
      .select(
        `
        *,
        role(
          id,
          name,
          level
        )
      `,
      )
      .or(`resource.eq.${source},resource.is.null`)
      .or(`resource_id.eq.${id},resource_id.is.null`);

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch role permissions' },
        { status: 500 },
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (e) {
    console.error('Unexpected error:', e);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
