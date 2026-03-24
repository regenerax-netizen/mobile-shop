"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import type { Product } from "@/types";

export default function ProductsManager() {
  const t = useTranslations("admin");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const loadProducts = useCallback(async () => {
    const res = await fetch("/api/products");
    if (res.ok) setProducts(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setShowForm(true);
  };

  const handleSave = async (formData: Omit<Product, "id" | "created_at">) => {
    if (editing) {
      const res = await fetch(`/api/products/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p)),
        );
      }
    } else {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const created = await res.json();
        setProducts((prev) => [created, ...prev]);
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {t("productsSection")}
        </h2>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold shadow transition-transform hover:scale-105"
        >
          + {t("addProduct")}
        </button>
      </div>

      {showForm && (
        <ProductForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-3">{t("image")}</th>
                <th className="px-6 py-3">{t("name")}</th>
                <th className="px-6 py-3">{t("category")}</th>
                <th className="px-6 py-3">{t("price")}</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                        No img
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-900">
                    {p.name}
                  </td>
                  <td className="px-6 py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-semibold">
                    €{p.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-xs"
                    >
                      {t("edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-600 hover:text-red-700 font-medium text-xs"
                    >
                      {t("delete")}
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    No products yet.
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

/* ─── Product Form ─────────────────────────────────────── */
function ProductForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Product | null;
  onSave: (data: Omit<Product, "id" | "created_at">) => void;
  onCancel: () => void;
}) {
  const t = useTranslations("admin");
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [category, setCategory] = useState<"phones" | "accessories">(
    initial?.category ?? "phones",
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const data = await res.json();
      setImageUrl(data.url);
    }
    setUploading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      price: Number(price),
      category,
      description,
      image_url: imageUrl,
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
            {t("category")}
          </label>
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as "phones" | "accessories")
            }
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none text-sm"
          >
            <option value="phones">Phones</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {t("image")}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:accent-text hover:file:bg-orange-100"
          />
          {uploading && (
            <p className="text-xs text-gray-400 mt-1">Uploading...</p>
          )}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="mt-2 w-16 h-16 rounded-lg object-cover"
            />
          )}
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
