"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export default function LanguageToggle({ scrolled }: { scrolled: boolean }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    // Replace the locale prefix in the current path
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <div className="flex items-center gap-1 text-xs font-semibold">
      <button
        onClick={() => switchLocale("de")}
        className={`px-2 py-1 rounded transition-colors ${
          locale === "de"
            ? "accent-bg text-white"
            : scrolled
              ? "text-gray-500 hover:text-gray-900"
              : "text-white/60 hover:text-white"
        }`}
      >
        DE
      </button>
      <button
        onClick={() => switchLocale("en")}
        className={`px-2 py-1 rounded transition-colors ${
          locale === "en"
            ? "accent-bg text-white"
            : scrolled
              ? "text-gray-500 hover:text-gray-900"
              : "text-white/60 hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
}
