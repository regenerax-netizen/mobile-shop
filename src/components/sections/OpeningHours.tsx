"use client";

import { useTranslations } from "next-intl";
import type { Shop } from "@/types";

const dayIndex: Record<string, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6,
  sonntag: 0, montag: 1, dienstag: 2, mittwoch: 3,
  donnerstag: 4, freitag: 5, samstag: 6,
};

export default function OpeningHours({ shop }: { shop: Shop }) {
  const t = useTranslations("openingHours");

  if (!shop.opening_hours || shop.opening_hours.length === 0) return null;

  const today = new Date().getDay();

  return (
    <section id="opening-hours" className="py-24 lg:py-32 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-label">{t("subtitle")}</span>
          <h2 className="section-title">{t("title")}</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Hours card */}
          <div className="premium-card overflow-hidden">
            <div
              className="px-8 py-5 flex items-center gap-3"
              style={{
                background: `linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))`,
              }}
            >
              <svg className="h-5 w-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <h3 className="text-white font-bold text-lg">{shop.name}</h3>
            </div>

            <div className="divide-y divide-gray-100">
              {shop.opening_hours.map((slot) => {
                const isToday = dayIndex[slot.day.toLowerCase()] === today;
                return (
                  <div
                    key={slot.day}
                    className={`flex justify-between items-center px-8 py-4 transition-colors ${
                      isToday
                        ? "bg-[rgba(var(--color-primary-rgb),0.06)]"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isToday && (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "var(--color-primary)" }} />
                          <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "var(--color-primary)" }} />
                        </span>
                      )}
                      <span className={`font-semibold ${isToday ? "accent-text" : "text-gray-900"}`}>
                        {slot.day}
                      </span>
                      {isToday && (
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                          style={{ background: "var(--color-primary)" }}
                        >
                          {t("today")}
                        </span>
                      )}
                    </div>
                    <span className={`font-medium ${isToday ? "text-gray-900" : "text-gray-500"}`}>
                      {slot.hours}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map */}
          {shop.google_maps_embed_url && (
            <div className="premium-card overflow-hidden min-h-[400px]">
              <iframe
                src={shop.google_maps_embed_url}
                className="w-full h-full min-h-[400px]"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${shop.name} location`}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
