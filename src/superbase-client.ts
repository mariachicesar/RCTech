import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  'https://ghojojqkptplppuiikqm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdob2pvanFrcHRwbHBwdWlpa3FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMDM3ODcsImV4cCI6MjA2Nzc3OTc4N30.ylgIirpH-d2SFvxBGklPafYaLsZR9OhfOj4F2YZ3YCY'
)
