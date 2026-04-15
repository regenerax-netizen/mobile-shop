import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RepairStatusLookup from "@/components/sections/RepairStatusLookup";
import { getShopBySlug } from "@/lib/queries";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: { slug: string; locale: string };
}

export default async function RepairStatusPage({ params }: PageProps) {
  const shop = await getShopBySlug(params.slug);
  if (!shop) notFound();

  const t = await getTranslations("repairStatus");

  return (
    <>
      <Navbar variant="solid" shop={shop} />
      <main className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: "var(--color-primary)" }}>{t("pageSubtitle")}</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">{t("pageTitle")}</h1>
          </div>
          <RepairStatusLookup slug={params.slug} />
        </div>
      </main>
      <Footer shop={shop} slug={params.slug} />
    </>
  );
}
