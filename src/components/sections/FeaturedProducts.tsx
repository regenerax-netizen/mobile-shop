"use client";

import { useTranslations, useLocale } from "next-intl";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import type { Product } from "@/types";

export default function FeaturedProducts({
  products,
  slug,
}: {
  products: Product[];
  slug: string;
}) {
  const t = useTranslations("products");
  const locale = useLocale();

  if (products.length === 0) {
    return (
      <section id="products" className="py-24 lg:py-32 bg-white">
        <div className="container-custom text-center">
          <span className="section-label">{t("subtitle")}</span>
          <h2 className="section-title">{t("title")}</h2>
          <p className="mt-8 text-gray-400">{t("noProducts")}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-24 lg:py-32 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-label">{t("subtitle")}</span>
          <h2 className="section-title">{t("title")}</h2>
          <p className="section-desc">{t("description")}</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {products.slice(0, 6).map((product) => (
            <Link
              key={product.id}
              href={`/${locale}/${slug}/shop/${product.id}`}
              className="group premium-card overflow-hidden"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />
                {/* Overlay gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/90 text-gray-700 backdrop-blur-md shadow-sm">
                  {product.category === "phones"
                    ? t("phones")
                    : t("accessories")}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-base font-bold text-gray-900 group-hover:accent-text transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xl font-extrabold accent-gradient">
                    {formatPrice(product.price)}
                  </p>
                  <span className="flex items-center gap-1 text-xs font-semibold accent-text opacity-0 group-hover:opacity-100 transform translate-x-[-4px] group-hover:translate-x-0 transition-all duration-300">
                    View
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href={`/${locale}/${slug}/shop`}
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base"
          >
            <span className="relative z-10">{t("viewAll")}</span>
            <svg
              className="h-4 w-4 relative z-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
