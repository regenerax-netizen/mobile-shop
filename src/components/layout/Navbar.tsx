"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { phoneLink, whatsappLink } from "@/config";
import type { Shop } from "@/types";
import LanguageToggle from "@/components/ui/LanguageToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar({
  variant = "transparent",
  shop,
}: {
  variant?: "transparent" | "solid";
  shop: Shop;
}) {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Extract slug from pathname: /de/mobilehub/... → mobilehub
  const segments = pathname.split("/").filter(Boolean);
  const slug = segments[1] || shop.slug;

  const isDark = variant === "solid" || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const locale = segments[0] || "de";
  const base = `/${locale}/${slug}`;

  const links = [
    { label: t("home"), href: base },
    { label: t("shop"), href: `${base}/shop` },
    { label: t("repairs"), href: `${base}/repairs` },
    { label: t("sell"), href: `${base}/sell` },
    { label: t("contact"), href: `${base}/contact` },
  ];

  const phoneLinkHref = phoneLink(shop.phone);
  const whatsappLinkHref = whatsappLink(shop.whatsapp);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          isDark
            ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border-b border-gray-100/50"
            : "bg-transparent"
        }`}
      >
        <div className="container-custom flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link
            href={base}
            className={`text-xl font-extrabold tracking-tight transition-all duration-300 ${
              isDark ? "text-gray-900" : "text-white"
            }`}
          >
            {(() => {
              const words = shop.name.split(" ");
              if (words.length >= 2) {
                const first = words.slice(0, -1).join(" ");
                const last = words[words.length - 1];
                return (
                  <>
                    <span className="accent-gradient">{first}</span>{" "}
                    <span>{last}</span>
                  </>
                );
              }
              return <span className="accent-gradient">{shop.name}</span>;
            })()}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 group ${
                  isDark
                    ? "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {l.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full accent-bg transition-all duration-300 group-hover:w-4" />
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle scrolled={isDark} />
            <a
              href={whatsappLinkHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2.5 rounded-xl transition-all duration-300 ${
                isDark
                  ? "text-green-600 hover:bg-green-50"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
              aria-label="WhatsApp"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
            </a>
            <a
              href={phoneLinkHref}
              className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold animate-pulse-glow"
            >
              <svg
                className="h-4 w-4 relative z-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.87.36 1.72.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c1.09.34 1.94.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span className="relative z-10">{t("callNow")}</span>
            </a>
          </div>

          {/* Mobile: language + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageToggle scrolled={isDark} />
            <button
              type="button"
              aria-label="Toggle menu"
              className={`p-2 rounded-xl transition-all duration-300 ${
                isDark
                  ? "text-gray-900 hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="w-6 h-6 relative flex flex-col items-center justify-center">
                <span
                  className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 absolute ${menuOpen ? "rotate-45" : "-translate-y-1.5"}`}
                />
                <span
                  className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${menuOpen ? "opacity-0 scale-0" : "opacity-100"}`}
                />
                <span
                  className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 absolute ${menuOpen ? "-rotate-45" : "translate-y-1.5"}`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          menuOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 w-[85%] max-w-sm h-full bg-white shadow-2xl transition-transform duration-500 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="pt-24 px-6 flex flex-col h-full">
            <nav className="space-y-1 flex-1">
              {links.map((l, i) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-3 text-gray-700 text-lg font-medium py-3.5 px-4 rounded-xl hover:bg-gray-50 transition-all"
                  onClick={() => setMenuOpen(false)}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="space-y-3 pb-10 pt-6 border-t border-gray-100">
              <a
                href={phoneLinkHref}
                className="btn-primary flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl text-base font-semibold"
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
                <span className="relative z-10">{t("callNow")}</span>
              </a>
              <a
                href={whatsappLinkHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl text-base font-semibold bg-[#25D366] text-white hover:bg-[#1ebe5d] transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
