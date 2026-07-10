import { NextResponse } from "next/server";
import { fetchUserProfile, getSupabaseServer } from "@/app/lib/supabaseServer";

export async function GET() {
  try {
    const profile = await fetchUserProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(profile);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const supabase = await getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { theme } = body;

    const { data: updatedProfile, error } = await supabase
      .from("users")
      .update({ theme })
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(updatedProfile);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update profile" }, { status: 500 });
  }
}
