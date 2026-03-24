"use client";

import { useTranslations } from "next-intl";
import { siteConfig, phoneLink, whatsappLink } from "@/config";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  const nameParts = siteConfig.shopName.split(" ");
  const first = nameParts[0];
  const rest = nameParts.slice(1).join(" ");

  return (
    <footer className="relative bg-gray-950 text-gray-400 overflow-hidden">
      {/* Subtle top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />

      <div className="container-custom py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              <span className="accent-gradient">{first}</span>
              {rest ? ` ${rest}` : ""}
            </h3>
            <p className="mt-3 text-sm leading-relaxed max-w-xs">
              {siteConfig.address}
            </p>
            <div className="mt-4 flex items-center gap-4">
              <a
                href={phoneLink}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {siteConfig.phone}
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-5">
              Links
            </h4>
            <nav className="flex flex-col gap-3">
              <Link
                href="/shop"
                className="text-sm hover:text-white transition-colors hover:translate-x-1 transform duration-200"
              >
                {t("products")}
              </Link>
              <Link
                href="/repairs"
                className="text-sm hover:text-white transition-colors hover:translate-x-1 transform duration-200"
              >
                {t("services")}
              </Link>
              <Link
                href="/sell"
                className="text-sm hover:text-white transition-colors hover:translate-x-1 transform duration-200"
              >
                {t("sell")}
              </Link>
              <Link
                href="/contact"
                className="text-sm hover:text-white transition-colors hover:translate-x-1 transform duration-200"
              >
                {t("contact")}
              </Link>
            </nav>
          </div>

          {/* Social / WhatsApp */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-5">
              Social
            </h4>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-xl bg-white/5 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-[#25D366]/10 hover:text-[#25D366] transition-all duration-300"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; {year} {siteConfig.shopName}. {t("rights")}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Online
          </div>
        </div>
      </div>
    </footer>
  );
}
