"use client";

import { useTranslations } from "next-intl";
import { siteConfig } from "@/config";

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-5 w-5 ${i < count ? "text-amber-400" : "text-gray-200"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  const t = useTranslations("reviews");

  return (
    <section id="reviews" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gray-50 mesh-gradient" />
      <div className="absolute inset-0 dot-pattern opacity-40" />

      <div className="container-custom relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-label">{t("subtitle")}</span>
          <h2 className="section-title">{t("title")}</h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {siteConfig.reviews.map((review, i) => (
            <div key={i} className="premium-card p-8 relative">
              {/* Giant quote mark */}
              <div className="absolute top-4 right-6 text-6xl font-serif leading-none accent-text opacity-10 select-none">
                &ldquo;
              </div>

              <Stars count={review.rating} />
              <p className="mt-5 text-gray-600 leading-relaxed text-[15px]">
                &ldquo;{t(`review${i}Text`)}&rdquo;
              </p>

              <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-3">
                {/* Avatar placeholder with gradient */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{
                    background: `linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))`,
                  }}
                >
                  {t(`review${i}Name`).charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    {t(`review${i}Name`)}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="h-3.5 w-3.5 text-blue-500"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12c2.625 0 5.053-.847 7.024-2.28l.116-.09c.09-.069.12-.195.067-.3l-.45-.938c-.053-.11-.167-.16-.282-.117l-.113.05A9.96 9.96 0 0112 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10c0 1.38-.28 2.694-.787 3.89l-.092.2c-.046.103-.003.224.096.28l.938.45c.107.052.236.02.3-.08A11.95 11.95 0 0024 12c0-6.627-5.373-12-12-12z" />
                      <path
                        d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"
                        opacity=".1"
                      />
                    </svg>
                    <span className="text-xs text-gray-400 font-medium">
                      {t("googleReview")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
