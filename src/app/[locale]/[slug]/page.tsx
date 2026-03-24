import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import { getShopBySlug, getShopProducts, getShopReviews } from "@/lib/queries";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Lazy-load below-fold sections for faster initial paint
const FeaturedProducts = dynamic(() => import("@/components/sections/FeaturedProducts"));
const FAQ = dynamic(() => import("@/components/sections/FAQ"));
const Reviews = dynamic(() => import("@/components/sections/Reviews"));
const OpeningHours = dynamic(() => import("@/components/sections/OpeningHours"));
const GoogleMap = dynamic(() => import("@/components/sections/GoogleMap"));
const Contact = dynamic(() => import("@/components/sections/Contact"));

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
      <FAQ shop={shop} />
      <Reviews reviews={reviews} />
      <OpeningHours shop={shop} />
      <GoogleMap shop={shop} />
      <Contact shop={shop} />
      <Footer shop={shop} slug={params.slug} />
    </>
  );
}
