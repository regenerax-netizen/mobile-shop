import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import Reviews from "@/components/sections/Reviews";
import OpeningHours from "@/components/sections/OpeningHours";
import GoogleMap from "@/components/sections/GoogleMap";
import Contact from "@/components/sections/Contact";
import { getShopBySlug, getShopProducts, getShopReviews } from "@/lib/queries";
import { notFound } from "next/navigation";
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
    title: `${shop.name} – Premium Phones & Accessories`,
    description: shop.tagline,
  };
}

export default async function ShopHomePage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const shop = await getShopBySlug(params.slug);
  if (!shop) notFound();

  const [products, reviews] = await Promise.all([
    getShopProducts(shop.id),
    getShopReviews(shop.id),
  ]);

  return (
    <>
      <Navbar shop={shop} />
      <Hero shop={shop} />
      <Services shop={shop} />
      <FeaturedProducts products={products} slug={params.slug} />
      <Reviews reviews={reviews} />
      <OpeningHours shop={shop} />
      <GoogleMap shop={shop} />
      <Contact shop={shop} />
      <Footer shop={shop} slug={params.slug} />
    </>
  );
}
