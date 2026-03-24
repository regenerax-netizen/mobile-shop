import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getShopBySlug } from "@/lib/queries";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { phoneLink, whatsappLink } from "@/config";
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
    title: `Kontakt – ${shop.name}`,
  };
}

export default async function ContactPage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const shop = await getShopBySlug(params.slug);
  if (!shop) notFound();

  const t = await getTranslations("contact");

  return (
    <>
      <Navbar variant="solid" shop={shop} />
      <main className="pt-24 pb-16 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {t("title")}
            </h1>
            <p className="text-gray-500 text-lg">{t("subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                {shop.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[rgba(var(--color-primary-rgb),0.1)] flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-[rgb(var(--color-primary-rgb))]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t("phone")}</h3>
                      <a href={phoneLink(shop.phone)} className="text-[rgb(var(--color-primary-rgb))] hover:underline">
                        {shop.phone}
                      </a>
                    </div>
                  </div>
                )}

                {shop.whatsapp && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.917.918l4.462-1.496A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.39-1.586l-.386-.235-3.044 1.02 1.02-3.044-.235-.386A9.94 9.94 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                      <a href={whatsappLink(shop.whatsapp)} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                        {shop.whatsapp}
                      </a>
                    </div>
                  </div>
                )}

                {shop.email && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[rgba(var(--color-primary-rgb),0.1)] flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-[rgb(var(--color-primary-rgb))]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t("email")}</h3>
                      <a href={`mailto:${shop.email}`} className="text-[rgb(var(--color-primary-rgb))] hover:underline">
                        {shop.email}
                      </a>
                    </div>
                  </div>
                )}

                {shop.address && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[rgba(var(--color-primary-rgb),0.1)] flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-[rgb(var(--color-primary-rgb))]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t("address")}</h3>
                      <p className="text-gray-600">{shop.address}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Opening Hours */}
              {shop.opening_hours && shop.opening_hours.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("findUs")}</h3>
                  <div className="space-y-2">
                    {shop.opening_hours.map((entry, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600">{entry.day}</span>
                        <span className="font-medium text-gray-900">{entry.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {shop.google_maps_embed_url ? (
                <iframe
                  src={shop.google_maps_embed_url}
                  width="100%"
                  height="100%"
                  style={{ minHeight: "400px", border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${shop.name} location`}
                />
              ) : (
                <div className="flex items-center justify-center h-full min-h-[400px] text-gray-400">
                  <p>{t("ourLocation")}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer shop={shop} slug={params.slug} />
    </>
  );
}
