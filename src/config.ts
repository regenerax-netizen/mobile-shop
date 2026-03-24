/* ============================================================
   DEFAULT CONFIG — Fallback values for the platform
   ============================================================
   In multi-tenant mode, each shop's data comes from the DB.
   This file provides defaults and helper utilities.
   ============================================================ */

export const defaultConfig = {
  platformName: "Mobile Shop Agentur",
  defaultAccentColor: "#f97316",
  defaultAccentColorDark: "#ea580c",
  defaultAccentColorLight: "#fb923c",
} as const;

/** Build WhatsApp link from number */
export function whatsappLink(whatsapp: string) {
  return `https://wa.me/${whatsapp}`;
}

/** Build phone link from number */
export function phoneLink(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}

/** Derive dark/light variants from a hex accent color */
export function deriveColors(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const dark = `#${Math.max(0, r - 20).toString(16).padStart(2, "0")}${Math.max(0, g - 20).toString(16).padStart(2, "0")}${Math.max(0, b - 20).toString(16).padStart(2, "0")}`;
  const light = `#${Math.min(255, r + 20).toString(16).padStart(2, "0")}${Math.min(255, g + 20).toString(16).padStart(2, "0")}${Math.min(255, b + 20).toString(16).padStart(2, "0")}`;
  const toRgb = (h: string) => {
    const rr = parseInt(h.slice(1, 3), 16);
    const gg = parseInt(h.slice(3, 5), 16);
    const bb = parseInt(h.slice(5, 7), 16);
    return `${rr}, ${gg}, ${bb}`;
  };
  return { primary: hex, dark, light, rgb: `${r}, ${g}, ${b}`, darkRgb: toRgb(dark), lightRgb: toRgb(light) };
}
