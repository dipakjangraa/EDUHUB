import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// Client-side Supabase (uses anon key — safe to expose)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side admin client — only works in API routes / server components
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export type Profile = {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  xp: number;
  level: number;
  coins: number;
  streak: number;
  is_premium: boolean;
};
