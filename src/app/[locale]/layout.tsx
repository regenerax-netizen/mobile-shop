import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { defaultConfig } from "@/config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${defaultConfig.platformName} – Premium Phones & Accessories`,
    template: `%s | ${defaultConfig.platformName}`,
  },
  description: "Multi-tenant mobile shop platform",
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  // Default CSS vars - will be overridden per-shop in the [slug] layout
  const hexToRgb = (hex: string) => {
    const h = hex.replace("#", "");
    return `${parseInt(h.substring(0, 2), 16)}, ${parseInt(h.substring(2, 4), 16)}, ${parseInt(h.substring(4, 6), 16)}`;
  };

  const defaultColor = defaultConfig.defaultAccentColor;
  const defaultDark = defaultConfig.defaultAccentColorDark;
  const defaultLight = defaultConfig.defaultAccentColorLight;

  const cssVars = {
    "--color-primary": defaultColor,
    "--color-primary-dark": defaultDark,
    "--color-primary-light": defaultLight,
    "--color-primary-rgb": hexToRgb(defaultColor),
    "--color-primary-dark-rgb": hexToRgb(defaultDark),
    "--color-primary-light-rgb": hexToRgb(defaultLight),
  } as React.CSSProperties;

  return (
    <html lang={locale} className={inter.variable} style={cssVars}>
      <body className="bg-white text-gray-900 antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
