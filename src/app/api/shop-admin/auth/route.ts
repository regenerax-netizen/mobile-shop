import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateShopAdminToken } from "@/lib/shop-admin-auth";

// crypto is still used for password hash comparison below

/* POST — Login: validate shop_id + password, set cookie */
export async function POST(request: NextRequest) {
  try {
    const { shopId, password } = await request.json();

    if (!shopId || !password) {
      return NextResponse.json(
        { error: "Shop ID and password are required." },
        { status: 400 },
      );
    }

    // Check shop exists
    const { data: shop } = await supabaseAdmin
      .from("shops")
      .select("id, name, slug")
      .eq("id", shopId)
      .single();

    if (!shop) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 },
      );
    }

    // Verify password from shop_admin_credentials table
    // Falls back to default password if no entry exists
    const { data: creds } = await supabaseAdmin
      .from("shop_admin_credentials")
      .select("password_hash")
      .eq("shop_id", shopId)
      .single();

    const defaultPassword = process.env.SHOP_ADMIN_DEFAULT_PASSWORD || "repair2025";

    if (creds) {
      const inputHash = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");
      if (inputHash !== creds.password_hash) {
        return NextResponse.json(
          { error: "Invalid credentials." },
          { status: 401 },
        );
      }
    } else {
      // Use default password if no credentials are configured
      if (password !== defaultPassword) {
        return NextResponse.json(
          { error: "Invalid credentials." },
          { status: 401 },
        );
      }
    }

    const token = generateShopAdminToken(shopId);

    const response = NextResponse.json({
      success: true,
      shop: { id: shop.id, name: shop.name, slug: shop.slug },
    });

    response.cookies.set("shop_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "An error occurred." },
      { status: 500 },
    );
  }
}

/* DELETE — Logout: clear the cookie */
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("shop_admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  return response;
}
