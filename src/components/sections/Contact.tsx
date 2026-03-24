"use client";

import { useTranslations } from "next-intl";
import { phoneLink, whatsappLink } from "@/config";
import type { Shop } from "@/types";

export default function Contact({ shop }: { shop: Shop }) {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gray-50 mesh-gradient" />
      <div className="absolute inset-0 dot-pattern opacity-40" />

      <div className="container-custom relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-label">{t("subtitle")}</span>
          <h2 className="section-title">{t("title")}</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Phone */}
          <a
            href={phoneLink(shop.phone)}
            className="premium-card p-8 text-center group hover:-translate-y-1 transition-all duration-300"
          >
            <div
              className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-5 transition-transform group-hover:scale-110"
              style={{
                background: `linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))`,
              }}
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.87.36 1.72.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c1.09.34 1.94.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{t("phone")}</h3>
            <p className="text-sm text-gray-500">{shop.phone}</p>
          </a>

          {/* WhatsApp */}
          <a
            href={whatsappLink(shop.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-card p-8 text-center group hover:-translate-y-1 transition-all duration-300"
          >
            <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center bg-[#25D366] text-white mb-5 transition-transform group-hover:scale-110">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-1">WhatsApp</h3>
            <p className="text-sm text-gray-500">{shop.whatsapp}</p>
          </a>

          {/* Address */}
          <div className="premium-card p-8 text-center sm:col-span-2 lg:col-span-1">
            <div
              className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-5"
              style={{
                background: `linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))`,
              }}
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{t("address")}</h3>
            <p className="text-sm text-gray-500">{shop.address}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
