"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { phoneLink, whatsappLink } from "@/config";
import type { Product } from "@/types";

export default function ProductDetail({ product }: { product: Product }) {
  const t = useTranslations("productDetail");

  const whatsappMsg = encodeURIComponent(
    `Hi, I'm interested in: ${product.name} (${formatPrice(product.price)})`,
  );

  return (
    <div className="container-custom">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 mb-8 transition-colors group"
      >
        <svg
          className="h-4 w-4 transition-transform group-hover:-translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {t("backToShop")}
      </Link>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
        {/* Image */}
        <div className="premium-card rounded-3xl overflow-hidden p-1.5">
          <div className="rounded-2xl overflow-hidden bg-gray-50 aspect-square">
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <span className="inline-block px-4 py-1.5 rounded-xl text-xs font-bold bg-gray-100 text-gray-600 w-fit capitalize mb-5 tracking-wide">
            {product.category}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            {product.name}
          </h1>
          <p className="mt-5 text-4xl font-extrabold accent-gradient">
            {formatPrice(product.price)}
          </p>

          <div className="mt-8">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">
              {t("description")}
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {product.description}
            </p>
          </div>

          {/* Contact buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href={phoneLink}
              className="btn-primary inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold shadow-xl"
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
              <span className="relative z-10">{t("callAbout")}</span>
            </a>
            <a
              href={`${whatsappLink}?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:bg-[#1ebe5d] hover:-translate-y-1 hover:shadow-[0_10px_25px_-5px_rgba(37,211,102,0.4)]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              {t("whatsappAbout")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
