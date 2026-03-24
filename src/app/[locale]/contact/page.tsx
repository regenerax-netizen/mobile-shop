import { useTranslations } from "next-intl";
import { siteConfig, phoneLink, whatsappLink } from "@/config";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <>
      <Navbar variant="solid" />
      <main className="pt-28 pb-24">
        {/* Page hero */}
        <div className="relative overflow-hidden mb-16">
          <div className="absolute inset-0 mesh-gradient opacity-30" />
          <div className="container-custom relative text-center py-12">
            <span className="section-label">{t("subtitle")}</span>
            <h1 className="section-title">{t("title")}</h1>
            <p className="section-desc">{t("description")}</p>
          </div>
        </div>

        <section className="max-w-5xl mx-auto px-4 grid gap-8 lg:grid-cols-2">
          {/* Info Card */}
          <div className="premium-card rounded-2xl p-8 space-y-6">
            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-primary)] flex items-center justify-center flex-shrink-0 shadow-lg">
                <svg
                  className="h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.87.36 1.72.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c1.09.34 1.94.57 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em]">
                  {t("phone")}
                </p>
                <a
                  href={phoneLink}
                  className="text-lg font-bold text-gray-900 hover:accent-text transition-colors"
                >
                  {siteConfig.phone}
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center flex-shrink-0 shadow-lg">
                <svg
                  className="h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.093.538 4.063 1.483 5.778L.05 23.455a.5.5 0 0 0 .606.607l5.677-1.433A11.937 11.937 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.887 0-3.656-.518-5.168-1.42l-.36-.214-3.37.851.866-3.37-.235-.374A9.935 9.935 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em]">
                  {t("whatsapp")}
                </p>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-bold text-gray-900 hover:text-[#25D366] transition-colors"
                >
                  +{siteConfig.whatsapp}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <svg
                  className="h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em]">
                  {t("email")}
                </p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {siteConfig.email}
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <svg
                  className="h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em]">
                  {t("address")}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {siteConfig.address}
                </p>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-3">
                {t("openingHours")}
              </p>
              <div className="space-y-1.5">
                {siteConfig.openingHours.map((item) => (
                  <div key={item.day} className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">
                      {item.day}
                    </span>
                    <span
                      className={
                        item.hours === "Closed"
                          ? "text-red-500 font-bold"
                          : "text-gray-800 font-semibold"
                      }
                    >
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map + CTA */}
          <div className="space-y-6">
            <div className="premium-card rounded-2xl overflow-hidden p-1.5">
              <div className="rounded-xl overflow-hidden h-80">
                <iframe
                  src={siteConfig.googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={phoneLink}
                className="btn-primary flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-bold shadow-xl text-center"
              >
                <svg
                  className="h-5 w-5 relative z-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.87.36 1.72.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c1.09.34 1.94.57 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span className="relative z-10">{t("phone")}</span>
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-bold bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:bg-[#1ebe5d] hover:-translate-y-1 hover:shadow-[0_10px_25px_-5px_rgba(37,211,102,0.4)] text-center"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
