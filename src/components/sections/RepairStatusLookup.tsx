"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function RepairStatusLookup({ slug }: { slug?: string }) {
  const t = useTranslations("repairStatus");
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const sanitized = orderNumber.trim().toUpperCase();
    if (!sanitized || !sanitized.startsWith("RE-")) {
      setError(t("invalidOrderNumber"));
      return;
    }
    const basePath = slug ? `/${slug}` : "";
    router.push(`${basePath}/repair-status/${sanitized}`);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="premium-card p-8 text-center">
        <div
          className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(var(--color-primary-rgb), 0.1)" }}
        >
          <span className="text-2xl">🔍</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {t("lookupTitle")}
        </h2>
        <p className="text-sm text-gray-500 mb-6">{t("lookupDesc")}</p>

        <form onSubmit={handleSearch} className="space-y-4">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="RE-20250414-XXXX"
            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent text-center font-mono text-lg tracking-wider"
            style={
              {
                "--tw-ring-color": "var(--color-primary)",
              } as React.CSSProperties
            }
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="btn-primary w-full px-6 py-3 rounded-xl text-white font-semibold"
          >
            {t("searchButton")}
          </button>
        </form>
      </div>
    </div>
  );
}
