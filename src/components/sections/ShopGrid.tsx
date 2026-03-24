"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export default function ShopGrid({ products }: { products: Product[] }) {
  const t = useTranslations("shop");
  const [filter, setFilter] = useState<"all" | "phones" | "accessories">("all");

  const filtered =
    filter === "all" ? products : products.filter((p) => p.category === filter);

  const filters: { key: typeof filter; label: string }[] = [
    { key: "all", label: t("filterAll") },
    { key: "phones", label: t("filterPhones") },
    { key: "accessories", label: t("filterAccessories") },
  ];

  return (
    <>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              filter === f.key
                ? "btn-primary shadow-lg"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-16">{t("noProducts")}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.id}`}
              className="group premium-card rounded-2xl overflow-hidden"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-xl text-xs font-bold bg-white/90 text-gray-700 backdrop-blur-md shadow-sm capitalize">
                  {product.category}
                </span>
                {/* View arrow on hover */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg text-gray-900">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-gray-900 group-hover:accent-text transition-colors">
                  {product.name}
                </h3>
                <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">
                  {product.description}
                </p>
                <p className="mt-3 text-lg font-extrabold accent-gradient">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
