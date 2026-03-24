import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    name, slug, tagline, phone, whatsapp, email, address,
    google_maps_embed_url, logo_url, hero_image_url, hero_images,
    accent_color, secondary_color, partner_services, partner_logos,
    opening_hours, services, active,
  } = body;

  const { data, error } = await supabaseAdmin
    .from("shops")
    .update({
      name, slug, tagline, phone, whatsapp, email, address,
      google_maps_embed_url, logo_url, hero_image_url, hero_images,
      accent_color, secondary_color, partner_services, partner_logos,
      opening_hours, services, active,
    })
    .eq("id", params.id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabaseAdmin
    .from("shops")
    .delete()
    .eq("id", params.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
