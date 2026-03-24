"use client";

import { useTranslations } from "next-intl";
import { phoneLink, whatsappLink } from "@/config";
import type { Shop } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer({ shop, slug }: { shop: Shop; slug: string }) {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "de";
  const base = `/${locale}/${slug}`;

  const nameParts = shop.name.split(" ");
  const first = nameParts[0];
  const rest = nameParts.slice(1).join(" ");

  const phoneLinkHref = phoneLink(shop.phone);
  const whatsappLinkHref = whatsappLink(shop.whatsapp);

  return (
    <footer className="relative bg-gray-950 text-gray-400 overflow-hidden">
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />

      {/* Glow blobs */}
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: "var(--color-primary)" }}
      />
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: "var(--color-primary-light)" }}
      />

      <div className="container-custom relative py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* ── Brand ── */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-extrabold text-white tracking-tight mb-1">
              <span className="accent-gradient">{first}</span>
              {rest ? ` ${rest}` : ""}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mt-2 mb-5">
              {shop.tagline || t("defaultTagline")}
            </p>
            {/* Contact */}
            <div className="space-y-2.5">
              <a
                href={phoneLinkHref}
                className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors group"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                {shop.phone}
              </a>
              {shop.address && (
                <div className="flex items-start gap-2.5 text-sm text-gray-500">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 mt-0.5 shrink-0">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </span>
                  <span className="leading-snug">{shop.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Navigation ── */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-5">
              {t("navigation")}
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { href: base, label: t("home") },
                { href: `${base}/shop`, label: t("products") },
                { href: `${base}/repairs`, label: t("services") },
                { href: `${base}/sell`, label: t("sell") },
                { href: `${base}/contact`, label: t("contact") },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm hover:text-white transition-colors hover:translate-x-1.5 transform duration-200 flex items-center gap-1.5 group"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-700 group-hover:bg-[var(--color-primary)] transition-colors" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── Services ── */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-5">
              {t("ourServices")}
            </h4>
            <ul className="flex flex-col gap-3">
              {shop.services.map((s) => (
                <li key={s.icon} className="flex items-center gap-1.5 text-sm group">
                  <span className="w-1 h-1 rounded-full bg-gray-700 group-hover:bg-[var(--color-primary)] transition-colors" />
                  <span className="text-gray-400">{s.title}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact CTA ── */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-5">
              {t("contactUs")}
            </h4>
            <a
              href={whatsappLinkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 px-4 py-3.5 text-sm font-semibold text-[#25D366] hover:bg-[#25D366]/20 transition-all duration-300 mb-4"
            >
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
            {shop.email && (
              <a
                href={`mailto:${shop.email}`}
                className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/5 px-4 py-3.5 text-sm font-medium text-gray-300 hover:bg-white/10 transition-all duration-300"
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
                </svg>
                {shop.email}
              </a>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; {year} {shop.name}. {t("rights")}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </div>
            <span className="text-xs text-gray-700">{t("poweredBy")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
