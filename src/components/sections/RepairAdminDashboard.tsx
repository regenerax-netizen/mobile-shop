"use client";

import { useState, useEffect, useCallback } from "react";
import type { RepairOrder, RepairOrderStatus, Shop } from "@/types";

/* ─── Constants ─────────────────────────────────────────── */

const STATUS_LABELS: Record<RepairOrderStatus, string> = {
  pending: "Neu",
  label_sent: "Label erstellt",
  in_transit_to_shop: "Unterwegs",
  received: "Angekommen",
  diagnosing: "Diagnose",
  estimate_sent: "KV gesendet",
  approved: "Genehmigt",
  rejected: "Abgelehnt",
  in_repair: "In Reparatur",
  repaired: "Repariert",
  quality_check: "QA",
  in_transit_to_customer: "Rückversand",
  delivered: "Zugestellt",
  cancelled: "Storniert",
};

const STATUS_DOT: Record<string, string> = {
  pending: "bg-amber-400",
  label_sent: "bg-blue-400",
  in_transit_to_shop: "bg-blue-400",
  received: "bg-indigo-400",
  diagnosing: "bg-purple-400",
  estimate_sent: "bg-orange-400",
  approved: "bg-emerald-400",
  rejected: "bg-red-400",
  in_repair: "bg-cyan-400",
  repaired: "bg-emerald-500",
  quality_check: "bg-teal-400",
  in_transit_to_customer: "bg-sky-400",
  delivered: "bg-green-500",
  cancelled: "bg-gray-400",
};

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  label_sent: "bg-blue-50 text-blue-700 ring-blue-200",
  in_transit_to_shop: "bg-blue-50 text-blue-700 ring-blue-200",
  received: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  diagnosing: "bg-purple-50 text-purple-700 ring-purple-200",
  estimate_sent: "bg-orange-50 text-orange-700 ring-orange-200",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
  in_repair: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  repaired: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  quality_check: "bg-teal-50 text-teal-700 ring-teal-200",
  in_transit_to_customer: "bg-sky-50 text-sky-700 ring-sky-200",
  delivered: "bg-green-50 text-green-700 ring-green-200",
  cancelled: "bg-gray-50 text-gray-600 ring-gray-200",
};

const CARRIER_COLORS: Record<string, { bg: string; text: string }> = {
  DHL: { bg: "bg-yellow-400", text: "text-yellow-900" },
  DPD: { bg: "bg-red-600", text: "text-white" },
  Hermes: { bg: "bg-blue-600", text: "text-white" },
  GLS: { bg: "bg-blue-500", text: "text-white" },
  UPS: { bg: "bg-amber-700", text: "text-white" },
  FedEx: { bg: "bg-purple-600", text: "text-white" },
};

const STATUS_FLOW: RepairOrderStatus[] = [
  "pending",
  "label_sent",
  "in_transit_to_shop",
  "received",
  "diagnosing",
  "estimate_sent",
  "approved",
  "in_repair",
  "repaired",
  "quality_check",
  "in_transit_to_customer",
  "delivered",
];

const REPAIR_LABELS: Record<string, string> = {
  display: "Display",
  battery: "Akku",
  charging: "Ladebuchse",
  camera: "Kamera",
  water: "Wasserschaden",
  software: "Software",
  backglass: "Rückglas",
  other: "Sonstiges",
};

const FILTER_TABS = [
  { key: "all", label: "Alle", icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
  {
    key: "pending",
    label: "Neu",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    key: "in_progress",
    label: "In Arbeit",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
  },
  {
    key: "estimate",
    label: "KV offen",
    icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
  },
  {
    key: "completed",
    label: "Fertig",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

const IN_PROGRESS_STATUSES = [
  "received",
  "diagnosing",
  "in_repair",
  "repaired",
  "quality_check",
  "in_transit_to_shop",
  "label_sent",
  "approved",
];
const COMPLETED_STATUSES = ["delivered", "cancelled", "rejected"];

/* ─── Component ─────────────────────────────────────────── */

interface Props {
  shop: Shop;
  slug: string;
}

export default function RepairAdminDashboard({ shop, slug }: Props) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [orders, setOrders] = useState<RepairOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [modal, setModal] = useState<
    "status" | "estimate" | "tracking" | "label" | null
  >(null);
  const [modalOrder, setModalOrder] = useState<RepairOrder | null>(null);

  const [newStatus, setNewStatus] = useState<RepairOrderStatus>("pending");
  const [updating, setUpdating] = useState(false);

  const [estimateCost, setEstimateCost] = useState("");
  const [estimateMessage, setEstimateMessage] = useState("");
  const [sendingEstimate, setSendingEstimate] = useState(false);

  const [trackingType, setTrackingType] = useState<"inbound" | "outbound">(
    "inbound",
  );
  const [trackingCarrier, setTrackingCarrier] = useState("DHL");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");

  const [labelCarrier, setLabelCarrier] = useState("DHL");
  const [labelWeight, setLabelWeight] = useState("0.5");

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  /* ─── Data fetching ──────────────────────────────────── */

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/shop-admin/repair-orders", {
        credentials: "include",
      });
      if (res.status === 401) {
        // Don't auto-logout — that causes a login loop.
        // Just show a toast so the user knows to refresh.
        showToast("Sitzung abgelaufen — bitte Seite neu laden.", "error");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      showToast("Fehler beim Laden der Aufträge", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) fetchOrders();
  }, [authenticated, fetchOrders]);

  useEffect(() => {
    if (!authenticated) return;
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [authenticated, fetchOrders]);

  /* ─── Auth handlers ──────────────────────────────────── */

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await fetch("/api/shop-admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopId: shop.id, password: loginPassword }),
      });
      if (res.ok) {
        setAuthenticated(true);
        setLoginPassword("");
      } else {
        const data = await res.json();
        setLoginError(data.error || "Ungültige Anmeldedaten");
      }
    } catch {
      setLoginError("Verbindungsfehler — Server nicht erreichbar");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/shop-admin/auth", {
      method: "DELETE",
      credentials: "include",
    });
    setAuthenticated(false);
    setOrders([]);
  };

  /* ─── Action handlers ────────────────────────────────── */

  const handleStatusUpdate = async () => {
    if (!modalOrder) return;
    setUpdating(true);
    try {
      const res = await fetch("/api/shop-admin/repair-orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          orderNumber: modalOrder.order_number,
          status: newStatus,
        }),
      });
      if (res.ok) {
        await fetch("/api/shop-admin/repair-orders/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            orderNumber: modalOrder.order_number,
            newStatus,
          }),
        });
        showToast(`Status → "${STATUS_LABELS[newStatus]}"`);
        closeModal();
        fetchOrders();
      } else {
        const data = await res.json();
        showToast(data.error || "Fehler beim Aktualisieren", "error");
      }
    } catch {
      showToast("Fehler beim Aktualisieren", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleSendEstimate = async () => {
    if (!modalOrder || !estimateCost) return;
    setSendingEstimate(true);
    try {
      const res = await fetch("/api/shop-admin/repair-orders/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          orderNumber: modalOrder.order_number,
          estimatedCost: parseFloat(estimateCost),
          message: estimateMessage || undefined,
        }),
      });
      if (res.ok) {
        showToast("Kostenvoranschlag gesendet");
        closeModal();
        fetchOrders();
      } else {
        const data = await res.json();
        showToast(data.error || "Fehler beim Senden", "error");
      }
    } catch {
      showToast("Fehler beim Senden", "error");
    } finally {
      setSendingEstimate(false);
    }
  };

  const handleSaveTracking = async () => {
    if (!modalOrder || !trackingNumber) return;
    setUpdating(true);
    try {
      const trackingData = {
        carrier: trackingCarrier,
        tracking_number: trackingNumber,
        tracking_url:
          trackingUrl || getDefaultTrackingUrl(trackingCarrier, trackingNumber),
      };
      const body: Record<string, unknown> = {
        orderNumber: modalOrder.order_number,
        status: modalOrder.status,
      };
      if (trackingType === "inbound") {
        body.inboundTracking = trackingData;
      } else {
        body.outboundTracking = trackingData;
        if (["repaired", "quality_check"].includes(modalOrder.status)) {
          body.status = "in_transit_to_customer";
        }
      }
      const res = await fetch("/api/shop-admin/repair-orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (res.ok) {
        await fetch("/api/shop-admin/repair-orders/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            orderNumber: modalOrder.order_number,
            newStatus: body.status as string,
            trackingInfo: trackingData,
          }),
        });
        showToast("Tracking gespeichert");
        closeModal();
        fetchOrders();
      } else {
        showToast("Fehler beim Speichern", "error");
      }
    } catch {
      showToast("Fehler beim Speichern", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateLabel = async () => {
    if (!modalOrder) return;
    setUpdating(true);
    try {
      const res = await fetch("/api/shop-admin/repair-orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          orderNumber: modalOrder.order_number,
          status: "label_sent",
        }),
      });
      if (res.ok) {
        await fetch("/api/shop-admin/repair-orders/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            orderNumber: modalOrder.order_number,
            newStatus: "label_sent",
            shippingLabel: {
              carrier: labelCarrier,
              weight: labelWeight,
              fromName: modalOrder.customer_name,
              fromAddress: `${modalOrder.customer_address.street}, ${modalOrder.customer_address.zip} ${modalOrder.customer_address.city}`,
              toName: shop.name,
              toAddress: shop.address,
            },
          }),
        });
        showToast(`Versandlabel (${labelCarrier}) gesendet`);
        closeModal();
        fetchOrders();
      } else {
        showToast("Fehler beim Erstellen", "error");
      }
    } catch {
      showToast("Fehler beim Erstellen", "error");
    } finally {
      setUpdating(false);
    }
  };

  const closeModal = () => {
    setModal(null);
    setModalOrder(null);
    setEstimateCost("");
    setEstimateMessage("");
    setTrackingNumber("");
    setTrackingUrl("");
  };

  const openModal = (
    type: "status" | "estimate" | "tracking" | "label",
    order: RepairOrder,
  ) => {
    setModalOrder(order);
    if (type === "status")
      setNewStatus(getNextStatuses(order.status)[0] || order.status);
    if (type === "tracking") setTrackingType("inbound");
    if (type === "label")
      setLabelCarrier(extractPreferredCarrier(order) || "DHL");
    setModal(type);
  };

  /* ─── Helpers ────────────────────────────────────────── */

  const getDefaultTrackingUrl = (carrier: string, num: string) => {
    const urls: Record<string, string> = {
      DHL: `https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=${num}`,
      DPD: `https://tracking.dpd.de/status/de_DE/parcel/${num}`,
      Hermes: `https://www.myhermes.de/empfangen/sendungsverfolgung/sendungsinformation/${num}`,
      GLS: `https://gls-group.com/DE/de/paketverfolgung?match=${num}`,
      UPS: `https://www.ups.com/track?loc=de_DE&tracknum=${num}`,
    };
    return urls[carrier] || urls.DHL;
  };

  const extractPreferredCarrier = (order: RepairOrder): string | null => {
    if (!order.notes) return null;
    const match = order.notes.match(/Versand:\s*(\w+)/);
    return match ? match[1] : null;
  };

  const getNextStatuses = (current: RepairOrderStatus): RepairOrderStatus[] => {
    const idx = STATUS_FLOW.indexOf(current);
    if (current === "rejected") return ["in_transit_to_customer", "cancelled"];
    if (["cancelled", "delivered"].includes(current)) return [];
    const available: RepairOrderStatus[] = [];
    if (idx >= 0) {
      for (let i = idx + 1; i < STATUS_FLOW.length; i++)
        available.push(STATUS_FLOW[i]);
    }
    if (!available.includes("cancelled")) available.push("cancelled");
    return available;
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "pending" && o.status !== "pending") return false;
    if (activeTab === "in_progress" && !IN_PROGRESS_STATUSES.includes(o.status))
      return false;
    if (activeTab === "estimate" && o.status !== "estimate_sent") return false;
    if (activeTab === "completed" && !COMPLETED_STATUSES.includes(o.status))
      return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.device_name.toLowerCase().includes(q) ||
        o.customer_email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    inProgress: orders.filter((o) => IN_PROGRESS_STATUSES.includes(o.status))
      .length,
    estimateOpen: orders.filter((o) => o.status === "estimate_sent").length,
    completed: orders.filter((o) => COMPLETED_STATUSES.includes(o.status))
      .length,
  };

  const todayCount = orders.filter(
    (o) => new Date(o.created_at).toDateString() === new Date().toDateString(),
  ).length;

  /* ═══════════════════════════════════════════════════════
     LOGIN SCREEN
     ═══════════════════════════════════════════════════════ */
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZyIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=')] opacity-100" />
        <div className="relative w-full max-w-[420px]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/25 mb-4">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-white">{shop.name}</h1>
            <p className="text-sm text-slate-400 mt-1">Reparatur-Dashboard</p>
          </div>

          <div className="bg-white/[0.05] backdrop-blur-xl rounded-2xl border border-white/10 p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">
                  Passwort
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
                  autoFocus
                  required
                />
              </div>
              {loginError && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <svg
                    className="w-4 h-4 text-red-400 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                  </svg>
                  <p className="text-red-400 text-sm">{loginError}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loginLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Anmelden...
                  </>
                ) : (
                  "Anmelden"
                )}
              </button>
            </form>
          </div>
          <p className="text-center text-xs text-slate-600 mt-6">
            Nur für autorisierte Mitarbeiter
          </p>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════
     MAIN DASHBOARD
     ═══════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-medium ${
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
          style={{ animation: "slideIn 0.3s ease" }}
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            {toast.type === "success" ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            )}
          </svg>
          {toast.message}
        </div>
      )}

      {/* Top Nav */}
      <header className="bg-white border-b border-gray-200/80 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.42 15.17l-5.384 3.18 1.029-5.997L1.68 7.246l6.023-.875L11.42.854l2.692 5.517 6.023.875-4.385 4.107 1.029 5.998z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900 leading-none">
                  {shop.name}
                </h1>
                <p className="text-[11px] text-gray-400 leading-none mt-0.5">
                  Reparatur-Dashboard
                </p>
              </div>
            </div>
            <div className="hidden sm:block h-6 w-px bg-gray-200 mx-2" />
            <div className="hidden md:flex items-center gap-2">
              {stats.pending > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                  {stats.pending} neu
                </span>
              )}
              {stats.estimateOpen > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full">
                  {stats.estimateOpen} KV offen
                </span>
              )}
              {todayCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
                  +{todayCount} heute
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/${slug}`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              Shop
            </a>
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-50"
              title="Aktualisieren"
            >
              <svg
                className={`w-[18px] h-[18px] ${loading ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.183"
                />
              </svg>
            </button>
            <div className="h-6 w-px bg-gray-200" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
              Abmelden
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Gesamt",
              value: stats.total,
              sub: "Alle Aufträge",
              gradient: "from-gray-500 to-gray-600",
            },
            {
              label: "Offen",
              value: stats.pending,
              sub: "Warten auf Bearbeitung",
              gradient: "from-amber-500 to-amber-600",
            },
            {
              label: "In Arbeit",
              value: stats.inProgress,
              sub: "Aktive Reparaturen",
              gradient: "from-indigo-500 to-indigo-600",
            },
            {
              label: "Abgeschlossen",
              value: stats.completed,
              sub: "Zugestellt / Storniert",
              gradient: "from-emerald-500 to-emerald-600",
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {kpi.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {kpi.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{kpi.sub}</p>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center shadow-sm`}
                >
                  <span className="text-white text-lg font-bold">
                    {kpi.value}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter tabs + Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1 gap-0.5 overflow-x-auto">
            {FILTER_TABS.map((tab) => {
              const count =
                tab.key === "all"
                  ? stats.total
                  : tab.key === "pending"
                    ? stats.pending
                    : tab.key === "in_progress"
                      ? stats.inProgress
                      : tab.key === "estimate"
                        ? stats.estimateOpen
                        : stats.completed;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.key
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={tab.icon}
                    />
                  </svg>
                  {tab.label}
                  {count > 0 && (
                    <span
                      className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        activeTab === tab.key
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="relative w-full sm:w-72">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Suche..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Orders */}
        {loading && orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-10 h-10 border-[3px] border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-400 mt-4">
              Aufträge werden geladen...
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <p className="text-gray-900 font-medium">Keine Aufträge gefunden</p>
            <p className="text-sm text-gray-400 mt-1">
              {orders.length === 0
                ? "Es sind noch keine Reparatur-Anfragen eingegangen."
                : "Kein Ergebnis für den aktuellen Filter."}
            </p>
            {orders.length === 0 && (
              <p className="text-xs text-gray-400 mt-3 max-w-sm text-center">
                Reparatur-Anfragen erscheinen hier, sobald Kunden das Formular
                unter{" "}
                <a
                  href={`/${slug}/repair-request`}
                  className="font-medium text-indigo-600 hover:underline"
                >
                  /{slug}/repair-request
                </a>{" "}
                absenden.
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Desktop header */}
            <div className="hidden lg:grid grid-cols-[1fr_140px_200px_100px_100px_160px] gap-4 px-5 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
              <span>Kunde & Gerät</span>
              <span>Auftragsnr.</span>
              <span>Reparatur</span>
              <span>Preis</span>
              <span>Status</span>
              <span className="text-right">Aktionen</span>
            </div>

            <div className="space-y-2">
              {filteredOrders.map((order) => {
                const isExpanded = expandedId === order.id;
                const carrier = extractPreferredCarrier(order);
                return (
                  <div
                    key={order.id}
                    className={`bg-white rounded-xl border transition-all ${isExpanded ? "border-indigo-200 shadow-md shadow-indigo-50 ring-1 ring-indigo-100" : "border-gray-100 hover:border-gray-200 hover:shadow-sm"}`}
                  >
                    {/* Row */}
                    <div
                      className="grid grid-cols-1 lg:grid-cols-[1fr_140px_200px_100px_100px_160px] gap-3 lg:gap-4 px-5 py-4 items-center cursor-pointer"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : order.id)
                      }
                    >
                      {/* Customer */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-indigo-600">
                            {order.customer_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {order.customer_name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {order.device_name}
                          </p>
                        </div>
                      </div>
                      {/* Order # */}
                      <div>
                        <p className="font-mono text-xs font-semibold text-gray-700 bg-gray-50 px-2 py-1 rounded-md inline-block">
                          {order.order_number}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1 hidden lg:block">
                          {new Date(order.created_at).toLocaleDateString(
                            "de-DE",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                        </p>
                      </div>
                      {/* Repairs */}
                      <div className="flex flex-wrap gap-1">
                        {order.repair_types.length > 0 ? (
                          order.repair_types.slice(0, 3).map((r) => (
                            <span
                              key={r}
                              className="px-2 py-0.5 bg-gray-50 text-gray-600 text-[11px] font-medium rounded-md"
                            >
                              {REPAIR_LABELS[r] || r}
                            </span>
                          ))
                        ) : (
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[11px] font-medium rounded-md">
                            Diagnose
                          </span>
                        )}
                      </div>
                      {/* Price */}
                      <div>
                        {order.final_cost ? (
                          <p className="text-sm font-bold text-gray-900">
                            {order.final_cost.toFixed(2)}€
                          </p>
                        ) : order.quoted_price ? (
                          <p className="text-sm font-semibold text-gray-700">
                            {order.quoted_price.toFixed(2)}€
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400 italic">
                            Auf Anfrage
                          </p>
                        )}
                      </div>
                      {/* Status */}
                      <div>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ring-1 ${STATUS_BADGE[order.status] || "bg-gray-50 text-gray-600 ring-gray-200"}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[order.status]}`}
                          />
                          {STATUS_LABELS[order.status] || order.status}
                        </span>
                      </div>
                      {/* Actions */}
                      <div
                        className="flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {order.status === "pending" && (
                          <button
                            onClick={() => openModal("label", order)}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all"
                            title="Versandlabel"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12zm-3 0h.008v.008h-.008V12z"
                              />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => openModal("status", order)}
                          className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                          title="Status"
                          disabled={getNextStatuses(order.status).length === 0}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                            />
                          </svg>
                        </button>
                        {["received", "diagnosing"].includes(order.status) && (
                          <button
                            onClick={() => openModal("estimate", order)}
                            className="p-2 rounded-lg text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-all"
                            title="KV senden"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                              />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => openModal("tracking", order)}
                          className="p-2 rounded-lg text-gray-500 hover:text-sky-600 hover:bg-sky-50 transition-all"
                          title="Tracking"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                            />
                          </svg>
                        </button>
                        <div className="w-px h-5 bg-gray-100 mx-0.5" />
                        <svg
                          className={`w-4 h-4 text-gray-300 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
                        <div className="px-5 py-5">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Customer info */}
                            <div className="space-y-3">
                              <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={2}
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                  />
                                </svg>
                                Kundendaten
                              </h4>
                              <div className="space-y-2 text-sm">
                                <p className="font-medium text-gray-900">
                                  {order.customer_name}
                                </p>
                                <a
                                  href={`mailto:${order.customer_email}`}
                                  className="text-indigo-600 hover:underline block truncate"
                                >
                                  {order.customer_email}
                                </a>
                                <a
                                  href={`tel:${order.customer_phone}`}
                                  className="text-gray-600 hover:text-gray-900 block"
                                >
                                  {order.customer_phone}
                                </a>
                                <p className="text-gray-500 text-xs leading-relaxed">
                                  {order.customer_address.street}
                                  <br />
                                  {order.customer_address.zip}{" "}
                                  {order.customer_address.city}
                                </p>
                              </div>
                            </div>

                            {/* Device & repair */}
                            <div className="space-y-3">
                              <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={2}
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                                  />
                                </svg>
                                Gerät & Reparatur
                              </h4>
                              <div className="space-y-2 text-sm">
                                <p className="font-medium text-gray-900">
                                  {order.device_name}
                                </p>
                                {order.device_brand && (
                                  <p className="text-gray-500 text-xs">
                                    Marke: {order.device_brand}
                                  </p>
                                )}
                                <div className="flex flex-wrap gap-1">
                                  {order.repair_types.map((r) => (
                                    <span
                                      key={r}
                                      className="px-2 py-0.5 bg-white border border-gray-200 text-gray-700 text-[11px] font-medium rounded-md"
                                    >
                                      {REPAIR_LABELS[r] || r}
                                    </span>
                                  ))}
                                </div>
                                <p className="text-gray-500 text-xs">
                                  {order.pricing_mode === "fixed"
                                    ? "Festpreis"
                                    : "Kostenvoranschlag"}
                                  {order.quoted_price
                                    ? ` — ${order.quoted_price.toFixed(2)}€`
                                    : ""}
                                  {order.final_cost
                                    ? ` → KV: ${order.final_cost.toFixed(2)}€`
                                    : ""}
                                </p>
                                {order.device_issue && (
                                  <div className="bg-white rounded-lg border border-gray-200 p-3 text-xs text-gray-600 leading-relaxed">
                                    <span className="font-medium text-gray-700">
                                      Problem:{" "}
                                    </span>
                                    {order.device_issue}
                                  </div>
                                )}
                                {order.notes && (
                                  <p className="text-gray-400 text-xs">
                                    📝 {order.notes}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Shipping */}
                            <div className="space-y-3">
                              <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={2}
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                                  />
                                </svg>
                                Versand
                              </h4>
                              <div className="space-y-3 text-sm">
                                {carrier && (
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`px-2.5 py-1 rounded-md text-xs font-bold ${CARRIER_COLORS[carrier]?.bg || "bg-gray-200"} ${CARRIER_COLORS[carrier]?.text || "text-gray-800"}`}
                                    >
                                      {carrier}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      bevorzugt
                                    </span>
                                  </div>
                                )}
                                {order.shipping_fee !== undefined && (
                                  <p className="text-gray-500 text-xs">
                                    Versandkosten:{" "}
                                    {order.shipping_fee > 0 ? (
                                      `${order.shipping_fee.toFixed(2)}€`
                                    ) : (
                                      <span className="text-emerald-600 font-medium">
                                        Kostenlos
                                      </span>
                                    )}
                                  </p>
                                )}
                                {order.inbound_tracking && (
                                  <a
                                    href={order.inbound_tracking.tracking_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700 hover:bg-blue-100 transition-all"
                                  >
                                    <span className="font-bold">↓</span>
                                    <span className="font-medium">
                                      {order.inbound_tracking.carrier}
                                    </span>
                                    <span className="text-blue-500 truncate">
                                      {order.inbound_tracking.tracking_number}
                                    </span>
                                  </a>
                                )}
                                {order.outbound_tracking && (
                                  <a
                                    href={order.outbound_tracking.tracking_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-lg text-xs text-emerald-700 hover:bg-emerald-100 transition-all"
                                  >
                                    <span className="font-bold">↑</span>
                                    <span className="font-medium">
                                      {order.outbound_tracking.carrier}
                                    </span>
                                    <span className="text-emerald-500 truncate">
                                      {order.outbound_tracking.tracking_number}
                                    </span>
                                  </a>
                                )}
                                {!order.inbound_tracking &&
                                  !order.outbound_tracking && (
                                    <p className="text-gray-400 text-xs italic">
                                      Kein Tracking vorhanden
                                    </p>
                                  )}
                              </div>
                            </div>
                          </div>

                          {/* Photos */}
                          {order.photos && order.photos.length > 0 && (
                            <div className="mt-5 pt-4 border-t border-gray-100">
                              <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                Fotos
                              </h4>
                              <div className="flex gap-3 overflow-x-auto pb-2">
                                {order.photos.map(
                                  (photo: string, i: number) => (
                                    <img
                                      key={i}
                                      src={photo}
                                      alt={`Foto ${i + 1}`}
                                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                    />
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                          {/* Actions bar */}
                          <div
                            className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {order.status === "pending" && (
                              <button
                                onClick={() => openModal("label", order)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-all"
                              >
                                Versandlabel erstellen
                              </button>
                            )}
                            <button
                              onClick={() => openModal("status", order)}
                              disabled={
                                getNextStatuses(order.status).length === 0
                              }
                              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-all disabled:opacity-40"
                            >
                              Status ändern
                            </button>
                            {["received", "diagnosing"].includes(
                              order.status,
                            ) && (
                              <button
                                onClick={() => openModal("estimate", order)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-orange-200 text-orange-700 text-xs font-medium rounded-lg hover:bg-orange-50 transition-all"
                              >
                                KV senden
                              </button>
                            )}
                            <button
                              onClick={() => openModal("tracking", order)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-all"
                            >
                              Tracking
                            </button>
                            <a
                              href={`/${slug}/repair-status/${order.order_number}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-500 text-xs font-medium rounded-lg hover:bg-gray-50 transition-all ml-auto"
                            >
                              Kunden-Ansicht ↗
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-center text-xs text-gray-400 py-4">
              {filteredOrders.length} von {orders.length} Aufträgen ·
              Auto-Refresh alle 30s
            </p>
          </>
        )}
      </div>

      {/* ═══ MODALS ═══════════════════════════════════════ */}
      {modal && modalOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {modal === "status" && "Status aktualisieren"}
                  {modal === "estimate" && "Kostenvoranschlag"}
                  {modal === "tracking" && "Tracking verwalten"}
                  {modal === "label" && "Versandlabel erstellen"}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {modalOrder.order_number} · {modalOrder.customer_name}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-all"
              >
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Status */}
              {modal === "status" && (
                <>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Aktuell</p>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ring-1 ${STATUS_BADGE[modalOrder.status]}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[modalOrder.status]}`}
                      />
                      {STATUS_LABELS[modalOrder.status]}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Neuer Status</p>
                    <div className="space-y-1.5 max-h-56 overflow-y-auto">
                      {getNextStatuses(modalOrder.status).map((s) => (
                        <label
                          key={s}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${newStatus === s ? "border-indigo-300 bg-indigo-50/50 ring-1 ring-indigo-200" : "border-gray-100 hover:border-gray-200"}`}
                        >
                          <input
                            type="radio"
                            name="ns"
                            value={s}
                            checked={newStatus === s}
                            onChange={() => setNewStatus(s)}
                            className="accent-indigo-600"
                          />
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ring-1 ${STATUS_BADGE[s]}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[s]}`}
                            />
                            {STATUS_LABELS[s]}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Kunde wird per E-Mail benachrichtigt.
                  </p>
                </>
              )}

              {/* Estimate */}
              {modal === "estimate" && (
                <>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                      Reparaturkosten (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={estimateCost}
                      onChange={(e) => setEstimateCost(e.target.value)}
                      placeholder="z.B. 89.90"
                      autoFocus
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                    {estimateCost && (
                      <p className="text-xs text-gray-400 mt-2">
                        Gesamt:{" "}
                        <span className="font-semibold text-gray-700">
                          {(
                            parseFloat(estimateCost) +
                            (modalOrder.shipping_fee || 0)
                          ).toFixed(2)}
                          €
                        </span>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                      Nachricht (optional)
                    </label>
                    <textarea
                      value={estimateMessage}
                      onChange={(e) => setEstimateMessage(e.target.value)}
                      placeholder="z.B. Display muss getauscht werden..."
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-none"
                    />
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                    <p className="text-xs text-amber-700">
                      Kunde erhält E-Mail mit Genehmigen / Ablehnen Buttons.
                    </p>
                  </div>
                </>
              )}

              {/* Tracking */}
              {modal === "tracking" && (
                <>
                  <div className="flex gap-2">
                    {(["inbound", "outbound"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTrackingType(t)}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all border-2 ${
                          trackingType === t
                            ? t === "inbound"
                              ? "border-blue-300 bg-blue-50 text-blue-700"
                              : "border-emerald-300 bg-emerald-50 text-emerald-700"
                            : "border-gray-100 text-gray-500 hover:border-gray-200"
                        }`}
                      >
                        {t === "inbound"
                          ? "📦 Hinweg → Werkstatt"
                          : "📦 Rückweg → Kunde"}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                      Carrier
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["DHL", "DPD", "Hermes", "GLS", "UPS", "FedEx"].map(
                        (c) => (
                          <button
                            key={c}
                            onClick={() => setTrackingCarrier(c)}
                            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border-2 ${
                              trackingCarrier === c
                                ? `${CARRIER_COLORS[c]?.bg} ${CARRIER_COLORS[c]?.text} border-transparent shadow-sm`
                                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                            }`}
                          >
                            {c}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                      Sendungsnummer
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="z.B. 00340434161094042754"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-mono text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                      Tracking-URL (optional)
                    </label>
                    <input
                      type="url"
                      value={trackingUrl}
                      onChange={(e) => setTrackingUrl(e.target.value)}
                      placeholder="Wird automatisch generiert"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Label */}
              {modal === "label" && (
                <>
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                    <p className="text-xs font-medium text-indigo-800 mb-1">
                      Versandlabel für Kunden
                    </p>
                    <p className="text-xs text-indigo-600 leading-relaxed">
                      Erstelle ein Versandlabel mit Absender- und
                      Empfängeradresse. Der Kunde erhält es per E-Mail zum
                      Ausdrucken.
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                      Versanddienstleister
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["DHL", "DPD", "Hermes", "GLS", "UPS"].map((c) => (
                        <button
                          key={c}
                          onClick={() => setLabelCarrier(c)}
                          className={`py-3 px-3 rounded-xl text-sm font-bold transition-all border-2 ${
                            labelCarrier === c
                              ? `${CARRIER_COLORS[c]?.bg} ${CARRIER_COLORS[c]?.text} border-transparent shadow-md`
                              : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                      Gewicht
                    </label>
                    <select
                      value={labelWeight}
                      onChange={(e) => setLabelWeight(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="0.5">bis 0,5 kg (Smartphone)</option>
                      <option value="1">bis 1 kg (Tablet)</option>
                      <option value="2">bis 2 kg (Laptop)</option>
                      <option value="5">bis 5 kg (Sonstiges)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        Absender
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {modalOrder.customer_name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {modalOrder.customer_address.street},{" "}
                        {modalOrder.customer_address.zip}{" "}
                        {modalOrder.customer_address.city}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        Empfänger
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {shop.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {shop.address}
                      </p>
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                    <p className="text-xs text-amber-700">
                      Für automatische DHL/DPD-Labels wird ein
                      Geschäftskunden-API-Zugang benötigt. Aktuell wird eine
                      druckbare Versandanweisung per E-Mail gesendet.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all"
              >
                Abbrechen
              </button>
              <button
                onClick={() => {
                  if (modal === "status") handleStatusUpdate();
                  else if (modal === "estimate") handleSendEstimate();
                  else if (modal === "tracking") handleSaveTracking();
                  else if (modal === "label") handleCreateLabel();
                }}
                disabled={
                  updating ||
                  sendingEstimate ||
                  (modal === "estimate" && !estimateCost) ||
                  (modal === "tracking" && !trackingNumber)
                }
                className="flex-1 py-2.5 px-4 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {(updating || sendingEstimate) && (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {modal === "status" &&
                  (updating ? "Aktualisieren..." : "Status ändern")}
                {modal === "estimate" &&
                  (sendingEstimate ? "Senden..." : "KV senden")}
                {modal === "tracking" &&
                  (updating ? "Speichern..." : "Speichern")}
                {modal === "label" &&
                  (updating ? "Erstellen..." : "Label senden")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
