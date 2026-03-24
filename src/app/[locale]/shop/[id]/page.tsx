import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetail from "@/components/sections/ProductDetail";
import { getProductById } from "@/lib/queries";

export const revalidate = 60;

export default async function ProductPage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  return (
    <>
      <Navbar variant="solid" />
      <main className="pt-28 pb-24">
        <ProductDetail product={product} />
      </main>
      <Footer />
    </>
  );
}
