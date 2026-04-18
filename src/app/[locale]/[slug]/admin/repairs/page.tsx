import { notFound } from "next/navigation";
import { getShopBySlug } from "@/lib/queries";
import RepairAdminDashboard from "@/components/sections/RepairAdminDashboard";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const shop = await getShopBySlug(params.slug);
  if (!shop) return {};
  return {
    title: `Reparatur-Dashboard – ${shop.name}`,
    robots: { index: false, follow: false },
  };
}

export default async function RepairAdminPage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const shop = await getShopBySlug(params.slug);
  if (!shop) notFound();

  return <RepairAdminDashboard shop={shop} slug={params.slug} />;
}
