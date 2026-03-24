"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function SettingsManager() {
  const t = useTranslations("admin");
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/config");
      if (res.ok) setConfig(await res.json());
      setLoading(false);
    }
    load();
  }, []);

  const handleChange = (key: string, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-orange-500 rounded-full" />
      </div>
    );
  }

  const fields: { key: string; label: string; type?: string }[] = [
    { key: "shop_name", label: t("shopName") },
    { key: "tagline", label: t("tagline") },
    { key: "phone", label: t("phone") },
    { key: "whatsapp", label: t("whatsapp") },
    { key: "email", label: "Email" },
    { key: "address", label: t("address") },
    { key: "accent_color", label: t("accentColor"), type: "color" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t("settingsSection")}
      </h2>
      <form
        onSubmit={handleSave}
        className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6 space-y-5 max-w-2xl"
      >
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              {field.label}
            </label>
            {field.type === "color" ? (
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={config[field.key] || "#f97316"}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={config[field.key] || "#f97316"}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none text-sm"
                />
              </div>
            ) : (
              <input
                type="text"
                value={config[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none text-sm"
              />
            )}
          </div>
        ))}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary px-8 py-2.5 rounded-xl text-sm font-semibold shadow disabled:opacity-50"
          >
            {saving ? "Saving..." : t("save")}
          </button>
          {saved && (
            <span className="text-green-600 text-sm font-medium animate-pulse">
              ✓ {t("saved")}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
