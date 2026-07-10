import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const getSupabaseServer = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase credentials");
  }

  // 1. Create a new client instance for this request (so sessions don't leak between users)
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // Don't persist on server
    },
  });

  // 2. Read cookies sent by the browser
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value;
  const refreshToken = cookieStore.get("sb-refresh-token")?.value;

  // 3. Set the session on this client instance
  if (accessToken) {
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || "",
    });
  }

  return supabase;
};

export const fetchUserProfile = async () => {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id) 
    .single();         
  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
  return profile;
};
