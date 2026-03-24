"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { whatsappLink } from "@/config";
import type { Shop } from "@/types";

export default function SellForm({ shop }: { shop: Shop }) {
  const t = useTranslations("sell");
  const [submitted, setSubmitted] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    deviceName: "",
    condition: "",
    expectedPrice: "",
    name: "",
    phone: "",
    email: "",
    additionalInfo: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newPreviews: string[] = [];
    Array.from(files)
      .slice(0, 4 - previews.length)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPreviews.push(e.target.result as string);
            if (newPreviews.length === Math.min(files.length, 4 - previews.length)) {
              setPreviews((prev) => [...prev, ...newPreviews].slice(0, 4));
            }
          }
        };
        reader.readAsDataURL(file);
      });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removePreview = (idx: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = [
      `\uD83D\uDCF1 *${t("title")}*`,
      ``,
      `*${t("deviceName")}:* ${formData.deviceName}`,
      `*${t("condition")}:* ${formData.condition}`,
      formData.expectedPrice ? `*${t("expectedPrice")}:* \u20AC${formData.expectedPrice}` : "",
      `*${t("yourName")}:* ${formData.name}`,
      `*${t("yourPhone")}:* ${formData.phone}`,
      formData.email ? `*${t("yourEmail")}:* ${formData.email}` : "",
      formData.additionalInfo ? `*${t("additionalInfo")}:* ${formData.additionalInfo}` : "",
      previews.length > 0 ? `\n\uD83D\uDCF7 ${previews.length} ${t("photosAttached")}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const waUrl = `${whatsappLink(shop.whatsapp)}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="premium-card p-12 text-center max-w-lg mx-auto">
        <div
          className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6"
          style={{
            background: `linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))`,
          }}
        >
          <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t("successTitle")}</h3>
        <p className="text-gray-500 mb-8">{t("successMessage")}</p>
        <button
          onClick={() => {
            setSubmitted(false);
            setPreviews([]);
            setFormData({ deviceName: "", condition: "", expectedPrice: "", name: "", phone: "", email: "", additionalInfo: "" });
          }}
          className="btn-primary"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow";
  const ringStyle = { "--tw-ring-color": "var(--color-primary)" } as React.CSSProperties;

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start">
      {/* Form */}
      <form onSubmit={handleSubmit} className="lg:col-span-2 premium-card p-8 sm:p-10">
        <div className="grid gap-6">
          {/* Device & Condition */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("deviceName")} *
              </label>
              <input
                type="text"
                name="deviceName"
                required
                value={formData.deviceName}
                onChange={handleChange}
                placeholder={t("deviceNamePlaceholder")}
                className={inputClass}
                style={ringStyle}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("condition")} *
              </label>
              <select
                name="condition"
                required
                value={formData.condition}
                onChange={handleChange}
                className={inputClass}
                style={ringStyle}
              >
                <option value="">{t("condition")}</option>
                <option value="excellent">{t("conditionExcellent")}</option>
                <option value="good">{t("conditionGood")}</option>
                <option value="fair">{t("conditionFair")}</option>
                <option value="broken">{t("conditionBroken")}</option>
              </select>
            </div>
          </div>

          {/* Expected Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("expectedPrice")}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">&euro;</span>
              <input
                type="number"
                name="expectedPrice"
                min="0"
                step="1"
                value={formData.expectedPrice}
                onChange={handleChange}
                placeholder={t("expectedPricePlaceholder")}
                className={`${inputClass} pl-8`}
                style={ringStyle}
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("devicePhotos")}
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="relative border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-gray-300 transition-colors group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">{t("dragDropPhotos")}</p>
              <p className="text-xs text-gray-400 mt-1">{t("maxPhotos")}</p>
            </div>

            {/* Preview grid */}
            {previews.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden group/img">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removePreview(i); }}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity text-xs"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Name & Phone */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("yourName")} *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder={t("yourNamePlaceholder")}
                className={inputClass}
                style={ringStyle}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("yourPhone")} *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder={t("yourPhonePlaceholder")}
                className={inputClass}
                style={ringStyle}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("yourEmail")}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("yourEmailPlaceholder")}
              className={inputClass}
              style={ringStyle}
            />
          </div>

          {/* Additional Info */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("additionalInfo")}
            </label>
            <textarea
              name="additionalInfo"
              rows={3}
              value={formData.additionalInfo}
              onChange={handleChange}
              placeholder={t("additionalInfoPlaceholder")}
              className={`${inputClass} resize-none`}
              style={ringStyle}
            />
          </div>

          <button type="submit" className="btn-primary w-full text-center justify-center py-4 text-lg font-bold">
            {t("submit")}
          </button>
        </div>
      </form>

      {/* Sidebar - How it works + WhatsApp */}
      <div className="space-y-6">
        <div className="premium-card p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">{t("howItWorks")}</h3>
          <div className="space-y-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex gap-4">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))` }}
                >
                  {i + 1}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{t(`step${i + 1}Title`)}</h4>
                  <p className="text-sm text-gray-500">{t(`step${i + 1}Desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <a
          href={whatsappLink(shop.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 premium-card p-6 hover:border-[#25D366]/30 transition-colors group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366]/20 transition-colors">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-gray-900">{t("preferWhatsApp")}</p>
            <p className="text-sm text-gray-500">{t("sendUsPhotos")}</p>
          </div>
        </a>
      </div>
    </div>
  );
}
