import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { SourceCapture } from "@/components/site/SourceCapture";
import { Tracker } from "@/components/site/Tracker";
import { SiteChrome } from "@/components/site/SiteChrome";
import { AddedGuide } from "@/components/shop/AddedGuide";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { JsonLd, organizationLd, websiteLd } from "@/lib/seo";
import { BRAND } from "@/lib/brand";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.domain),
  title: { default: "CAPRA Vacuum Flasks & Thermos Jugs | Pakistan", template: "%s | CAPRA" },
  description: BRAND.description,
  applicationName: BRAND.name,
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "48x48" }, { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }, { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" }, { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" }],
    apple: [{ url: "/apple-icon-180x180.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
  appleWebApp: { capable: true, title: BRAND.name, statusBarStyle: "black-translucent" },
  openGraph: { siteName: BRAND.name, locale: "en_PK", type: "website" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  formatDetection: { telephone: true, address: true, email: true },
  authors: [{ name: BRAND.legalName, url: BRAND.domain }],
  creator: BRAND.legalName,
  publisher: BRAND.legalName,
  category: "Shopping",
  other: { "msapplication-config": "/browserconfig.xml", "msapplication-TileColor": "#0b0a09", "geo.region": "PK-PB", "geo.placename": BRAND.address.city, "geo.position": `${BRAND.geo.latitude};${BRAND.geo.longitude}`, ICBM: `${BRAND.geo.latitude}, ${BRAND.geo.longitude}` },
};
export const viewport: Viewport = { themeColor: "#0b0a09", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-PK" className={`${fraunces.variable} ${inter.variable}`} data-scroll-behavior="smooth">
      <body>
        <JsonLd data={[organizationLd(), websiteLd()]} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink-950 focus:px-5 focus:py-3 focus:text-sm focus:text-bone-50">Skip to content</a>
        <SourceCapture />
        <Tracker />
        <SiteChrome><Nav /></SiteChrome>
        <main id="main" tabIndex={-1}>{children}</main>
        <SiteChrome><Footer /></SiteChrome>
        <SiteChrome><AddedGuide /></SiteChrome>
        <SiteChrome><WhatsAppButton /></SiteChrome>
      </body>
    </html>
  );
}
