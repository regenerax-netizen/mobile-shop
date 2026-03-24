"use client";

import { useTranslations } from "next-intl";
import type { Shop } from "@/types";

const icons: Record<string, React.ReactNode> = {
  wrench: (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  smartphone: (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 15.75h3" />
    </svg>
  ),
  headphones: (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  sim: (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" />
    </svg>
  ),
};

// Guaranteed brand colors — no external image fetching needed
const partnerBrands: Record<string, { bg: string; text: string; accent: string }> = {
  "Lyca Mobile":   { bg: "#E30613", text: "#fff",  accent: "#ff3344" },
  "Ortel Mobile":  { bg: "#009540", text: "#fff",  accent: "#00b84d" },
  "Lebara":        { bg: "#E5007D", text: "#fff",  accent: "#ff29a0" },
  "MoneyGram":     { bg: "#F37021", text: "#fff",  accent: "#ff8c40" },
  "Western Union": { bg: "#FFDD00", text: "#1a1a1a", accent: "#ffe740" },
  "Blau":          { bg: "#0066CC", text: "#fff",  accent: "#1a7fe0" },
  "Aldi Talk":     { bg: "#001F5B", text: "#fff",  accent: "#003080" },
  "Congstar":      { bg: "#FF7300", text: "#fff",  accent: "#ff8f26" },
};

const serviceDescKeys: Record<string, string> = {
  wrench: "item0Desc",
  smartphone: "item1Desc",
  headphones: "item2Desc",
  sim: "item3Desc",
};

export default function Services({ shop }: { shop: Shop }) {
  const t = useTranslations("services");
  const hasPartners = shop.partner_services && shop.partner_services.length > 0;

  return (
    <section id="services" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gray-50 mesh-gradient" />
      <div className="absolute inset-0 dot-pattern opacity-50" />

      <div className="container-custom relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-label">{t("subtitle")}</span>
          <h2 className="section-title">{t("title")}</h2>
          <p className="section-desc">{t("description")}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
          {shop.services.map((service) => (
            <div
              key={service.icon}
              className="group premium-card relative p-8 overflow-hidden cursor-default"
            >
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl transition-opacity duration-500"
                style={{
                  background: `linear-gradient(90deg, var(--color-primary), var(--color-primary-light))`,
                  opacity: 0,
                }}
              />
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl group-hover:opacity-100 opacity-0 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(90deg, var(--color-primary), var(--color-primary-light))`,
                }}
              />
              {/* Icon */}
              <div
                className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: `rgba(var(--color-primary-rgb), 0.1)`, color: `var(--color-primary)` }}
              >
                {icons[service.icon] ?? icons.smartphone}
              </div>
              {/* Title from shop data — works for any language */}
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {t(serviceDescKeys[service.icon] ?? "item0Desc")}
              </p>
              {/* CTA arrow */}
              <div
                className="mt-6 flex items-center gap-1.5 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
                style={{ color: `var(--color-primary)` }}
              >
                <span>{t("learnMore")}</span>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Partner Services — shows uploaded logos when available, fallback to brand tiles */}
        {hasPartners && (
          <div className="mt-24">
            <div className="text-center mb-12">
              <span className="section-label">{t("partnerLabel")}</span>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{t("partnerTitle")}</h3>
              <p className="text-gray-500 mt-3 max-w-lg mx-auto">{t("partnerDesc")}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {shop.partner_services.map((name) => {
                const logoUrl = shop.partner_logos?.[name];
                const brand = partnerBrands[name];
                const bg = brand?.bg ?? "var(--color-primary)";
                const textColor = brand?.text ?? "#fff";
                const initial = name.charAt(0).toUpperCase();
                return (
                  <div
                    key={name}
                    className="group relative overflow-hidden rounded-2xl shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                    style={{ background: logoUrl ? "#fff" : bg, minWidth: 130 }}
                  >
                    {/* Shine overlay */}
                    {!logoUrl && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                    )}
                    <div className="relative px-6 py-5 flex flex-col items-center gap-2">
                      {logoUrl ? (
                        /* Uploaded logo */
                        <>
                          <div className="w-28 h-14 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={logoUrl}
                              alt={name}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <span className="text-xs font-semibold text-gray-600 text-center leading-tight">
                            {name}
                          </span>
                          <span
                            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(var(--color-primary-rgb), 0.1)", color: "var(--color-primary)" }}
                          >
                            Partner
                          </span>
                        </>
                      ) : (
                        /* Fallback: brand color tile */
                        <>
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black shadow-inner"
                            style={{ background: "rgba(255,255,255,0.2)", color: textColor }}
                          >
                            {initial}
                          </div>
                          <span
                            className="text-sm font-bold text-center leading-tight"
                            style={{ color: textColor }}
                          >
                            {name}
                          </span>
                          <span
                            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(255,255,255,0.25)", color: textColor }}
                          >
                            Partner
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

