"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { phoneLink, whatsappLink } from "@/config";
import type { Shop } from "@/types";

export default function Hero({ shop }: { shop: Shop }) {
  const t = useTranslations("hero");
  const phoneLinkHref = phoneLink(shop.phone);
  const whatsappLinkHref = whatsappLink(shop.whatsapp);

  const images =
    shop.hero_images && shop.hero_images.length > 0
      ? shop.hero_images
      : shop.hero_image_url
        ? [shop.hero_image_url]
        : [];

  const [current, setCurrent] = useState(0);
  const [, setTransitioning] = useState(false);

  const goTo = useCallback(
    (idx: number) => {
      if (idx === current) return;
      setTransitioning(true);
      setCurrent(idx);
      setTimeout(() => setTransitioning(false), 700);
    },
    [current],
  );

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-0">
      {/* Background images with crossfade — optimised with next/image */}
      {images.map((img, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            opacity: i === current ? 1 : 0,
            transform: i === current ? "scale(1.05)" : "scale(1.1)",
            transition: "opacity 700ms ease-in-out, transform 6s ease-out",
          }}
        >
          <Image
            src={img}
            alt={`${shop.name} hero ${i + 1}`}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority={i === 0}
            quality={80}
          />
        </div>
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

      <div
        className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--color-primary)" }}
      />
      <div
        className="absolute bottom-20 right-10 w-64 h-64 sm:w-96 sm:h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "var(--color-primary-light)" }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-5 sm:px-4 max-w-4xl mx-auto">
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
          className="animate-fade-up text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight"
          style={{ animationDelay: "100ms" }}
        >
          {shop.name}
        </h1>

        <p
          className="animate-fade-up mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-light"
          style={{ animationDelay: "200ms" }}
        >
          {shop.tagline}
        </p>

        <div
          className="animate-fade-up mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animationDelay: "300ms" }}
        >
          <a
            href={phoneLinkHref}
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
            href={whatsappLinkHref}
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

        {/* Badges - translated */}
        <div
          className="animate-fade-up mt-14 flex flex-wrap items-center justify-center gap-6 sm:gap-10"
          style={{ animationDelay: "450ms" }}
        >
          {[
            { icon: "\u26A1", label: t("badgeRepairs") },
            { icon: "\uD83D\uDEE1\uFE0F", label: t("badgeWarranty") },
            { icon: "\u2B50", label: t("badgeRated") },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 text-white/60 text-sm"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Google Reviews trust indicator */}
        <div
          className="animate-fade-up mt-8 flex items-center justify-center gap-3"
          style={{ animationDelay: "500ms" }}
        >
          <div className="flex -space-x-2.5">
            {["S", "T", "P", "L", "M"].map((initial, i) => {
              const colors = [
                "from-blue-500 to-blue-600",
                "from-emerald-500 to-emerald-600",
                "from-purple-500 to-purple-600",
                "from-amber-500 to-amber-600",
                "from-rose-500 to-rose-600",
              ];
              return (
                <div
                  key={i}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br ${colors[i]} flex items-center justify-center text-white text-xs sm:text-sm font-bold ring-2 ring-white/20`}
                >
                  {initial}
                </div>
              );
            })}
          </div>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-white/90 text-xs sm:text-sm font-bold">
                4.9
              </span>
            </div>
            <div className="flex items-center gap-1">
              <svg
                className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white/60"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-white/50 text-[10px] sm:text-xs font-medium">
                Google Reviews
              </span>
            </div>
          </div>
        </div>

        {/* Image dots indicator */}
        {images.length > 1 && (
          <div
            className="animate-fade-up mt-10 flex items-center justify-center gap-2"
            style={{ animationDelay: "550ms" }}
          >
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === current
                    ? "w-8 h-2 bg-white"
                    : "w-2 h-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Scroll indicator — desktop only */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2">
        <span className="text-[10px] text-white/40 uppercase tracking-[0.25em] font-medium">
          {t("scroll")}
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
