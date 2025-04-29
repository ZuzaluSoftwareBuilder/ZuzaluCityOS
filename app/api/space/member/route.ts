import { supabase } from '@/utils/supabase/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const spaceId = searchParams.get('spaceId');

  if (!spaceId) {
    return NextResponse.json(
      { error: 'Space ID is required' },
      { status: 400 },
    );
  }

  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select(
        `
        *,
        role(
          id,
          name,
        )
      `,
      )
      .eq('resource_id', spaceId)
      .eq('resource', 'space');

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch space members' },
        { status: 500 },
      );
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
