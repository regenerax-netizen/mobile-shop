import { NextRequest, NextResponse } from "next/server";
import { generateShopAdminToken } from "@/lib/shop-admin-auth";

/* POST — Login: validate password, set cookie */
export async function POST(request: NextRequest) {
  try {
    const { shopId, password } = await request.json();

    if (!shopId || !password) {
      return NextResponse.json(
        { error: "Shop ID and password are required." },
        { status: 400 },
      );
    }

    // Simple password check — one password for all shops (demo-friendly)
    const correctPassword = (
      process.env.SHOP_ADMIN_DEFAULT_PASSWORD || "repair2025"
    ).trim();

    if (password.trim() !== correctPassword) {
      return NextResponse.json(
        { error: "Falsches Passwort." },
        { status: 401 },
      );
    }

    const token = generateShopAdminToken(shopId);

    const response = NextResponse.json({ success: true });

    response.cookies.set("shop_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}

/* DELETE — Logout: clear the cookie */
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("shop_admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
