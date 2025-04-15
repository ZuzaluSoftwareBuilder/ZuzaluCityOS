import supabaseAdmin from '@/app/api/utils/supabase';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return createErrorResponse('Invalid request parameters', 400);
    }

    const lowerCaseAddress = address.toLowerCase();

    const { count, error } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('address', lowerCaseAddress);

    if (error) {
      console.error('API CheckReg Database query failed', error.message);
      return createErrorResponse('Database query failed', 500);
    }

    const isRegistered = Boolean(count && count > 0);

    return createSuccessResponse({ registered: isRegistered });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('API CheckReg Server error', errorMessage);
    return createErrorResponse('Internal server error', 500);
  }
}
