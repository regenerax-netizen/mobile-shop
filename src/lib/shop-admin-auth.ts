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
 * Returns shopId if the cookie is valid, null otherwise.
 * Uses lastIndexOf so UUID hyphens never cause wrong split.
 */
export function verifyShopAdminToken(cookieValue: string): string | null {
  if (!cookieValue) return null;
  const sep = cookieValue.lastIndexOf(":");
  if (sep === -1) return null;

  const shopId = cookieValue.slice(0, sep);
  const sig = cookieValue.slice(sep + 1);
  if (!shopId || !sig) return null;

  const expectedSig = crypto
    .createHmac("sha256", getSecret())
    .update(shopId)
    .digest("hex");

  return sig === expectedSig ? shopId : null;
}
