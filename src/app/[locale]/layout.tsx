import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { siteConfig } from "@/config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.shopName} – Premium Phones & Accessories`,
    template: `%s | ${siteConfig.shopName}`,
  },
  description: siteConfig.tagline,
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  // Convert hex to RGB triplet for rgba() usage in CSS
  const hexToRgb = (hex: string) => {
    const h = hex.replace("#", "");
    return `${parseInt(h.substring(0, 2), 16)}, ${parseInt(h.substring(2, 4), 16)}, ${parseInt(h.substring(4, 6), 16)}`;
  };

  const cssVars = {
    "--color-primary": siteConfig.primaryColor,
    "--color-primary-dark": siteConfig.primaryColorDark,
    "--color-primary-light": siteConfig.primaryColorLight,
    "--color-primary-rgb": hexToRgb(siteConfig.primaryColor),
    "--color-primary-dark-rgb": hexToRgb(siteConfig.primaryColorDark),
    "--color-primary-light-rgb": hexToRgb(siteConfig.primaryColorLight),
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
