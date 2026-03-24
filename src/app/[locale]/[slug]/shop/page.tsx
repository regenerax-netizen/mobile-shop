import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ShopGrid from "@/components/sections/ShopGrid";
import { getShopBySlug, getShopProducts } from "@/lib/queries";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const shop = await getShopBySlug(params.slug);
  if (!shop) return {};
  return {
    title: `Shop – ${shop.name}`,
  };
}

export default async function ShopPage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const shop = await getShopBySlug(params.slug);
  if (!shop) notFound();

  const products = await getShopProducts(shop.id);
  const t = await getTranslations("shop");

  return (
    <>
      <Navbar variant="solid" shop={shop} />
      <main className="pt-24 pb-16 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {t("title")}
            </h1>
            <p className="text-gray-500 text-lg">{t("subtitle")}</p>
          </div>
          <ShopGrid products={products} slug={params.slug} />
        </div>
      </main>
      <Footer shop={shop} slug={params.slug} />
    </>
  );
}
