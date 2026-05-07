import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Validate at runtime, but allow the build to pass placeholders
  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV === "production" && typeof window !== "undefined") {
      throw new Error("Missing Supabase Environment Variables");
    }
    // Return a dummy client during build to prevent crashes
    return createClient("https://dummy.supabase.co", "dummy-key");
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
};

// Export the singleton for easy use - but make it lazy
export const supabase = (() => getSupabase())();
