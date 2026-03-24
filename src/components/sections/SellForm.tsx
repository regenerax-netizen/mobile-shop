"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { whatsappLink, siteConfig } from "@/config";

export default function SellForm() {
  const t = useTranslations("sell");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    deviceName: "",
    condition: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Build WhatsApp message with form data
    const message = [
      `📱 *Gerät verkaufen / Sell Device*`,
      ``,
      `*Gerät / Device:* ${formData.deviceName}`,
      `*Zustand / Condition:* ${formData.condition}`,
      `*Name:* ${formData.name}`,
      `*Telefon / Phone:* ${formData.phone}`,
      formData.email ? `*E-Mail:* ${formData.email}` : "",
      formData.additionalInfo ? `*Info:* ${formData.additionalInfo}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    // Open WhatsApp with pre-filled message
    const waUrl = `${whatsappLink}?text=${encodeURIComponent(message)}`;
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
          <svg
            className="h-8 w-8 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {t("successTitle")}
        </h3>
        <p className="text-gray-500 mb-8">{t("successMessage")}</p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({
              deviceName: "",
              condition: "",
              name: "",
              phone: "",
              email: "",
              additionalInfo: "",
            });
          }}
          className="btn-primary"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-5 gap-12 items-start">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-3 premium-card p-8 sm:p-10"
      >
        <div className="grid gap-6">
          {/* Device Name */}
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow"
              style={
                {
                  "--tw-ring-color": "var(--color-primary)",
                } as React.CSSProperties
              }
            />
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("condition")} *
            </label>
            <select
              name="condition"
              required
              value={formData.condition}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow"
              style={
                {
                  "--tw-ring-color": "var(--color-primary)",
                } as React.CSSProperties
              }
            >
              <option value="">{t("condition")}</option>
              <option value="excellent">{t("conditionExcellent")}</option>
              <option value="good">{t("conditionGood")}</option>
              <option value="fair">{t("conditionFair")}</option>
              <option value="broken">{t("conditionBroken")}</option>
            </select>
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
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow"
                style={
                  {
                    "--tw-ring-color": "var(--color-primary)",
                  } as React.CSSProperties
                }
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
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow"
                style={
                  {
                    "--tw-ring-color": "var(--color-primary)",
                  } as React.CSSProperties
                }
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow"
              style={
                {
                  "--tw-ring-color": "var(--color-primary)",
                } as React.CSSProperties
              }
            />
          </div>

          {/* Additional Info */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("additionalInfo")}
            </label>
            <textarea
              name="additionalInfo"
              rows={4}
              value={formData.additionalInfo}
              onChange={handleChange}
              placeholder={t("additionalInfoPlaceholder")}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow resize-none"
              style={
                {
                  "--tw-ring-color": "var(--color-primary)",
                } as React.CSSProperties
              }
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full text-center justify-center"
          >
            {t("submit")}
          </button>
        </div>
      </form>

      {/* How It Works sidebar */}
      <div className="lg:col-span-2 space-y-6">
        <h3 className="text-xl font-bold text-gray-900">{t("howItWorks")}</h3>
        {[0, 1, 2].map((i) => (
          <div key={i} className="premium-card p-6 flex gap-4">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{
                background: `linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))`,
              }}
            >
              {i + 1}
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">
                {t(`step${i + 1}Title`)}
              </h4>
              <p className="text-sm text-gray-500">{t(`step${i + 1}Desc`)}</p>
            </div>
          </div>
        ))}

        {/* WhatsApp CTA */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 premium-card p-6 hover:border-[#25D366]/30 transition-colors group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366]/20 transition-colors">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">WhatsApp</p>
            <p className="text-xs text-gray-500">{siteConfig.phone}</p>
          </div>
        </a>
      </div>
    </div>
  );
}
