import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("shops")
    .select("*")
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    name, slug, tagline, phone, whatsapp, email, address,
    google_maps_embed_url, logo_url, hero_image_url, accent_color,
    opening_hours, services, active,
  } = body;

  const { data, error } = await supabaseAdmin
    .from("shops")
    .insert({
      name, slug, tagline, phone, whatsapp, email, address,
      google_maps_embed_url, logo_url, hero_image_url, accent_color,
      opening_hours: opening_hours ?? [],
      services: services ?? [],
      active: active ?? true,
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
