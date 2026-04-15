"use client";

import { useTranslations } from "next-intl";
import { getTrackingUrl } from "@/lib/carriers";
import type { RepairOrder, RepairOrderEvent, RepairOrderStatus } from "@/types";

/* ─── Step definitions ─────────────────────────────────── */

const FIXED_STEPS: RepairOrderStatus[] = [
  "pending", "label_sent", "in_transit_to_shop", "received",
  "in_repair", "repaired", "quality_check", "in_transit_to_customer", "delivered",
];

const ESTIMATE_STEPS: RepairOrderStatus[] = [
  "pending", "label_sent", "in_transit_to_shop", "received",
  "diagnosing", "estimate_sent", "approved",
  "in_repair", "repaired", "quality_check", "in_transit_to_customer", "delivered",
];

const REPAIR_LABELS: Record<string, string> = {
  display: "Display", battery: "Akku", charging: "Ladebuchse",
  camera: "Kamera", water: "Wasserschaden", software: "Software",
  backglass: "Rückglas", other: "Sonstiges",
};

/* SVG icons for each status — clean line style */
function StepIcon({ status, size = 20 }: { status: string; size?: number }) {
  const s = size;
  const props = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  
  switch (status) {
    case "pending": return <svg {...props}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
    case "label_sent": return <svg {...props}><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>;
    case "in_transit_to_shop": return <svg {...props}><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
    case "received": return <svg {...props}><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    case "diagnosing": return <svg {...props}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>;
    case "estimate_sent": return <svg {...props}><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    case "approved": return <svg {...props}><path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>;
    case "in_repair": return <svg {...props}><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" /></svg>;
    case "repaired": return <svg {...props}><path d="M5 13l4 4L19 7" /></svg>;
    case "quality_check": return <svg {...props}><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
    case "in_transit_to_customer": return <svg {...props}><path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>;
    case "delivered": return <svg {...props}><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
    case "cancelled": return <svg {...props}><path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>;
    case "rejected": return <svg {...props}><path d="M6 18L18 6M6 6l12 12" /></svg>;
    default: return <svg {...props}><circle cx="12" cy="12" r="3" /></svg>;
  }
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

/* ─── Carrier brand pills ──────────────────────────────── */
const CARRIER_STYLE: Record<string, { bg: string; text: string }> = {
  DHL: { bg: "bg-yellow-400", text: "text-yellow-900" },
  DPD: { bg: "bg-red-600", text: "text-white" },
  Hermes: { bg: "bg-blue-600", text: "text-white" },
  GLS: { bg: "bg-blue-500", text: "text-white" },
  UPS: { bg: "bg-amber-700", text: "text-white" },
};

/* ─── Component ────────────────────────────────────────── */

interface Props {
  order: RepairOrder;
  events: RepairOrderEvent[];
}

export default function RepairStatusTimeline({ order, events }: Props) {
  const t = useTranslations("repairStatus");

  const steps = order.pricing_mode === "fixed" ? FIXED_STEPS : ESTIMATE_STEPS;
  const currentIdx = steps.indexOf(order.status);
  const isCancelled = order.status === "cancelled";
  const isRejected = order.status === "rejected";
  const isTerminal = isCancelled || isRejected;
  const isDelivered = order.status === "delivered";

  const getStatusLabel = (status: string) => { try { return t(`status_${status}`); } catch { return status; } };
  const getStatusDesc = (status: string) => { try { return t(`statusDesc_${status}`); } catch { return ""; } };

  const getEventTime = (status: string) => {
    const event = events.find((e) => e.new_value === status);
    if (!event) return null;
    return new Date(event.created_at).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const createdDate = new Date(order.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });

  const inboundTracking = order.inbound_tracking as { carrier?: string; tracking_number?: string } | null;
  const outboundTracking = order.outbound_tracking as { carrier?: string; tracking_number?: string } | null;

  /* Progress percentage */
  const progressPct = isTerminal ? 100 : isDelivered ? 100 : Math.round(((currentIdx + 1) / steps.length) * 100);

  return (
    <div className="space-y-6">

      {/* ═══ HEADER CARD ═══════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-gray-100 relative">
          <div
            className="h-full transition-all duration-700 ease-out rounded-r-full"
            style={{
              width: `${progressPct}%`,
              background: isTerminal ? "#ef4444" : isDelivered ? "#22c55e" : "linear-gradient(90deg, #6366f1, #818cf8)",
            }}
          />
        </div>

        <div className="p-6 sm:p-8">
          {/* Order number + status badge */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.15em] mb-1">{t("orderNumber")}</p>
              <p className="font-mono font-extrabold text-2xl sm:text-3xl tracking-tight text-gray-900">{order.order_number}</p>
              <p className="text-xs text-gray-400 mt-1">Erstellt am {createdDate}</p>
            </div>
            <div className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold ${
              isTerminal
                ? "bg-red-50 text-red-600 ring-1 ring-red-100"
                : isDelivered
                  ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"
                  : "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100"
            }`}>
              <StepIcon status={order.status} size={18} />
              <span>{getStatusLabel(order.status)}</span>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { label: t("device"), value: order.device_name, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg> },
              {
                label: t("repairType"),
                value: order.repair_types.length > 0
                  ? order.repair_types.map((rt) => REPAIR_LABELS[rt] || rt).join(", ")
                  : t("diagnosisNeeded"),
                icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.384 3.18 1.029-5.997L1.68 7.246l6.023-.875L11.42.854l2.692 5.517 6.023.875-4.385 4.107 1.029 5.998z" /></svg>,
              },
              {
                label: t("price"),
                value: order.final_cost ? `${order.final_cost.toFixed(2)}€` : order.quoted_price ? `${order.quoted_price.toFixed(2)}€` : t("afterDiagnosis"),
                icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>,
              },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50/80 rounded-xl p-4 border border-gray-100/80">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-400">{item.icon}</span>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.12em]">{item.label}</p>
                </div>
                <p className="text-[15px] font-bold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ TRACKING CARDS ════════════════════════════════ */}
      {(inboundTracking?.tracking_number || outboundTracking?.tracking_number) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {inboundTracking?.tracking_number && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <svg className="w-4.5 h-4.5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t("inboundTracking")}</p>
                  {inboundTracking.carrier && (
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold mt-0.5 ${CARRIER_STYLE[inboundTracking.carrier]?.bg || "bg-gray-200"} ${CARRIER_STYLE[inboundTracking.carrier]?.text || "text-gray-800"}`}>
                      {inboundTracking.carrier}
                    </span>
                  )}
                </div>
              </div>
              <p className="font-mono text-sm font-semibold text-gray-700 bg-gray-50 px-3 py-2 rounded-lg mb-3 break-all">{inboundTracking.tracking_number}</p>
              {inboundTracking.carrier && (
                <a href={getTrackingUrl(inboundTracking.carrier, inboundTracking.tracking_number)} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                  {t("trackPackage")}
                </a>
              )}
            </div>
          )}
          {outboundTracking?.tracking_number && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <svg className="w-4.5 h-4.5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t("outboundTracking")}</p>
                  {outboundTracking.carrier && (
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold mt-0.5 ${CARRIER_STYLE[outboundTracking.carrier]?.bg || "bg-gray-200"} ${CARRIER_STYLE[outboundTracking.carrier]?.text || "text-gray-800"}`}>
                      {outboundTracking.carrier}
                    </span>
                  )}
                </div>
              </div>
              <p className="font-mono text-sm font-semibold text-gray-700 bg-gray-50 px-3 py-2 rounded-lg mb-3 break-all">{outboundTracking.tracking_number}</p>
              {outboundTracking.carrier && (
                <a href={getTrackingUrl(outboundTracking.carrier, outboundTracking.tracking_number)} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                  {t("trackPackage")}
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* ═══ COST ESTIMATE APPROVAL ════════════════════════ */}
      {order.status === "estimate_sent" && order.final_cost && (
        <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
            <h3 className="text-white font-bold text-lg">{t("estimateTitle")}</h3>
            <p className="text-indigo-100 text-sm mt-0.5">{t("estimateDesc")}</p>
          </div>
          <div className="p-6">
            <div className="bg-gray-50 rounded-xl p-5 mb-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">{t("repairCost")}</span>
                <span className="font-bold text-gray-900 text-lg">{order.final_cost.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">{t("shippingCost")}</span>
                <span className="font-bold text-gray-900">{order.shipping_fee === 0 ? t("free") : `${order.shipping_fee.toFixed(2)}€`}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
                <span className="font-bold text-gray-900">{t("total")}</span>
                <span className="font-extrabold text-2xl text-indigo-600">{(order.final_cost + order.shipping_fee).toFixed(2)}€</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <a href={`/api/repair-approve/${order.order_number}?token=${order.approval_token}&action=approve`}
                className="flex items-center justify-center gap-2 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                {t("approveRepair")}
              </a>
              <a href={`/api/repair-approve/${order.order_number}?token=${order.approval_token}&action=reject`}
                className="flex items-center justify-center gap-2 py-3.5 px-6 bg-white border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                {t("rejectRepair")}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TIMELINE ══════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-gray-900">{t("timeline")}</h3>
          <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
            {progressPct}% abgeschlossen
          </span>
        </div>

        {/* Horizontal mini-progress for mobile */}
        <div className="flex items-center gap-1 mb-8 sm:hidden">
          {steps.map((_, idx) => (
            <div key={idx} className={`h-1 flex-1 rounded-full transition-all ${
              idx <= currentIdx
                ? isTerminal ? "bg-red-400" : "bg-indigo-500"
                : "bg-gray-100"
            }`} />
          ))}
        </div>

        <div className="relative">
          {steps.map((status, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const isLast = idx === steps.length - 1;
            const time = getEventTime(status);

            return (
              <div key={status} className="flex gap-5">
                {/* Vertical track */}
                <div className="flex flex-col items-center">
                  {/* Node */}
                  <div className={`relative flex items-center justify-center flex-shrink-0 transition-all ${
                    isCurrent
                      ? "w-11 h-11 rounded-2xl shadow-lg"
                      : isCompleted
                        ? "w-9 h-9 rounded-xl"
                        : "w-9 h-9 rounded-xl"
                  } ${
                    isCurrent
                      ? isTerminal ? "bg-red-500 text-white shadow-red-200" : "bg-indigo-600 text-white shadow-indigo-200"
                      : isCompleted
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-100 text-gray-300"
                  }`}>
                    {isCompleted ? <CheckIcon /> : <StepIcon status={status} size={isCurrent ? 20 : 16} />}
                    {isCurrent && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-white flex items-center justify-center">
                        <span className={`w-2 h-2 rounded-full animate-pulse ${isTerminal ? "bg-red-500" : "bg-indigo-500"}`} />
                      </span>
                    )}
                  </div>
                  {/* Connector */}
                  {!isLast && (
                    <div className={`w-[2px] flex-1 min-h-[28px] my-1 rounded-full transition-all ${
                      idx < currentIdx ? "bg-indigo-300" : "bg-gray-100"
                    }`} />
                  )}
                </div>

                {/* Content */}
                <div className={`pb-7 min-w-0 ${isCurrent ? "pt-1" : "pt-1"}`}>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <p className={`font-semibold text-[15px] leading-tight ${
                      isCurrent
                        ? isTerminal ? "text-red-600" : "text-indigo-600"
                        : isCompleted ? "text-gray-900" : "text-gray-300"
                    }`}>
                      {getStatusLabel(status)}
                    </p>
                    {isCurrent && (
                      <span className={`text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-md ${
                        isTerminal ? "bg-red-50 text-red-600" : "bg-indigo-50 text-indigo-600"
                      }`}>
                        {t("current")}
                      </span>
                    )}
                  </div>
                  {(isCurrent || isCompleted) && (
                    <p className="text-sm text-gray-400 mt-1 leading-relaxed max-w-md">{getStatusDesc(status)}</p>
                  )}
                  {time && (
                    <p className="text-xs text-gray-300 mt-1.5 font-medium">{time}</p>
                  )}
                </div>
              </div>
            );
          })}

          {/* Cancelled / Rejected terminal state */}
          {isTerminal && (
            <div className="flex gap-5 mt-1">
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-red-500 text-white shadow-lg shadow-red-200">
                  <StepIcon status={order.status} size={20} />
                </div>
              </div>
              <div className="pt-1">
                <p className="font-semibold text-[15px] text-red-600">{getStatusLabel(order.status)}</p>
                <p className="text-sm text-gray-400 mt-1">{getStatusDesc(order.status)}</p>
                {getEventTime(order.status) && <p className="text-xs text-gray-300 mt-1.5 font-medium">{getEventTime(order.status)}</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ HELP / CONTACT ════════════════════════════════ */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-100 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-sm">Fragen zu Ihrer Reparatur?</p>
            <p className="text-sm text-gray-500 mt-0.5">Kontaktieren Sie uns per WhatsApp oder Telefon — wir helfen Ihnen gerne weiter.</p>
          </div>
          <a href="https://wa.me/491784858800" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all flex-shrink-0 shadow-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.917.918l4.462-1.497A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.369 0-4.571-.816-6.3-2.183l-.44-.352-3.252 1.091 1.088-3.252-.363-.449A9.957 9.957 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" /></svg>
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
