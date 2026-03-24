import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("shop_config")
    .select("*")
    .order("key");

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Convert array of { key, value } rows into a simple object
  const config: Record<string, string> = {};
  for (const row of data ?? []) {
    config[row.key] = row.value;
  }
  return NextResponse.json(config);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: Record<string, string> = await req.json();

  // Upsert each key/value pair
  const upserts = Object.entries(body).map(([key, value]) => ({ key, value }));

  const { error } = await supabaseAdmin
    .from("shop_config")
    .upsert(upserts, { onConflict: "key" });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
