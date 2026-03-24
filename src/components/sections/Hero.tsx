"use client";

import { useTranslations } from "next-intl";
import { siteConfig, phoneLink, whatsappLink } from "@/config";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with parallax feel */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url('${siteConfig.heroBackgroundImage}')` }}
      />
      {/* Multi-layer overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

      {/* Decorative elements */}
      <div
        className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 blur-3xl"
        style={{ background: `var(--color-primary)` }}
      />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: `var(--color-primary-light)` }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Trust badge */}
        <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-dark mb-8">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-sm text-white/80 font-medium">
            {t("tagline")}
          </span>
        </div>

        <h1
          className="animate-fade-up text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight"
          style={{ animationDelay: "100ms" }}
        >
          {siteConfig.shopName}
        </h1>

        <p
          className="animate-fade-up mt-6 text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-light"
          style={{ animationDelay: "200ms" }}
        >
          {siteConfig.tagline}
        </p>

        {/* CTA Buttons */}
        <div
          className="animate-fade-up mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animationDelay: "300ms" }}
        >
          <a
            href={phoneLink}
            className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold shadow-2xl animate-pulse-glow"
          >
            <svg
              className="h-5 w-5 relative z-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span className="relative z-10">{t("callNow")}</span>
          </a>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold bg-[#25D366] text-white shadow-2xl transition-all duration-300 hover:bg-[#1ebe5d] hover:-translate-y-1 hover:shadow-[0_10px_25px_-5px_rgba(37,211,102,0.4)]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
            {t("whatsapp")}
          </a>
        </div>

        {/* Trust indicators */}
        <div
          className="animate-fade-up mt-14 flex flex-wrap items-center justify-center gap-6 sm:gap-10"
          style={{ animationDelay: "450ms" }}
        >
          {[
            { icon: "⚡", text: "Express Repairs" },
            { icon: "🛡️", text: "Warranty Included" },
            { icon: "⭐", text: "5-Star Rated" },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-2 text-white/60 text-sm"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-[10px] text-white/40 uppercase tracking-[0.25em] font-medium">
          Scroll
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
