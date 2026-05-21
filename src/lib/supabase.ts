import { createClient } from '@supabase/supabase-js';

// Client-side Supabase (uses anon key — safe to expose)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side admin client — only works in API routes / server components
// NEVER imported in client components
export function getSupabaseAdmin() {
  if (typeof window !== 'undefined') {
    throw new Error('supabaseAdmin cannot be used on the client side');
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Keep backward compat for API routes that import supabaseAdmin directly
// This is safe because API routes always run on the server
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

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
