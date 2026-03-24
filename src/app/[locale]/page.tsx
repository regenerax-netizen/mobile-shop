import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import Reviews from "@/components/sections/Reviews";
import OpeningHours from "@/components/sections/OpeningHours";
import GoogleMap from "@/components/sections/GoogleMap";
import Contact from "@/components/sections/Contact";
import { getProducts } from "@/lib/queries";

export const revalidate = 60; // ISR: revalidate every 60s

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <FeaturedProducts products={products} />
      <Reviews />
      <OpeningHours />
      <GoogleMap />
      <Contact />
      <Footer />
    </>
  );
}
