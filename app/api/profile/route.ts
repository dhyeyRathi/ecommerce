import { NextResponse } from "next/server";
import { fetchUserProfile } from "@/app/lib/supabaseServer";

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
