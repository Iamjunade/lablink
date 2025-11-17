import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://hyovelskliwyxgzooisu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5b3ZlbHNrbGl3eXhnem9vaXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NDQ1NzIsImV4cCI6MjA3NzAyMDU3Mn0.HT1OBMglsqCNe_0MFYmDEXxnxAUiIjurED9mAvDjeug";

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and anon key are required.");
}

// Disable session persistence as it can cause issues in sandboxed environments
// and is not needed for this app's functionality. This is a likely fix for
// the generic "Failed to fetch" error.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: false
    }
});
