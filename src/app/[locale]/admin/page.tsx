"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import ShopsManager from "@/components/admin/ShopsManager";
import ProductsManager from "@/components/admin/ProductsManager";
import RepairsManager from "@/components/admin/RepairsManager";
import ReviewsManager from "@/components/admin/ReviewsManager";

type Tab = "dashboard" | "shops" | "products" | "repairs" | "reviews";

const tabIcons: Record<Tab, string> = {
  dashboard: "📊",
  shops: "🏪",
  products: "📱",
  repairs: "🔧",
  reviews: "⭐",
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const t = useTranslations("admin");
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-orange-500 rounded-full" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t("title")}
          </h1>
          <p className="text-gray-500 text-sm mb-8">{t("unauthorized")}</p>
          <button
            onClick={() => signIn("google")}
            className="btn-primary w-full py-3 px-6 rounded-xl font-semibold shadow-lg transition-transform hover:scale-105"
          >
            {t("signIn")}
          </button>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "dashboard", label: t("dashboard") },
    { key: "shops", label: t("shopsSection") },
    { key: "products", label: t("productsSection") },
    { key: "repairs", label: t("repairsSection") },
    { key: "reviews", label: t("reviewsSection") },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">{t("title")}</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden sm:inline">
            {session.user?.email}
          </span>
          <button
            onClick={() => signOut()}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            {t("signOut")}
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <nav
          className={`fixed md:sticky top-[65px] left-0 z-30 w-56 bg-white border-r border-gray-200 min-h-[calc(100vh-65px)] h-[calc(100vh-65px)] p-4 transition-transform duration-200 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium mb-1 transition-colors flex items-center gap-3 ${
                activeTab === tab.key
                  ? "bg-orange-50 accent-text"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{tabIcons[tab.key]}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-8">
          {activeTab === "dashboard" && <AdminDashboard />}
          {activeTab === "shops" && <ShopsManager />}
          {activeTab === "products" && <ProductsManager />}
          {activeTab === "repairs" && <RepairsManager />}
          {activeTab === "reviews" && <ReviewsManager />}
        </main>
      </div>
    </div>
  );
}
