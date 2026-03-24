"use client";

import { useTranslations } from "next-intl";
import { siteConfig } from "@/config";

export default function OpeningHours() {
  const t = useTranslations("hours");

  // Get current day of week (0 = Sunday, 1 = Monday, ...)
  const today = new Date().getDay();
  const dayMap = [6, 0, 1, 2, 3, 4, 5]; // Sunday→6, Mon→0, Tue→1 ...
  const currentDayIndex = dayMap[today];

  return (
    <section id="hours" className="py-24 lg:py-32 bg-white">
      <div className="container-custom max-w-xl">
        <div className="text-center mb-12">
          <span className="section-label">{t("subtitle")}</span>
          <h2 className="section-title">{t("title")}</h2>
        </div>

        <div className="premium-card overflow-hidden p-1">
          <div className="rounded-xl overflow-hidden">
            {siteConfig.openingHours.map((row, i) => {
              const isClosed = row.hours.toLowerCase() === "closed";
              const isToday = i === currentDayIndex;
              return (
                <div
                  key={row.day}
                  className={`flex items-center justify-between px-6 py-4 transition-colors ${
                    isToday
                      ? "bg-gradient-to-r from-orange-50/80 to-transparent"
                      : i % 2 === 0
                        ? "bg-gray-50/50"
                        : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isToday && (
                      <span className="flex h-2 w-2 relative">
                        <span
                          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                          style={{ backgroundColor: "var(--color-primary)" }}
                        />
                        <span
                          className="relative inline-flex rounded-full h-2 w-2"
                          style={{ backgroundColor: "var(--color-primary)" }}
                        />
                      </span>
                    )}
                    <span
                      className={`font-medium ${isToday ? "text-gray-900 font-bold" : "text-gray-700"}`}
                    >
                      {t(row.day)}
                    </span>
                    {isToday && (
                      <span className="text-[10px] font-bold uppercase tracking-wider accent-text bg-orange-50 px-2 py-0.5 rounded-full">
                        {t("today")}
                      </span>
                    )}
                  </div>
                  <span
                    className={`font-semibold ${
                      isClosed
                        ? "text-red-500"
                        : isToday
                          ? "accent-text font-bold"
                          : "text-gray-600"
                    }`}
                  >
                    {isClosed ? t("closed") : row.hours}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
