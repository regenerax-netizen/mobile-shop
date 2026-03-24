"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import type { RepairService, Shop } from "@/types";

export default function RepairsManager() {
  const t = useTranslations("admin");
  const [repairs, setRepairs] = useState<RepairService[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<RepairService | null>(null);
  const [filterShopId, setFilterShopId] = useState<string>("all");

  const loadData = useCallback(async () => {
    const [rRes, sRes] = await Promise.all([
      fetch("/api/repairs"),
      fetch("/api/shops"),
    ]);
    if (rRes.ok) setRepairs(await rRes.json());
    if (sRes.ok) setShops(await sRes.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered =
    filterShopId === "all"
      ? repairs
      : repairs.filter((r) => r.shop_id === filterShopId);

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;
    const res = await fetch(`/api/repairs/${id}`, { method: "DELETE" });
    if (res.ok) setRepairs((prev) => prev.filter((r) => r.id !== id));
  };

  const handleEdit = (repair: RepairService) => {
    setEditing(repair);
    setShowForm(true);
  };

  const handleSave = async (formData: Partial<RepairService>) => {
    if (editing) {
      const res = await fetch(`/api/repairs/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const updated = await res.json();
        setRepairs((prev) =>
          prev.map((r) => (r.id === updated.id ? updated : r)),
        );
      }
    } else {
      const res = await fetch("/api/repairs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const created = await res.json();
        setRepairs((prev) => [created, ...prev]);
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
          {t("repairsSection")}
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
            + {t("addRepair")}
          </button>
        </div>
      </div>

      {showForm && (
        <RepairForm
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
                <th className="px-6 py-3">{t("name")}</th>
                <th className="px-6 py-3">{t("shop")}</th>
                <th className="px-6 py-3">{t("estimatedTime")}</th>
                <th className="px-6 py-3">{t("price")}</th>
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
                      {r.name}
                    </td>
                    <td className="px-6 py-3 text-gray-500 text-xs">
                      {shop?.name ?? "—"}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {r.estimated_time}
                    </td>
                    <td className="px-6 py-3 font-semibold">
                      €{r.price.toFixed(2)}
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
                    No repair services yet.
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

/* ─── Repair Form ──────────────────────────────────────── */
function RepairForm({
  initial,
  shops,
  onSave,
  onCancel,
}: {
  initial: RepairService | null;
  shops: Shop[];
  onSave: (data: Partial<RepairService>) => void;
  onCancel: () => void;
}) {
  const t = useTranslations("admin");
  const [shopId, setShopId] = useState(initial?.shop_id ?? shops[0]?.id ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [estimatedTime, setEstimatedTime] = useState(
    initial?.estimated_time ?? "",
  );
  const [description, setDescription] = useState(initial?.description ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      shop_id: shopId,
      name,
      price: Number(price),
      estimated_time: estimatedTime,
      description,
      active: true,
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
            {t("name")}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {t("price")} (€)
          </label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {t("estimatedTime")}
          </label>
          <input
            type="text"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            placeholder="e.g. 30 min"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none text-sm"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          {t("description")}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
