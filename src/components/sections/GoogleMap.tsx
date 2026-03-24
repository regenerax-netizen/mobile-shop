"use client";

import { useTranslations } from "next-intl";
import type { Shop } from "@/types";

export default function GoogleMap({ shop }: { shop: Shop }) {
  const t = useTranslations("contact");

  if (!shop.google_maps_embed_url) return null;

  return (
    <section id="map" className="py-24 lg:py-32 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-label">{t("findUs")}</span>
          <h2 className="section-title">{t("ourLocation")}</h2>
        </div>

        <div className="premium-card overflow-hidden rounded-2xl">
          <iframe
            src={shop.google_maps_embed_url}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${shop.name} location`}
            className="w-full"
          />
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">{shop.address}</p>
        </div>
      </div>
    </section>
  );
}
