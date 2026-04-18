import crypto from "crypto";

// Dedicated secret — avoids issues with special chars in NEXTAUTH_SECRET
const getSecret = () =>
  process.env.SHOP_ADMIN_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "shop-admin-demo-secret-2025";

/**
 * Token = `${shopId}:${hmac(shopId, secret)}`
 * No expiry — simpler and bulletproof for demos.
 */
export function generateShopAdminToken(shopId: string): string {
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(shopId)
    .digest("hex");
  return `${shopId}:${sig}`;
}

/**
 * Returns shopId (clean UUID) if the cookie is valid, null otherwise.
 * Handles both current tokens  (shopId:sig)
 * and old tokens               (shopId:timestamp:sig).
 * In both cases the last segment is the HMAC signature and the UUID
 * is always the first colon-delimited segment.
 */
export function verifyShopAdminToken(cookieValue: string): string | null {
  if (!cookieValue) return null;
  const sep = cookieValue.lastIndexOf(":");
  if (sep === -1) return null;

  const beforeSig = cookieValue.slice(0, sep); // "shopId" or "shopId:timestamp"
  const sig = cookieValue.slice(sep + 1);
  if (!beforeSig || !sig) return null;

  const expectedSig = crypto
    .createHmac("sha256", getSecret())
    .update(beforeSig)
    .digest("hex");

  if (sig !== expectedSig) return null;

  // Extract just the UUID — first colon-delimited segment.
  // UUIDs never contain ":", so old shopId:timestamp tokens are handled correctly.
  const shopId = beforeSig.split(":")[0];
  return shopId || null;
}
