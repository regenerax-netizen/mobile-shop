import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string | null) ?? "product-images";

  if (!file)
    return NextResponse.json({ error: "No file provided" }, { status: 400 });

  // Validate type and size
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!allowedTypes.includes(file.type))
    return NextResponse.json({ error: "Only image files (JPG, PNG, WebP, GIF, SVG) are allowed" }, { status: 400 });
  if (file.size > 10 * 1024 * 1024)
    return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Determine bucket and path based on folder
  const useShopBucket = folder === "hero-images" || folder === "partner-logos";
  const bucket = useShopBucket ? "shop-images" : "images";
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const path = `${folder}/${filename}`;

  // For SVGs, set the correct content type explicitly
  const contentType = ext === "svg" ? "image/svg+xml" : file.type;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, buffer, {
      contentType,
      upsert: false,
    });

  if (uploadError)
    return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: urlData } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(path);

  return NextResponse.json({ url: urlData.publicUrl });
}

