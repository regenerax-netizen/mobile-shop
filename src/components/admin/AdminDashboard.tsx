"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { Product, RepairService } from "@/types";

export default function AdminDashboard() {
  const t = useTranslations("admin");
  const [products, setProducts] = useState<Product[]>([]);
  const [repairs, setRepairs] = useState<RepairService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [pRes, rRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/repairs"),
      ]);
      if (pRes.ok) setProducts(await pRes.json());
      if (rRes.ok) setRepairs(await rRes.json());
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

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t("dashboard")}
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-gray-100">
          <p className="text-sm text-gray-500 mb-1">{t("totalProducts")}</p>
          <p className="text-4xl font-bold text-gray-900">{products.length}</p>
          <div className="mt-3 text-xs text-gray-400">
            📱 {products.filter((p) => p.category === "phones").length} Phones
            &nbsp;·&nbsp; 🎧{" "}
            {products.filter((p) => p.category === "accessories").length}{" "}
            Accessories
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-gray-100">
          <p className="text-sm text-gray-500 mb-1">{t("totalRepairs")}</p>
          <p className="text-4xl font-bold text-gray-900">{repairs.length}</p>
        </div>
      </div>
    </div>
  );
}
