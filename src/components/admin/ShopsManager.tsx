"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import type { Shop } from "@/types";

export default function ShopsManager() {
  const t = useTranslations("admin");
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Shop | null>(null);

  const loadShops = useCallback(async () => {
    const res = await fetch("/api/shops");
    if (res.ok) setShops(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadShops();
  }, [loadShops]);

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;
    const res = await fetch(`/api/shops/${id}`, { method: "DELETE" });
    if (res.ok) setShops((prev) => prev.filter((s) => s.id !== id));
  };

  const handleEdit = (shop: Shop) => {
    setEditing(shop);
    setShowForm(true);
  };

  const handleSave = async (formData: Partial<Shop>) => {
    if (editing) {
      const res = await fetch(`/api/shops/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const updated = await res.json();
        setShops((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s)),
        );
      }
    } else {
      const res = await fetch("/api/shops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const created = await res.json();
        setShops((prev) => [created, ...prev]);
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
          {t("shopsSection")}
        </h2>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold shadow transition-transform hover:scale-105"
        >
          + {t("addShop")}
        </button>
      </div>

      {showForm && (
        <ShopForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shops.map((shop) => (
          <div
            key={shop.id}
            className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6 relative overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ backgroundColor: shop.accent_color || "#f97316" }}
            />
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: shop.accent_color || "#f97316" }}
              >
                {shop.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate">
                  {shop.name}
                </h3>
                <p className="text-xs text-gray-400">/{shop.slug}</p>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${shop.active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}
              >
                {shop.active ? t("active") : t("inactive")}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">
              {shop.tagline}
            </p>
            <div className="text-xs text-gray-400 space-y-1 mb-4">
              <p>{shop.phone}</p>
              <p>{shop.address}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(shop)}
                className="flex-1 px-4 py-2 rounded-xl text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              >
                {t("edit")}
              </button>
              <button
                onClick={() => handleDelete(shop.id)}
                className="flex-1 px-4 py-2 rounded-xl text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        ))}
        {shops.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400">
            No shops yet. Create your first shop!
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Shop Form ────────────────────────────────────────── */
function ShopForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Shop | null;
  onSave: (data: Partial<Shop>) => void;
  onCancel: () => void;
}) {
  const t = useTranslations("admin");
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [tagline, setTagline] = useState(initial?.tagline ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(initial?.whatsapp ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [googleMapsEmbedUrl, setGoogleMapsEmbedUrl] = useState(
    initial?.google_maps_embed_url ?? "",
  );
  const [logoUrl, setLogoUrl] = useState(initial?.logo_url ?? "");
  const [heroImageUrl, setHeroImageUrl] = useState(
    initial?.hero_image_url ?? "",
  );
  const [accentColor, setAccentColor] = useState(
    initial?.accent_color ?? "#f97316",
  );
  const [active, setActive] = useState(initial?.active ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      slug,
      tagline,
      phone,
      whatsapp,
      email,
      address,
      google_maps_embed_url: googleMapsEmbedUrl,
      logo_url: logoUrl,
      hero_image_url: heroImageUrl,
      accent_color: accentColor,
      opening_hours: initial?.opening_hours ?? [],
      services: initial?.services ?? [],
      active,
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
            {t("shopName")}
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
            Slug (URL)
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) =>
              setSlug(
                e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9-]/g, "-")
                  .replace(/-+/g, "-"),
              )
            }
            required
            placeholder="my-shop"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {t("tagline")}
          </label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {t("phone")}
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {t("whatsapp")}
          </label>
          <input
            type="text"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="491234567890"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {t("address")}
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Google Maps Embed URL
          </label>
          <input
            type="text"
            value={googleMapsEmbedUrl}
            onChange={(e) => setGoogleMapsEmbedUrl(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Logo URL
          </label>
          <input
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Hero Image URL
          </label>
          <input
            type="text"
            value={heroImageUrl}
            onChange={(e) => setHeroImageUrl(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {t("accentColor")}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none text-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="block text-xs font-medium text-gray-500">
            {t("active")}
          </label>
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="w-5 h-5 rounded accent-orange-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 pt-2">
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
