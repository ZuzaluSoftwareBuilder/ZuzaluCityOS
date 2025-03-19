import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/client';
import { withSessionValidation } from '@/utils/authMiddleware';

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
      .from('user_role')
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

// 使用session验证中间件包装POST请求处理函数
export const POST = withSessionValidation(async (request, session) => {
  try {
    const body = await request.json();
    const { spaceId, roleId } = body;

    // 验证必需参数
    if (!spaceId || !roleId) {
      return NextResponse.json(
        { error: 'Space ID and Role ID are required' },
        { status: 400 },
      );
    }

    // 从session获取用户信息
    const userId = session.user.id;

    // 插入用户角色
    const { data, error } = await supabase.from('user_role').insert({
      user_id: userId,
      resource_id: spaceId,
      resource: 'space',
      role_id: roleId,
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to add member to space' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (e) {
    console.error('Unexpected error:', e);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
});
