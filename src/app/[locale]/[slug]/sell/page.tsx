import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SellForm from "@/components/sections/SellForm";
import { getShopBySlug } from "@/lib/queries";
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
    title: `Verkaufen – ${shop.name}`,
  };
}

export default async function SellPage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const shop = await getShopBySlug(params.slug);
  if (!shop) notFound();

  const t = await getTranslations("sell");

  return (
    <>
      <Navbar variant="solid" shop={shop} />
      <main className="pt-24 pb-16 min-h-screen bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="section-label">{t("subtitle")}</span>
            <h1 className="section-title">{t("title")}</h1>
            <p className="section-desc">{t("description")}</p>
          </div>
          <SellForm shop={shop} />
        </div>
      </main>
      <Footer shop={shop} slug={params.slug} />
    </>
  );
}
