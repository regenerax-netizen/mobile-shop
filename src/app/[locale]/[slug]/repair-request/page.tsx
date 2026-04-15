import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RepairRequestWizard from "@/components/sections/RepairRequestWizard";
import { getShopBySlug } from "@/lib/queries";
import { getDeviceModels, getAllRepairPrices } from "@/lib/repair-orders";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const revalidate = 60;

interface PageProps {
  params: { slug: string; locale: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const shop = await getShopBySlug(params.slug);
  if (!shop) return {};
  const title = `Handy Reparatur Einsenden – ${shop.name}`;
  const description = `Senden Sie Ihr Handy bequem per Post zur Reparatur. Günstige Preise, schnelle Bearbeitung und transparente Kosten bei ${shop.name}.`;
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function RepairRequestPage({ params }: PageProps) {
  const shop = await getShopBySlug(params.slug);
  if (!shop) notFound();

  const t = await getTranslations("repairRequest");
  const [deviceModels, repairPrices] = await Promise.all([
    getDeviceModels(shop.id),
    getAllRepairPrices(shop.id),
  ]);

  return (
    <>
      <Navbar variant="solid" shop={shop} />
      <main className="pt-28 pb-20 min-h-screen" style={{ background: "linear-gradient(180deg, #fafafa 0%, #ffffff 100%)" }}>
        <div className="container-custom">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">{t("pageTitle")}</h1>
            <p className="mt-4 text-lg text-gray-400 leading-relaxed">{t("pageDesc")}</p>
          </div>
          <RepairRequestWizard
            shop={shop}
            deviceModels={deviceModels}
            repairPrices={repairPrices}
          />
        </div>
      </main>
      <Footer shop={shop} slug={params.slug} />
    </>
  );
}
