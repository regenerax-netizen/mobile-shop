import { useTranslations } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SellForm from "@/components/sections/SellForm";

export default function SellPage() {
  return (
    <>
      <Navbar variant="solid" />
      <main className="pt-28 pb-24">
        {/* Page hero */}
        <div className="relative overflow-hidden mb-16">
          <div className="absolute inset-0 mesh-gradient opacity-30" />
          <div className="container-custom relative text-center py-12">
            <SellHeader />
          </div>
        </div>
        <div className="container-custom">
          <SellForm />
        </div>
      </main>
      <Footer />
    </>
  );
}

function SellHeader() {
  const t = useTranslations("sell");
  return (
    <>
      <span className="section-label">{t("subtitle")}</span>
      <h1 className="section-title">{t("title")}</h1>
      <p className="section-desc max-w-2xl mx-auto">{t("description")}</p>
    </>
  );
}
