import { notFound } from "next/navigation";
import { getShopBySlug } from "@/lib/queries";
import { deriveColors } from "@/config";

export default async function SlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const shop = await getShopBySlug(params.slug);
  if (!shop) notFound();

  const colors = deriveColors(shop.accent_color || "#f97316");

  return (
    <div
      style={
        {
          "--color-primary": colors.primary,
          "--color-primary-dark": colors.dark,
          "--color-primary-light": colors.light,
          "--color-primary-rgb": colors.rgb,
          "--color-primary-dark-rgb": colors.darkRgb,
          "--color-primary-light-rgb": colors.lightRgb,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
