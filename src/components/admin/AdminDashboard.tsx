"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { Product, RepairService, Shop, Review } from "@/types";

export default function AdminDashboard() {
  const t = useTranslations("admin");
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [repairs, setRepairs] = useState<RepairService[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [sRes, pRes, rRes, rvRes] = await Promise.all([
        fetch("/api/shops"),
        fetch("/api/products"),
        fetch("/api/repairs"),
        fetch("/api/reviews"),
      ]);
      if (sRes.ok) setShops(await sRes.json());
      if (pRes.ok) setProducts(await pRes.json());
      if (rRes.ok) setRepairs(await rRes.json());
      if (rvRes.ok) setReviews(await rvRes.json());
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-orange-500 rounded-full" />
      </div>
    );
  }

  const stats = [
    {
      label: t("totalShops"),
      value: shops.length,
      icon: "🏪",
      detail: `${shops.filter((s) => s.active).length} ${t("active")}`,
    },
    {
      label: t("totalProducts"),
      value: products.length,
      icon: "📱",
      detail: `${products.filter((p) => p.category === "phones").length} Phones · ${products.filter((p) => p.category === "accessories").length} Accessories`,
    },
    {
      label: t("totalRepairs"),
      value: repairs.length,
      icon: "🔧",
      detail: null,
    },
    {
      label: t("totalReviews"),
      value: reviews.length,
      icon: "⭐",
      detail: reviews.length > 0
        ? `Avg ${(reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)}`
        : null,
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t("dashboard")}
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-gray-100"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">{s.label}</p>
              <span className="text-2xl">{s.icon}</span>
            </div>
            <p className="text-4xl font-bold text-gray-900">{s.value}</p>
            {s.detail && (
              <p className="mt-2 text-xs text-gray-400">{s.detail}</p>
            )}
          </div>
        ))}
      </div>

      {/* Recent shops */}
      {shops.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t("recentShops")}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shops.slice(0, 6).map((shop) => (
              <div key={shop.id} className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: shop.accent_color || "#f97316" }}
                  >
                    {shop.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{shop.name}</p>
                    <p className="text-xs text-gray-400">/{shop.slug}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 truncate">{shop.tagline}</p>
                <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${shop.active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                  {shop.active ? t("active") : t("inactive")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
