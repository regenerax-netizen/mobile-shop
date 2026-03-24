"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, useCallback, useRef } from "react";
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
  // Hero images as array with upload support
  const [heroImages, setHeroImages] = useState<string[]>(
    initial?.hero_images ?? [],
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [accentColor, setAccentColor] = useState(
    initial?.accent_color ?? "#f97316",
  );
  const [secondaryColor, setSecondaryColor] = useState(
    initial?.secondary_color ?? "#1e3a5f",
  );
  const [partnerServicesText, setPartnerServicesText] = useState(
    (initial?.partner_services ?? []).join(", "),
  );
  const [partnerLogos, setPartnerLogos] = useState<Record<string, string>>(
    initial?.partner_logos ?? {},
  );
  const [partnerLogoUploading, setPartnerLogoUploading] = useState<string | null>(null);
  const [active, setActive] = useState(initial?.active ?? true);

  const handleImageFiles = async (files: FileList) => {
    setUploadError("");
    setUploading(true);
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "hero-images");
      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (res.ok && json.url) {
          newUrls.push(json.url);
        } else {
          setUploadError(json.error ?? "Upload failed");
        }
      } catch {
        setUploadError("Upload failed. Check your connection.");
      }
    }
    setHeroImages((prev) => [...prev, ...newUrls]);
    setUploading(false);
  };

  const removeHeroImage = (idx: number) => {
    setHeroImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handlePartnerLogoUpload = async (partnerName: string, file: File) => {
    setPartnerLogoUploading(partnerName);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "partner-logos");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (res.ok && json.url) {
        setPartnerLogos((prev) => ({ ...prev, [partnerName]: json.url }));
      }
    } catch {
      // ignore
    }
    setPartnerLogoUploading(null);
  };

  const removePartnerLogo = (partnerName: string) => {
    setPartnerLogos((prev) => {
      const next = { ...prev };
      delete next[partnerName];
      return next;
    });
  };

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
      hero_image_url: heroImageUrl || heroImages[0] || "",
      hero_images: heroImages,
      accent_color: accentColor,
      secondary_color: secondaryColor,
      partner_services: partnerServicesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      partner_logos: partnerLogos,
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
            placeholder="z.B. Ihr Handy-Spezialist in Berlin"
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
            Haupt-Bild URL (Fallback)
          </label>
          <input
            type="text"
            value={heroImageUrl}
            onChange={(e) => setHeroImageUrl(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none text-sm"
          />
        </div>

        {/* ── Hero Image Upload ── */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-2">
            {t("heroImages")} <span className="text-gray-400 font-normal">(Vom Handy oder PC hochladen)</span>
          </label>
          {/* Image grid */}
          {heroImages.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
              {heroImages.map((url, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden aspect-video bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Hero ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeHeroImage(idx)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                  >
                    ×
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded font-medium">
                      1. Bild
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* Upload button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleImageFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-orange-300 text-orange-500 hover:border-orange-400 hover:bg-orange-50 transition-all text-sm font-medium disabled:opacity-50"
          >
            {uploading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Wird hochgeladen…
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                Bilder hochladen (mehrere möglich)
              </>
            )}
          </button>
          {uploadError && (
            <p className="mt-1.5 text-xs text-red-500">{uploadError}</p>
          )}
          <p className="mt-1.5 text-xs text-gray-400">
            JPG, PNG, WebP · max. 10 MB · Mehrere Bilder gleichzeitig möglich
          </p>
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
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {t("secondaryColor")}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none text-sm"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {t("partnerServices")}
          </label>
          <input
            type="text"
            value={partnerServicesText}
            onChange={(e) => setPartnerServicesText(e.target.value)}
            placeholder="Lyca Mobile, Ortel Mobile, Lebara, MoneyGram"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none text-sm"
          />
          <p className="mt-1 text-xs text-gray-400">
            Kommagetrennt eingeben — z.B. Lyca Mobile, Lebara, MoneyGram
          </p>

          {/* Partner Logo Uploads */}
          {partnerServicesText.split(",").map((s) => s.trim()).filter(Boolean).length > 0 && (
            <div className="mt-4 space-y-3">
              <p className="text-xs font-medium text-gray-500">Partner-Logos hochladen (empfohlen: 200×80 px, PNG/SVG)</p>
              {partnerServicesText.split(",").map((s) => s.trim()).filter(Boolean).map((name) => (
                <div key={name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  {/* Logo preview or upload */}
                  {partnerLogos[name] ? (
                    <div className="relative w-24 h-12 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={partnerLogos[name]} alt={name} className="w-full h-full object-contain p-1" />
                      <button
                        type="button"
                        onClick={() => removePartnerLogo(name)}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className="flex-shrink-0 w-24 h-12 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all">
                      {partnerLogoUploading === name ? (
                        <svg className="animate-spin h-4 w-4 text-orange-400" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handlePartnerLogoUpload(name, f);
                        }}
                      />
                    </label>
                  )}
                  <span className="text-sm font-medium text-gray-700">{name}</span>
                </div>
              ))}
            </div>
          )}
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
