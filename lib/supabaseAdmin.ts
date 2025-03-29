// lib/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js';

// Ensure environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
}
if (!supabaseServiceRoleKey) {
  // Only throw error server-side where this key is expected
  if (typeof window === 'undefined') {
     throw new Error("Missing environment variable: SUPABASE_SERVICE_ROLE_KEY");
  }
  // Client-side doesn't need the service role key, but log a warning if URL is missing
  console.warn("Supabase URL or Service Role Key might be missing if running client-side without URL.");
}

// Create a single supabase client for server-side operations
// IMPORTANT: Use the Service Role Key only in server-side code (API routes, Server Components)
// Never expose the Service Role Key to the browser!
export const supabaseAdmin = createClient(
    supabaseUrl!, // Assert non-null as we check above
    supabaseServiceRoleKey!, // Assert non-null for server-side context
    {
        auth: {
            // Required for service_role key
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

// You might also want a separate client for client-side operations using the anon key
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);