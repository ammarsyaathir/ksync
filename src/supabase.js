import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aposfkuaqgxlfdetcdyq.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_jSPFpJLiBG56Y7_IGRwc9g_wBAIphFU';

export const supabase = createClient(supabaseUrl, supabaseKey);
