import { Database } from '@/types/supabase';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey: string = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

const supabaseAdmin: SupabaseClient<Database> = createClient(
  supabaseUrl,
  supabaseKey,
);

export default supabaseAdmin;
