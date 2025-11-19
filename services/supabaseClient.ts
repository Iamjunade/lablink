import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Using a module-scoped variable to store the initialized client (memoization)
let _supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
    // If the client is already initialized, return it
    if (_supabaseInstance) {
        return _supabaseInstance;
    }

    // Safely access environment variables, with fallbacks to the provided values.
    const supabaseUrl = (typeof process !== 'undefined' && process.env ? process.env.NEXT_PUBLIC_SUPABASE_URL : undefined) || "https://hyovelskliwyxgzooisu.supabase.co";
    const supabaseAnonKey = (typeof process !== 'undefined' && process.env ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined) || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5b3ZlbHNrbGl3eXhnem9vaXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NDQ1NzIsImV4cCI6MjA3NzAyMDU3Mn0.HT1OBMglsqCNe_0MFYmDEXxnxAUiIjurED9mAvDjeug";

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error("Supabase URL and anon key are required. Supabase client will not be initialized.");
        return null;
    }

    try {
        // Only attempt to create the client if it hasn't been created yet
        _supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                persistSession: false // Disable session persistence as it can cause issues in sandboxed environments.
            },
            global: {
                fetch: window.fetch.bind(window) // Explicitly provide window.fetch for sandboxed environments.
            }
        });
        console.log("Supabase client initialized successfully.");
        return _supabaseInstance;
    } catch (e) {
        console.error("Failed to initialize Supabase client. Running in offline mode.", e);
        _supabaseInstance = null; // Ensure it's null if initialization fails
        return null;
    }
};