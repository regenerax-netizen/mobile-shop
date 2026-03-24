import { useTranslations } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ShopGrid from "@/components/sections/ShopGrid";
import { getProducts } from "@/lib/queries";

export const revalidate = 60;

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <>
      <Navbar variant="solid" />
      <main className="pt-28 pb-24">
        {/* Page hero */}
        <div className="relative overflow-hidden mb-16">
          <div className="absolute inset-0 mesh-gradient opacity-30" />
          <div className="container-custom relative text-center py-12">
            <ShopHeader />
          </div>
        </div>
        <div className="container-custom">
          <ShopGrid products={products} />
        </div>
      </main>
      <Footer />
    </>
  );
}

function ShopHeader() {
  const t = useTranslations("shop");
  return (
    <>
      <span className="section-label">{t("subtitle")}</span>
      <h1 className="section-title">{t("title")}</h1>
    </>
  );
}
