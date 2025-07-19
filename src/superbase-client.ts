import { createClient } from '@supabase/supabase-js'
import { Database } from '../database.types';

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables.');
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseKey
);
