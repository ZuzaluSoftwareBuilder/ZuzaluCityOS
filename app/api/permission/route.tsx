import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { supabase } from '@/utils/supabase/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase.from('permission').select('*');

    if (error) {
      console.error('Supabase query error:', error);
      return createErrorResponse('Failed to fetch permissions', 500, error);
    }

    if (!data || data.length === 0) {
      return createSuccessResponse({ data: [] }, 'No permissions found', 200);
    }

    return createSuccessResponse(data, 'Permissions fetched successfully', 200);
  } catch (e) {
    console.error('Unexpected error:', e);
    return createErrorResponse('Internal Server Error', 500, e);
  }
}
