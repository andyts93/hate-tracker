import "leaflet-geosearch/dist/geosearch.css";
import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";

import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Toaster } from "react-hot-toast";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { SessionProvider } from "next-auth/react";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { Logo } from "@/components/icons";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  initialScale: 1,
  width: "device-width",
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  const messages = await getMessages();

  return (
    <html suppressHydrationWarning lang={locale}>
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased dark",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <SessionProvider>
            <NextIntlClientProvider messages={messages}>
              <div className="relative flex flex-col h-screen">
                <Navbar />
                <Toaster position="top-center" />
                {children}
                <footer className="bg-black">
                  <div className="container mx-auto max-w-7xl py-6 md:py-16 px-4 flex-grow">
                    <Logo fill="#ec4899" />
                    <p className="font-bold text-inherit uppercase">
                      Heartwave
                    </p>
                    <p className="text-xs">&copy; 2024</p>
                  </div>
                </footer>
              </div>
            </NextIntlClientProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
