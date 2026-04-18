import crypto from "crypto";

/**
 * Generates a signed HMAC token for shop-admin sessions.
 * Cookie format: `${shopId}:${expiry}:${sig}`
 *
 * - shopId : the shop UUID
 * - expiry : Unix ms timestamp when session expires
 * - sig    : HMAC-SHA256(NEXTAUTH_SECRET, "shopId:expiry")
 *
 * Verification requires no DB lookup — the server-side secret is sufficient.
 */

const getSecret = () => process.env.NEXTAUTH_SECRET || "shop-admin-fallback-secret";

export function generateShopAdminToken(shopId: string): string {
  const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 h
  const data = `${shopId}:${expiry}`;
  const sig = crypto.createHmac("sha256", getSecret()).update(data).digest("hex");
  return `${data}:${sig}`;
}

/**
 * Returns the shopId if the cookie value is valid, or null otherwise.
 * Also rejects expired tokens.
 */
export function verifyShopAdminToken(cookieValue: string): string | null {
  if (!cookieValue) return null;
  const parts = cookieValue.split(":");
  if (parts.length !== 3) return null;

  const [shopId, expiryStr, sig] = parts;
  const expiry = parseInt(expiryStr, 10);
  if (isNaN(expiry) || Date.now() > expiry) return null;

  const data = `${shopId}:${expiry}`;
  const expectedSig = crypto
    .createHmac("sha256", getSecret())
    .update(data)
    .digest("hex");

  // Constant-time comparison to prevent timing attacks
  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(expectedSig, "hex");
  if (a.length !== b.length) return null;
  if (!crypto.timingSafeEqual(a, b)) return null;

  return shopId;
}
