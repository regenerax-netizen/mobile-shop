"use client";

import { useTranslations } from "next-intl";
import type { Shop } from "@/types";

const icons: Record<string, React.ReactNode> = {
  wrench: (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.46 5.46a2.12 2.12 0 01-3-3l5.46-5.46m2.83-2.83L21.68 4.9a1.5 1.5 0 00-2.12-2.12l-4.44 4.44m0 0L12.29 4.4a1.5 1.5 0 00-2.27.3L8.15 7.56a1.5 1.5 0 00.3 1.88l6.11 6.11a1.5 1.5 0 001.88.3l2.86-1.87a1.5 1.5 0 00.3-2.27l-2.83-2.83z" />
    </svg>
  ),
  smartphone: (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  headphones: (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
    </svg>
  ),
  sim: (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 2l4 4h4" />
      <rect x="8" y="10" width="8" height="8" rx="1" />
    </svg>
  ),
};

const partnerLogos: Record<string, { domain: string; color: string }> = {
  "Lyca Mobile":   { domain: "lycamobile.de",    color: "#e30613" },
  "Ortel Mobile":  { domain: "ortel.de",         color: "#00a650" },
  "Lebara":        { domain: "lebara.de",         color: "#e5007d" },
  "MoneyGram":     { domain: "moneygram.com",     color: "#f37021" },
  "Western Union": { domain: "westernunion.com",  color: "#ffdd00" },
  "Blau":          { domain: "blau.de",           color: "#0066cc" },
  "Aldi Talk":     { domain: "alditalk.de",       color: "#00599c" },
  "Congstar":      { domain: "congstar.de",       color: "#ff7300" },
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
          {shop.services.map((service, i) => (
            <div
              key={service.icon}
              className="group premium-card relative p-8 overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(90deg, var(--color-primary), var(--color-primary-light))`,
                }}
              />
              <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl icon-box">
                {icons[service.icon] ?? icons.smartphone}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {t(`item${i}Title`)}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {t(`item${i}Desc`)}
              </p>
              <div className="mt-5 flex items-center gap-1 text-sm font-semibold accent-text opacity-0 group-hover:opacity-100 transform translate-x-[-8px] group-hover:translate-x-0 transition-all duration-300">
                <span>{t("learnMore")}</span>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Partner Services */}
        {hasPartners && (
          <div className="mt-20">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-gray-900">{t("partnerTitle")}</h3>
              <p className="text-gray-500 mt-2">{t("partnerDesc")}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {shop.partner_services.map((name) => {
                const partner = partnerLogos[name];
                return (
                  <div
                    key={name}
                    className="premium-card px-6 py-5 flex flex-col items-center gap-3 min-w-[120px] hover:-translate-y-1 transition-transform"
                  >
                    {partner ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`https://logo.clearbit.com/${partner.domain}`}
                        alt={name}
                        className="h-10 w-auto max-w-[90px] object-contain"
                        onError={(e) => {
                          const el = e.currentTarget;
                          el.style.display = "none";
                          const fallback = el.nextElementSibling as HTMLElement | null;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="h-10 w-10 rounded-xl items-center justify-center text-white text-xs font-bold"
                      style={{
                        backgroundColor: partner?.color ?? "var(--color-primary)",
                        display: partner ? "none" : "flex",
                      }}
                    >
                      {name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-gray-600 text-center whitespace-nowrap">{name}</span>
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
