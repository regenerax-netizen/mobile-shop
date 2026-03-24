"use client";

import { useTranslations } from "next-intl";
import { formatPrice } from "@/lib/utils";
import { phoneLink, whatsappLink } from "@/config";
import type { RepairService } from "@/types";

export default function RepairsList({ repairs }: { repairs: RepairService[] }) {
  const t = useTranslations("repairs");

  return (
    <>
      {repairs.length === 0 ? (
        <p className="text-center text-gray-400 py-16">{t("noServices")}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {repairs.map((service) => (
            <div
              key={service.id}
              className="group premium-card rounded-2xl p-6 relative overflow-hidden"
            >
              {/* Accent top line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <h3 className="text-lg font-bold text-gray-900">
                {service.name}
              </h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                {service.description}
              </p>
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xl font-extrabold accent-gradient">
                  {formatPrice(service.price)}
                </span>
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl">
                  ⏱ {service.estimated_time}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-20 text-center">
        <p className="text-gray-500 mb-8 text-lg">{t("contactUs")}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={phoneLink}
            className="btn-primary inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-lg font-bold shadow-xl"
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
            <span className="relative z-10">{t("contactUs")}</span>
          </a>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-lg font-bold bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:bg-[#1ebe5d] hover:-translate-y-1 hover:shadow-[0_10px_25px_-5px_rgba(37,211,102,0.4)]"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
