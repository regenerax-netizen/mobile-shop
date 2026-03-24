"use client";

import { useTranslations } from "next-intl";
import { siteConfig } from "@/config";

export default function GoogleMap() {
  const t = useTranslations("map");

  return (
    <section id="map" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gray-50 mesh-gradient" />

      <div className="container-custom relative">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="section-label">{t("subtitle")}</span>
          <h2 className="section-title">{t("title")}</h2>
          <div className="mt-4 inline-flex items-center gap-2 text-gray-500">
            <svg
              className="h-4 w-4 flex-shrink-0 accent-text"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
            <span className="text-sm font-medium">{siteConfig.address}</span>
          </div>
        </div>

        <div className="premium-card overflow-hidden p-1.5">
          <div className="rounded-xl overflow-hidden">
            <iframe
              src={siteConfig.googleMapsEmbedUrl}
              className="w-full h-[350px] sm:h-[450px] lg:h-[500px]"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${siteConfig.shopName} location`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
