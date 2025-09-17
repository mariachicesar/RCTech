import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../database.types';

// Lazy-init Supabase to avoid throwing during build/prerender when env vars
// are not present. We only create the client the first time it’s actually used.
let client: SupabaseClient<Database> | null = null;

function ensureClient(): SupabaseClient<Database> {
  if (!client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables.');
    }
    client = createClient<Database>(supabaseUrl, supabaseKey);
  }
  return client;
}

// Export a Proxy so existing imports `supabase.auth...` keep working without
// changing call sites.
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_t, prop) {
    const c = ensureClient();
  // @ts-expect-error - dynamic property access delegated to real client
    return c[prop];
  },
});
