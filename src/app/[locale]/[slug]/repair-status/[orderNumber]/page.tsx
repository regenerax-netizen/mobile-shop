import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RepairStatusTimeline from "@/components/sections/RepairStatusTimeline";
import { getShopBySlug } from "@/lib/queries";
import {
  getRepairOrderByNumber,
  getRepairOrderEvents,
} from "@/lib/repair-orders";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const revalidate = 30;

interface PageProps {
  params: { orderNumber: string; slug: string; locale: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  return {
    title: `Reparaturstatus ${params.orderNumber}`,
    robots: { index: false, follow: false },
  };
}

export default async function RepairStatusDetailPage({ params }: PageProps) {
  const shop = await getShopBySlug(params.slug);
  if (!shop) notFound();

  const t = await getTranslations("repairStatus");
  const order = await getRepairOrderByNumber(params.orderNumber);

  if (!order) {
    return (
      <>
        <Navbar variant="solid" shop={shop} />
        <main className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <div className="container-custom">
            <div className="max-w-lg mx-auto text-center">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-50 flex items-center justify-center">
                  <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {t("notFoundTitle")}
                </h1>
                <p className="text-gray-500 mb-6">{t("notFoundDesc")}</p>
                <a
                  href={`/${params.slug}/repair-status`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all"
                  style={{ background: "var(--color-primary)" }}
                >
                  {t("searchAgain")}
                </a>
              </div>
            </div>
          </div>
        </main>
        <Footer shop={shop} slug={params.slug} />
      </>
    );
  }

  const events = await getRepairOrderEvents(order.id);

  return (
    <>
      <Navbar variant="solid" shop={shop} />
      <main className="pt-24 pb-20 min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: "var(--color-primary)" }}>{t("pageSubtitle")}</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">{t("pageTitle")}</h1>
          </div>
          <RepairStatusTimeline order={order} events={events} />
        </div>
      </main>
      <Footer shop={shop} slug={params.slug} />
    </>
  );
}
