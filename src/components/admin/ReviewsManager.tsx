"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import type { Review, Shop } from "@/types";

export default function ReviewsManager() {
  const t = useTranslations("admin");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);
  const [filterShopId, setFilterShopId] = useState<string>("all");

  const loadData = useCallback(async () => {
    const [rvRes, sRes] = await Promise.all([
      fetch("/api/reviews"),
      fetch("/api/shops"),
    ]);
    if (rvRes.ok) setReviews(await rvRes.json());
    if (sRes.ok) setShops(await sRes.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered =
    filterShopId === "all"
      ? reviews
      : reviews.filter((r) => r.shop_id === filterShopId);

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;
    const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    if (res.ok) setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const handleEdit = (review: Review) => {
    setEditing(review);
    setShowForm(true);
  };

  const handleSave = async (formData: Partial<Review>) => {
    if (editing) {
      const res = await fetch(`/api/reviews/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const updated = await res.json();
        setReviews((prev) =>
          prev.map((r) => (r.id === updated.id ? updated : r)),
        );
      }
    } else {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const created = await res.json();
        setReviews((prev) => [created, ...prev]);
      }
    }
    setShowForm(false);
    setEditing(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-orange-500 rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {t("reviewsSection")}
        </h2>
        <div className="flex items-center gap-3">
          <select
            value={filterShopId}
            onChange={(e) => setFilterShopId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none"
          >
            <option value="all">{t("allShops")}</option>
            {shops.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold shadow transition-transform hover:scale-105"
          >
            + {t("addReview")}
          </button>
        </div>
      </div>

      {showForm && (
        <ReviewForm
          initial={editing}
          shops={shops}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-3">{t("reviewerName")}</th>
                <th className="px-6 py-3">{t("shop")}</th>
                <th className="px-6 py-3">{t("rating")}</th>
                <th className="px-6 py-3">{t("reviewText")}</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r) => {
                const shop = shops.find((s) => s.id === r.shop_id);
                return (
                  <tr
                    key={r.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {r.reviewer_name}
                    </td>
                    <td className="px-6 py-3 text-gray-500 text-xs">
                      {shop?.name ?? "—"}
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-amber-500">
                        {"★".repeat(r.rating)}
                        {"☆".repeat(5 - r.rating)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600 max-w-xs truncate">
                      {r.review_text}
                    </td>
                    <td className="px-6 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(r)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-xs"
                      >
                        {t("edit")}
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="text-red-600 hover:text-red-700 font-medium text-xs"
                      >
                        {t("delete")}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    No reviews yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Review Form ──────────────────────────────────────── */
function ReviewForm({
  initial,
  shops,
  onSave,
  onCancel,
}: {
  initial: Review | null;
  shops: Shop[];
  onSave: (data: Partial<Review>) => void;
  onCancel: () => void;
}) {
  const t = useTranslations("admin");
  const [shopId, setShopId] = useState(initial?.shop_id ?? shops[0]?.id ?? "");
  const [reviewerName, setReviewerName] = useState(
    initial?.reviewer_name ?? "",
  );
  const [reviewText, setReviewText] = useState(initial?.review_text ?? "");
  const [rating, setRating] = useState(initial?.rating?.toString() ?? "5");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      shop_id: shopId,
      reviewer_name: reviewerName,
      review_text: reviewText,
      rating: Number(rating),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6 mb-6 space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {t("shop")}
          </label>
          <select
            value={shopId}
            onChange={(e) => setShopId(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none text-sm"
          >
            {shops.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {t("reviewerName")}
          </label>
          <input
            type="text"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {t("rating")}
          </label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none text-sm"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {"★".repeat(n)}{"☆".repeat(5 - n)} ({n})
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          {t("reviewText")}
        </label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          required
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none text-sm resize-none"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold shadow"
        >
          {t("save")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}
