"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import ProductsManager from "@/components/admin/ProductsManager";
import RepairsManager from "@/components/admin/RepairsManager";
import SettingsManager from "@/components/admin/SettingsManager";

type Tab = "dashboard" | "products" | "repairs" | "settings";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const t = useTranslations("admin");
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

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
    { key: "products", label: t("productsSection") },
    { key: "repairs", label: t("repairsSection") },
    { key: "settings", label: t("settingsSection") },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <h1 className="text-xl font-bold text-gray-900">{t("title")}</h1>
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
        {/* Sidebar */}
        <nav className="w-56 bg-white border-r border-gray-200 min-h-[calc(100vh-65px)] p-4 hidden md:block">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium mb-1 transition-colors ${
                activeTab === tab.key
                  ? "bg-orange-50 accent-text"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Mobile tabs */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-40">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? "accent-text border-t-2 border-orange-500"
                  : "text-gray-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-8 pb-20 md:pb-8">
          {activeTab === "dashboard" && <AdminDashboard />}
          {activeTab === "products" && <ProductsManager />}
          {activeTab === "repairs" && <RepairsManager />}
          {activeTab === "settings" && <SettingsManager />}
        </main>
      </div>
    </div>
  );
}
