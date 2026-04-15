"use client";

import { useState, useRef, useMemo } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { whatsappLink } from "@/config";
import type { Shop, DeviceModel, RepairPrice, RepairType } from "@/types";

/* ─── Brand SVG Icons ─────────────────────────────────── */
function AppleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 384 512" fill="currentColor" className={className}>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}
function SamsungLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 16" fill="currentColor" className={className}>
      <text x="0" y="13" fontFamily="Arial, Helvetica, sans-serif" fontSize="15" fontWeight="700" letterSpacing="1">SAMSUNG</text>
    </svg>
  );
}
function HuaweiLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 16" fill="currentColor" className={className}>
      <text x="0" y="13" fontFamily="Arial, Helvetica, sans-serif" fontSize="14" fontWeight="700" letterSpacing="0.5">HUAWEI</text>
    </svg>
  );
}
function XiaomiLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 16" fill="currentColor" className={className}>
      <text x="0" y="13" fontFamily="Arial, Helvetica, sans-serif" fontSize="13" fontWeight="700" letterSpacing="0.5">Xiaomi</text>
    </svg>
  );
}
function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 16" fill="currentColor" className={className}>
      <text x="0" y="13" fontFamily="Arial, Helvetica, sans-serif" fontSize="14" fontWeight="700" letterSpacing="0.5">Google</text>
    </svg>
  );
}
function OnePlusLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 16" fill="currentColor" className={className}>
      <text x="0" y="13" fontFamily="Arial, Helvetica, sans-serif" fontSize="12" fontWeight="700" letterSpacing="0.5">OnePlus</text>
    </svg>
  );
}

const BRAND_LOGOS: Record<string, React.FC<{ className?: string }>> = {
  Apple: AppleLogo,
  Samsung: SamsungLogo,
  Huawei: HuaweiLogo,
  Xiaomi: XiaomiLogo,
  Google: GoogleLogo,
  OnePlus: OnePlusLogo,
};

/* ─── Phone SVG silhouette ────────────────────────────── */
function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
  );
}

/* ─── Repair type SVG icons ───────────────────────────── */
function DisplayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
      <path strokeLinecap="round" d="M9 8l6 8M15 8l-6 8" strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}
function BatteryIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5h3v3h-3z" fill="currentColor" opacity="0.3" />
    </svg>
  );
}
function ChargingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}
function CameraIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
    </svg>
  );
}
function WaterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c0 0-7.5 8.25-7.5 13.5a7.5 7.5 0 0015 0c0-5.25-7.5-13.5-7.5-13.5z" />
    </svg>
  );
}
function SoftwareIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  );
}
function BackglassIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <rect x="5" y="1.5" width="14" height="21" rx="2.5" />
      <circle cx="12" cy="6.5" r="2" />
      <circle cx="12" cy="6.5" r="0.7" fill="currentColor" />
      <path strokeLinecap="round" d="M8 14l8 6M16 14l-8 6" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}
function QuestionIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827m0 3v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

const REPAIR_ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  display: DisplayIcon,
  battery: BatteryIcon,
  charging: ChargingIcon,
  camera: CameraIcon,
  water: WaterIcon,
  software: SoftwareIcon,
  backglass: BackglassIcon,
};

const REPAIR_TYPES: RepairType[] = [
  "display", "battery", "charging", "camera", "water", "software", "backglass",
];

const BRANDS = ["Apple", "Samsung", "Huawei", "Xiaomi", "Google", "OnePlus"];

interface Props {
  shop: Shop;
  deviceModels: DeviceModel[];
  repairPrices: RepairPrice[];
}

export default function RepairRequestWizard({
  shop,
  deviceModels,
  repairPrices,
}: Props) {
  const t = useTranslations("repairRequest");
  const [step, setStep] = useState(1);

  // Step 1 state
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<DeviceModel | null>(null);
  const [isOtherBrand, setIsOtherBrand] = useState(false);
  const [customDevice, setCustomDevice] = useState("");
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [modelSearch, setModelSearch] = useState("");

  // Step 2 state
  const [selectedRepairs, setSelectedRepairs] = useState<RepairType[]>([]);
  const [isDontKnow, setIsDontKnow] = useState(false);
  const [issueDescription, setIssueDescription] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 3 state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    zip: "",
    city: "",
    country: "Deutschland",
    additionalNotes: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState("DHL");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [honeypot, setHoneypot] = useState("");

  // Submission state
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // Derived data
  const modelsForBrand = useMemo(
    () =>
      selectedBrand && !isOtherBrand
        ? deviceModels
            .filter((m) => m.brand === selectedBrand)
            .sort((a, b) => a.sort_order - b.sort_order)
        : [],
    [selectedBrand, isOtherBrand, deviceModels],
  );

  const filteredModels = useMemo(
    () =>
      modelSearch
        ? modelsForBrand.filter((m) =>
            m.model_name.toLowerCase().includes(modelSearch.toLowerCase()),
          )
        : modelsForBrand,
    [modelsForBrand, modelSearch],
  );

  const pricesForDevice = useMemo(
    () =>
      selectedModel
        ? repairPrices.filter((p) => p.device_model_id === selectedModel.id)
        : [],
    [selectedModel, repairPrices],
  );

  const pricingMode = useMemo(() => {
    if (isDontKnow || isOtherBrand || isCustomModel) return "estimate" as const;
    if (selectedRepairs.length === 0) return "estimate" as const;
    const allHavePrice = selectedRepairs.every((rt) =>
      pricesForDevice.some((p) => p.repair_type === rt),
    );
    return allHavePrice ? ("fixed" as const) : ("estimate" as const);
  }, [
    isDontKnow,
    isOtherBrand,
    isCustomModel,
    selectedRepairs,
    pricesForDevice,
  ]);

  const totalPrice = useMemo(() => {
    if (pricingMode !== "fixed") return null;
    const repairTotal = selectedRepairs.reduce((sum, rt) => {
      const price = pricesForDevice.find((p) => p.repair_type === rt);
      return sum + (price?.price ?? 0);
    }, 0);
    const shippingFee = repairTotal >= 99 ? 0 : 9.99;
    return {
      repair: repairTotal,
      shipping: shippingFee,
      total: repairTotal + shippingFee,
    };
  }, [pricingMode, selectedRepairs, pricesForDevice]);

  const deviceName = useMemo(() => {
    if (selectedModel)
      return `${selectedModel.brand} ${selectedModel.model_name}`;
    if (customDevice) return customDevice;
    return "";
  }, [selectedModel, customDevice]);

  // Handlers
  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
    setIsOtherBrand(false);
    setSelectedModel(null);
    setIsCustomModel(false);
    setCustomDevice("");
    setModelSearch("");
  };

  const handleOtherBrand = () => {
    setSelectedBrand(null);
    setIsOtherBrand(true);
    setSelectedModel(null);
    setIsCustomModel(false);
    setCustomDevice("");
  };

  const handleModelSelect = (model: DeviceModel) => {
    setSelectedModel(model);
    setIsCustomModel(false);
    setSelectedRepairs([]);
    setIsDontKnow(false);
  };

  const handleCustomModel = () => {
    setIsCustomModel(true);
    setSelectedModel(null);
    setSelectedRepairs([]);
    setIsDontKnow(false);
  };

  const toggleRepair = (rt: RepairType) => {
    setIsDontKnow(false);
    setSelectedRepairs((prev) =>
      prev.includes(rt) ? prev.filter((r) => r !== rt) : [...prev, rt],
    );
  };

  const handleDontKnow = () => {
    setIsDontKnow(true);
    setSelectedRepairs([]);
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
            if (
              newPreviews.length === Math.min(files.length, 4 - previews.length)
            ) {
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const markTouched = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  // Step validation
  const canGoToStep2 =
    selectedModel !== null ||
    (isOtherBrand && customDevice.trim().length > 0) ||
    (isCustomModel && customDevice.trim().length > 0);

  const canGoToStep3 =
    selectedRepairs.length > 0 ||
    (isDontKnow && issueDescription.trim().length > 0);

  const canSubmit =
    formData.name &&
    formData.email &&
    formData.phone &&
    formData.street &&
    formData.zip &&
    formData.city &&
    agreeTerms;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSending(true);

    try {
      const res = await fetch("/api/repair-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId: shop.id,
          shopSlug: shop.slug,
          deviceModelId: selectedModel?.id ?? null,
          deviceBrand: selectedModel?.brand ?? selectedBrand ?? null,
          deviceName,
          repairTypes: selectedRepairs,
          pricingMode,
          quotedPrice: totalPrice?.repair ?? null,
          shippingFee: totalPrice?.shipping ?? 9.99,
          deviceIssue: isDontKnow ? issueDescription : null,
          photos: previews,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          customerAddress: {
            street: formData.street,
            zip: formData.zip,
            city: formData.city,
            country: formData.country,
          },
          additionalNotes: formData.additionalNotes,
          preferredCarrier: selectedCarrier,
          _hp: honeypot,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Fehler beim Senden");
      }

      const data = await res.json();
      setOrderNumber(data.orderNumber);
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ein Fehler ist aufgetreten.",
      );
    } finally {
      setSending(false);
    }
  };

  const inputClass = (field?: string, value?: string) => {
    const isEmpty = field && touched[field] && !value;
    return `w-full px-0 py-3 text-base font-medium text-gray-900 placeholder:text-gray-300 border-0 border-b-2 ${isEmpty ? "border-red-400" : "border-gray-100 focus:border-gray-900"} focus:ring-0 bg-transparent transition-colors outline-none`;
  };
  const ringStyle = {} as React.CSSProperties;
  const ringStyleError = {} as React.CSSProperties;

  const getRepairLabel = (key: string) => {
    const map: Record<string, string> = {
      display: t("repairDisplay"),
      battery: t("repairBattery"),
      charging: t("repairCharging"),
      camera: t("repairCamera"),
      water: t("repairWater"),
      software: t("repairSoftware"),
      backglass: t("repairBackglass"),
      other: t("repairOther"),
    };
    return map[key] || key;
  };

  // ─── SUCCESS STATE ──────────────────────────────────
  if (submitted) {
    const carrierInstructions: Record<string, { name: string; color: string; textColor: string; dropoffUrl: string; dropoffLabel: string }> = {
      DHL: { name: "DHL", color: "#FFCC00", textColor: "#CC0000", dropoffUrl: "https://www.dhl.de/de/privatkunden/pakete-versenden/pakete-abgeben.html", dropoffLabel: "DHL Paketshop finden" },
      DPD: { name: "DPD", color: "#DC0032", textColor: "#FFFFFF", dropoffUrl: "https://www.dpd.com/de/de/empfangen/paketshops-finden/", dropoffLabel: "DPD Paketshop finden" },
      Hermes: { name: "Hermes", color: "#009FE3", textColor: "#FFFFFF", dropoffUrl: "https://www.myhermes.de/paketshop/", dropoffLabel: "Hermes PaketShop finden" },
      GLS: { name: "GLS", color: "#0032A0", textColor: "#FFD100", dropoffUrl: "https://gls-group.eu/DE/de/depot-suche", dropoffLabel: "GLS Paketshop finden" },
      UPS: { name: "UPS", color: "#351C15", textColor: "#FFB500", dropoffUrl: "https://www.ups.com/dropoff?loc=de_DE", dropoffLabel: "UPS Access Point finden" },
    };
    const carrier = carrierInstructions[selectedCarrier] || carrierInstructions.DHL;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10 text-center">
          {/* Success icon */}
          <div
            className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6"
            style={{
              background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
            }}
          >
            <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">{t("successTitle")}</h3>

          <div className="inline-flex items-center gap-2 bg-gray-100 rounded-xl px-5 py-3 mt-4 mb-8">
            <span className="text-sm text-gray-500">{t("successOrderNumber")}:</span>
            <span className="font-mono font-bold text-gray-900 text-lg">{orderNumber}</span>
          </div>

          <div className="text-left space-y-6">
            {/* Step 1: Packaging */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">1</div>
                <h4 className="font-bold text-gray-900">📦 {t("packagingTips")}</h4>
              </div>
              <ul className="space-y-2.5 text-sm text-gray-600 ml-11">
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> {t("tip1")}</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> {t("tip2")}</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> {t("tip3")} — <span className="font-mono font-bold text-gray-900">{orderNumber}</span></li>
              </ul>
            </div>

            {/* Step 2: Ship to address */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">2</div>
                <h4 className="font-bold text-gray-900">{t("successNextStep")}</h4>
              </div>
              <div className="ml-11">
                <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
                  <p className="font-semibold text-gray-900">{shop.name}</p>
                  <p className="text-gray-600 text-sm">{shop.address}</p>
                </div>

                {/* Carrier badge + dropoff link */}
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                    style={{ backgroundColor: carrier.color, color: carrier.textColor }}
                  >
                    {carrier.name}
                  </span>
                  <a
                    href={carrier.dropoffUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium hover:underline"
                    style={{ color: "var(--color-primary)" }}
                  >
                    📍 {carrier.dropoffLabel} →
                  </a>
                </div>
              </div>
            </div>

            {/* Step 3: Track */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">3</div>
                <h4 className="font-bold text-gray-900">🔍 {t("trackStatus")}</h4>
              </div>
              <div className="ml-11">
                <p className="text-sm text-gray-600 mb-3">{t("statusDesc_pending") || "Verfolge den Status deiner Reparatur in Echtzeit."}</p>
                <a
                  href={`/${shop.slug}/repair-status/${orderNumber}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:shadow-lg"
                  style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))" }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {orderNumber} — Status verfolgen
                </a>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="text-center pt-2">
              <p className="text-xs text-gray-400 mb-2">{t("preferWhatsApp")}</p>
              <a
                href={whatsappLink(shop.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white transition-all hover:shadow-md"
                style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {t("sendUsPhotos")}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── WIZARD ──────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto">
        {/* ── Progress Stepper ──────────────────────────── */}
        <div className="flex items-center justify-between mb-12 px-4">
          {[1, 2, 3].map((s) => {
            const labels = [t("step1Label"), t("step2Label"), t("step3Label")];
            const icons = [PhoneIcon, DisplayIcon, () => (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            )];
            const StepIcon = icons[s - 1];
            return (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <button
                  type="button"
                  onClick={() => { if (s < step) setStep(s); }}
                  className={`flex flex-col items-center gap-2 group ${s <= step ? "cursor-pointer" : "cursor-default"}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500
                      ${s < step
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                        : s === step
                          ? "text-white shadow-lg"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    style={s === step ? { background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))", boxShadow: "0 8px 20px -4px rgba(var(--color-primary-rgb), 0.4)" } : undefined}
                  >
                    {s < step ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`text-xs font-medium transition-colors ${s <= step ? "text-gray-900" : "text-gray-400"}`}>
                    {labels[s - 1]}
                  </span>
                </button>
                {s < 3 && (
                  <div className="flex-1 mx-3 mt-[-20px]">
                    <div className="h-[2px] rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: step > s ? "100%" : "0%",
                          background: "linear-gradient(90deg, var(--color-primary), var(--color-primary-light))",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Free-shipping banner ─────────────────────── */}
        <div className="rounded-2xl px-5 py-4 mb-8 flex items-center justify-center gap-3 bg-gray-50 border border-gray-100">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-gray-400 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
          <p className="text-sm font-medium text-gray-500">{t("infoBanner")}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Honeypot */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <input type="text" name="_hp" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </div>

          {/* ═══════════ STEP 1: Device Selection ═══════════ */}
          {step === 1 && (
            <div className="animate-fade-in space-y-8">
              {/* Brand Selection */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{t("chooseBrand")}</h2>
                  <p className="text-sm text-gray-400 mt-1">{t("selectBrandDesc")}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {BRANDS.map((brand) => {
                    const Logo = BRAND_LOGOS[brand];
                    const isActive = selectedBrand === brand && !isOtherBrand;
                    return (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => handleBrandSelect(brand)}
                        className={`group relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                          isActive
                            ? "border-[var(--color-primary)] bg-gradient-to-b from-[rgba(var(--color-primary-rgb),0.06)] to-[rgba(var(--color-primary-rgb),0.02)] shadow-md"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        {isActive && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white"
                            style={{ background: "var(--color-primary)" }}>
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        <div className={`h-8 flex items-center ${isActive ? "text-[var(--color-primary-dark)]" : "text-gray-700 group-hover:text-gray-900"}`}>
                          {brand === "Apple" ? (
                            <Logo className="h-7 w-7" />
                          ) : (
                            <Logo className="h-4 w-auto max-w-[80px]" />
                          )}
                        </div>
                        <span className={`text-xs font-medium ${isActive ? "text-[var(--color-primary)]" : "text-gray-500"}`}>
                          {brand}
                        </span>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={handleOtherBrand}
                    className={`group flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-dashed transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                      isOtherBrand
                        ? "border-[var(--color-primary)] bg-gradient-to-b from-[rgba(var(--color-primary-rgb),0.06)] to-[rgba(var(--color-primary-rgb),0.02)]"
                        : "border-gray-300 bg-white hover:border-gray-400"
                    }`}
                  >
                    <div className={`h-8 flex items-center ${isOtherBrand ? "text-[var(--color-primary)]" : "text-gray-400"}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </div>
                    <span className={`text-xs font-medium ${isOtherBrand ? "text-[var(--color-primary)]" : "text-gray-500"}`}>
                      {t("otherBrand")}
                    </span>
                  </button>
                </div>
              </div>

              {/* Model Selection */}
              {selectedBrand && !isOtherBrand && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10 animate-fade-in">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 mb-3">
                      <span className="text-sm font-medium text-gray-900">{selectedBrand}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">{t("chooseModel")}</h3>
                  </div>

                  {/* Search */}
                  <div className="relative mb-5">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input
                      type="text"
                      placeholder={t("searchModel")}
                      value={modelSearch}
                      onChange={(e) => setModelSearch(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/80 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm"
                      style={{ "--tw-ring-color": "var(--color-primary)" } as React.CSSProperties}
                    />
                  </div>

                  {/* Model Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                    {filteredModels.map((model) => {
                      const isActive = selectedModel?.id === model.id;
                      return (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => handleModelSelect(model)}
                          className={`group flex items-center gap-3.5 p-3.5 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                            isActive
                              ? "border-[var(--color-primary)] bg-gradient-to-r from-[rgba(var(--color-primary-rgb),0.06)] to-transparent"
                              : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50/50"
                          }`}
                        >
                          {/* Phone image or icon */}
                          <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                            isActive ? "bg-[rgba(var(--color-primary-rgb),0.1)]" : "bg-gray-100 group-hover:bg-gray-200/70"
                          }`}>
                            {model.model_image_url ? (
                              <Image
                                src={model.model_image_url}
                                alt={model.model_name}
                                width={32}
                                height={32}
                                className="w-8 h-8 object-contain"
                              />
                            ) : (
                              <PhoneIcon className={`w-5 h-5 ${isActive ? "text-[var(--color-primary)]" : "text-gray-400"}`} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={`text-sm font-semibold block truncate ${isActive ? "text-[var(--color-primary)]" : "text-gray-900"}`}>
                              {model.model_name}
                            </span>
                            <span className="text-xs text-gray-400">{selectedBrand}</span>
                          </div>
                          {isActive && (
                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0"
                              style={{ background: "var(--color-primary)" }}>
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={handleCustomModel}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium hover:underline transition-colors"
                    style={{ color: "var(--color-primary)" }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    {t("modelNotListed")}
                  </button>
                </div>
              )}

              {/* Custom device input */}
              {(isOtherBrand || isCustomModel) && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10 animate-fade-in">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{t("enterDeviceName")}</label>
                  <input
                    type="text"
                    value={customDevice}
                    onChange={(e) => setCustomDevice(e.target.value)}
                    placeholder={t("enterDevicePlaceholder")}
                    className={inputClass()}
                    style={ringStyle}
                  />
                </div>
              )}

              {/* Next button */}
              <div className="flex justify-center">
                <button
                  type="button"
                  disabled={!canGoToStep2}
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-10 py-3.5 rounded-full text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg"
                  style={{
                    background: canGoToStep2
                      ? "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))"
                      : "#d1d5db",
                  }}
                >
                  <span>{t("next")}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* ═══════════ STEP 2: Repair Type ═══════════ */}
          {step === 2 && (
            <div className="animate-fade-in space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 mb-3">
                    <PhoneIcon className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{deviceName}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{t("whatsBroken")}</h2>
                  <p className="text-sm text-gray-400 mt-1">{t("selectMultiple")}</p>
                </div>

                {/* Repair type cards */}
                {!isOtherBrand && !isCustomModel && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-5">
                    {REPAIR_TYPES.map((key) => {
                      const IconComponent = REPAIR_ICON_MAP[key];
                      const price = pricesForDevice.find((p) => p.repair_type === key);
                      const isSelected = selectedRepairs.includes(key);
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => toggleRepair(key)}
                          className={`group relative p-4 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                            isSelected
                              ? "border-[var(--color-primary)] bg-gradient-to-b from-[rgba(var(--color-primary-rgb),0.06)] to-[rgba(var(--color-primary-rgb),0.02)] shadow-md"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center text-white"
                              style={{ background: "var(--color-primary)" }}>
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                            isSelected ? "bg-[rgba(var(--color-primary-rgb),0.12)]" : "bg-gray-100 group-hover:bg-gray-200/70"
                          }`}>
                            <IconComponent className={`w-5 h-5 ${isSelected ? "text-[var(--color-primary)]" : "text-gray-500 group-hover:text-gray-700"}`} />
                          </div>
                          <span className={`text-sm font-semibold block ${isSelected ? "text-[var(--color-primary)]" : "text-gray-900"}`}>
                            {getRepairLabel(key)}
                          </span>
                          <span className="text-xs text-gray-400 block mt-1">
                            {price ? (
                              <span>{t("from")} <span className="font-semibold text-gray-600">{price.price.toFixed(2)}€</span></span>
                            ) : (
                              t("priceOnRequest")
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* "Weiß ich nicht" card */}
                <button
                  type="button"
                  onClick={handleDontKnow}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                    isDontKnow
                      ? "border-[var(--color-primary)] bg-gradient-to-r from-[rgba(var(--color-primary-rgb),0.06)] to-transparent"
                      : "border-gray-200 border-dashed hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isDontKnow ? "bg-[rgba(var(--color-primary-rgb),0.12)]" : "bg-gray-100"
                  }`}>
                    <QuestionIcon className={`w-5 h-5 ${isDontKnow ? "text-[var(--color-primary)]" : "text-gray-400"}`} />
                  </div>
                  <div className="flex-1">
                    <span className={`text-sm font-semibold block ${isDontKnow ? "text-[var(--color-primary)]" : "text-gray-900"}`}>
                      {t("dontKnow")}
                    </span>
                    <span className="text-xs text-gray-500">{t("dontKnowDesc")}</span>
                  </div>
                  {isDontKnow && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0"
                      style={{ background: "var(--color-primary)" }}>
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>

                {/* Issue description + photos */}
                {(isDontKnow || isOtherBrand || isCustomModel) && (
                  <div className="mt-6 space-y-5 animate-fade-in">
                    <div
                      className="rounded-xl px-4 py-3 text-sm flex items-start gap-3 border"
                      style={{
                        backgroundColor: "rgba(var(--color-primary-rgb), 0.04)",
                        borderColor: "rgba(var(--color-primary-rgb), 0.1)",
                        color: "var(--color-primary-dark)",
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 flex-shrink-0 mt-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                      </svg>
                      <span>{t("diagnosisBanner")}</span>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{t("describeIssue")} *</label>
                      <textarea
                        rows={4}
                        value={issueDescription}
                        onChange={(e) => setIssueDescription(e.target.value)}
                        placeholder={t("issuePlaceholder")}
                        className={`${inputClass()} resize-none`}
                        style={ringStyle}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{t("photosHelp")}</label>
                      <div
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => fileInputRef.current?.click()}
                        className="relative border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-gray-300 transition-colors group bg-gray-50/50"
                      >
                        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:shadow-md transition-shadow">
                          <CameraIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-600">{t("dragDropPhotos")}</p>
                        <p className="text-xs text-gray-400 mt-1">{t("maxPhotos")}</p>
                      </div>

                      {previews.length > 0 && (
                        <div className="mt-3 grid grid-cols-4 gap-2">
                          {previews.map((src, i) => (
                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden group/img border border-gray-100">
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
                  </div>
                )}
              </div>

              {/* Nav buttons */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  {t("back")}
                </button>
                <button
                  type="button"
                  disabled={!canGoToStep3}
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 px-10 py-3.5 rounded-full text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg"
                  style={{
                    background: canGoToStep3
                      ? "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))"
                      : "#d1d5db",
                  }}
                >
                  <span>{t("next")}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* ═══════════ STEP 3: Personal Details ═══════════ */}
          {step === 3 && (
            <div className="animate-fade-in space-y-6">
              {/* Order summary card */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900">{t("orderSummary") || "Zusammenfassung"}</h3>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <PhoneIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-900">{deviceName}</span>
                  </div>
                  {totalPrice && (
                    <span className="text-sm font-bold" style={{ color: "var(--color-primary)" }}>
                      {totalPrice.repair.toFixed(2)}€
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRepairs.map((rt) => {
                    const Icon = REPAIR_ICON_MAP[rt];
                    return (
                      <span key={rt} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 bg-white">
                        <Icon className="w-3 h-3" />
                        {getRepairLabel(rt)}
                      </span>
                    );
                  })}
                  {isDontKnow && (
                    <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 bg-white">
                      <QuestionIcon className="w-3 h-3" />
                      {t("dontKnow")}
                    </span>
                  )}
                </div>
                {totalPrice && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>{t("shippingFee")}</span>
                      <span className={totalPrice.shipping === 0 ? "font-medium text-green-600" : ""}>
                        {totalPrice.shipping === 0 ? t("shippingFree") : `${totalPrice.shipping.toFixed(2)}€`}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 text-base">
                      <span>{t("totalPrice")}</span>
                      <span style={{ color: "var(--color-primary)" }}>{totalPrice.total.toFixed(2)}€</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Personal form */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{t("step3Label")}</h2>
                  <p className="text-sm text-gray-400 mt-1">{t("fillContactDetails")}</p>
                </div>

                <div className="grid gap-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{t("yourName")} *</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} onBlur={() => markTouched("name")}
                        placeholder={t("yourNamePlaceholder")} className={inputClass("name", formData.name)}
                        style={touched.name && !formData.name ? ringStyleError : ringStyle} />
                      {touched.name && !formData.name && <p className="text-red-500 text-xs mt-1">{t("required")}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{t("yourPhone")} *</label>
                      <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} onBlur={() => markTouched("phone")}
                        placeholder={t("yourPhonePlaceholder")} className={inputClass("phone", formData.phone)}
                        style={touched.phone && !formData.phone ? ringStyleError : ringStyle} />
                      {touched.phone && !formData.phone && <p className="text-red-500 text-xs mt-1">{t("required")}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t("yourEmail")} *</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} onBlur={() => markTouched("email")}
                      placeholder={t("yourEmailPlaceholder")} className={inputClass("email", formData.email)}
                      style={touched.email && !formData.email ? ringStyleError : ringStyle} />
                    {touched.email && !formData.email && <p className="text-red-500 text-xs mt-1">{t("required")}</p>}
                  </div>

                  <div className="grid sm:grid-cols-3 gap-5">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{t("street")} *</label>
                      <input type="text" name="street" required value={formData.street} onChange={handleChange} onBlur={() => markTouched("street")}
                        placeholder={t("streetPlaceholder")} className={inputClass("street", formData.street)}
                        style={touched.street && !formData.street ? ringStyleError : ringStyle} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{t("zip")} *</label>
                      <input type="text" name="zip" required value={formData.zip} onChange={handleChange} onBlur={() => markTouched("zip")}
                        placeholder={t("zipPlaceholder")} className={inputClass("zip", formData.zip)}
                        style={touched.zip && !formData.zip ? ringStyleError : ringStyle} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{t("city")} *</label>
                      <input type="text" name="city" required value={formData.city} onChange={handleChange} onBlur={() => markTouched("city")}
                        placeholder={t("cityPlaceholder")} className={inputClass("city", formData.city)}
                        style={touched.city && !formData.city ? ringStyleError : ringStyle} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{t("country")}</label>
                      <select name="country" value={formData.country} onChange={handleChange} className={inputClass()} style={ringStyle}>
                        <option value="Deutschland">Deutschland</option>
                        <option value="Österreich">Österreich</option>
                        <option value="Schweiz">Schweiz</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t("additionalNotes")}</label>
                    <textarea name="additionalNotes" rows={2} value={formData.additionalNotes} onChange={handleChange}
                      placeholder={t("additionalNotesPlaceholder")} className={`${inputClass()} resize-none`} style={ringStyle} />
                  </div>

                  {/* Preferred carrier */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">{t("preferredCarrier") || "Versanddienstleister"}</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {[
                        { id: "DHL", label: "DHL", color: "#FFCC00", textColor: "#CC0000" },
                        { id: "DPD", label: "DPD", color: "#DC0032", textColor: "#FFFFFF" },
                        { id: "Hermes", label: "Hermes", color: "#009FE3", textColor: "#FFFFFF" },
                        { id: "GLS", label: "GLS", color: "#0032A0", textColor: "#FFD100" },
                        { id: "UPS", label: "UPS", color: "#351C15", textColor: "#FFB500" },
                      ].map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setSelectedCarrier(c.id)}
                          className={`relative p-3 rounded-xl border-2 text-center text-sm font-bold transition-all ${
                            selectedCarrier === c.id
                              ? "border-gray-900 shadow-md scale-[1.02]"
                              : "border-gray-100 hover:border-gray-200"
                          }`}
                          style={selectedCarrier === c.id ? { backgroundColor: c.color, color: c.textColor } : undefined}
                        >
                          {c.label}
                          {selectedCarrier === c.id && (
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{t("carrierHint") || "Wähle den Versanddienstleister, mit dem du dein Gerät sendest."}</p>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 accent-[var(--color-primary)]" />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{t("agreeTerms")}</span>
                  </label>

                  {error && (
                    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                      {error}
                    </div>
                  )}
                </div>
              </div>

              {/* Nav buttons */}
              <div className="flex items-center justify-between">
                <button type="button" onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  {t("back")}
                </button>
                <button type="submit" disabled={!canSubmit || sending}
                  className="inline-flex items-center gap-2 px-10 py-3.5 rounded-full text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg"
                  style={{
                    background: canSubmit && !sending
                      ? "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))"
                      : "#d1d5db",
                  }}>
                  {sending ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t("submitting")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      {totalPrice ? `${t("submit")} — ${totalPrice.total.toFixed(2)}€` : t("submitEstimate")}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* ── How It Works — horizontal strip ──────────── */}
        <div className="mt-14">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest text-center mb-8">{t("howItWorks")}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                </svg>
              ), title: t("howStep1Title"), desc: t("howStep1Desc") },
              { icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                </svg>
              ), title: t("howStep2Title"), desc: t("howStep2Desc") },
              { icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1m0 0L11.42 4.97m-5.1 5.1H20.25m-7.42 5.1l5.1-5.1m0 0l-5.1-5.1m5.1 5.1H3.75" />
                </svg>
              ), title: t("howStep3Title"), desc: t("howStep3Desc") },
              { icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              ), title: t("howStep4Title"), desc: t("howStep4Desc") },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(var(--color-primary-rgb), 0.1)", color: "var(--color-primary)" }}>
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-0.5">{item.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Trust badges + WhatsApp — horizontal ─────── */}
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="premium-card p-5">
            <div className="grid grid-cols-4 gap-3 text-center">
              {[
                { icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ), label: t("sidebarGuarantee") },
                { icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                ), label: t("sidebarFreeShipping") },
                { icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ), label: t("sidebarFastRepair") },
                { icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                ), label: t("sidebarTopRated") },
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "rgba(var(--color-primary-rgb), 0.08)", color: "var(--color-primary)" }}>
                    {badge.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-600">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          <a
            href={whatsappLink(shop.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 premium-card p-5 hover:border-[#25D366]/30 hover:shadow-lg transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366]/20 group-hover:scale-110 transition-all">
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
