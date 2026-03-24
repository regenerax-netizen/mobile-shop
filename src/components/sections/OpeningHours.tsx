"use client";

import { useTranslations } from "next-intl";
import type { Shop } from "@/types";

export default function OpeningHours({ shop }: { shop: Shop }) {
  const t = useTranslations("openingHours");

  if (!shop.opening_hours || shop.opening_hours.length === 0) return null;

  return (
    <section id="opening-hours" className="py-24 lg:py-32 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-label">{t("subtitle")}</span>
          <h2 className="section-title">{t("title")}</h2>
        </div>

        <div className="max-w-md mx-auto premium-card overflow-hidden">
          <div
            className="px-6 py-4"
            style={{
              background: `linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))`,
            }}
          >
            <h3 className="text-white font-bold text-center text-lg">
              {shop.name}
            </h3>
          </div>

          <div className="divide-y divide-gray-100">
            {shop.opening_hours.map((slot) => (
              <div
                key={slot.day}
                className="flex justify-between items-center px-6 py-4 text-sm hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900">{slot.day}</span>
                <span className="text-gray-500 font-medium">{slot.hours}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
