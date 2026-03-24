import { useTranslations } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RepairsList from "@/components/sections/RepairsList";
import { getRepairServices } from "@/lib/queries";

export const revalidate = 60;

export default async function RepairsPage() {
  const repairs = await getRepairServices();

  return (
    <>
      <Navbar variant="solid" />
      <main className="pt-28 pb-24">
        {/* Page hero */}
        <div className="relative overflow-hidden mb-16">
          <div className="absolute inset-0 mesh-gradient opacity-30" />
          <div className="container-custom relative text-center py-12">
            <RepairsHeader />
          </div>
        </div>
        <div className="container-custom">
          <RepairsList repairs={repairs} />
        </div>
      </main>
      <Footer />
    </>
  );
}

function RepairsHeader() {
  const t = useTranslations("repairs");
  return (
    <>
      <span className="section-label">{t("subtitle")}</span>
      <h1 className="section-title">{t("title")}</h1>
    </>
  );
}
