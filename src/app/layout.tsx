import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import ClientEffects from "@/components/ClientEffects";
import SiteChrome from "@/components/SiteChrome";
import JsonLd from "@/components/JsonLd";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const SITE_URL = getSiteUrl();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  preload: true,
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HealthMatics | Healthcare Intelligence for the People Shaping What's Next",
    template: "%s | HealthMatics",
  },
  description:
    "Independent healthcare news, analysis, research and insights for the executives, technology leaders and decision-makers transforming healthcare.",
  applicationName: "HealthMatics",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    siteName: "HealthMatics",
    url: SITE_URL,
    title: "HealthMatics | Healthcare Intelligence for the People Shaping What's Next",
    description:
      "Independent healthcare news, analysis, research and insights for the executives, technology leaders and decision-makers transforming healthcare.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "HealthMatics | Healthcare Intelligence",
    description:
      "Independent healthcare news, analysis, research and insights for decision-makers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "HealthMatics",
            url: SITE_URL,
            logo: `${SITE_URL}/brand/mark.svg`,
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "HealthMatics",
            url: SITE_URL,
            potentialAction: {
              "@type": "SearchAction",
              target: `${SITE_URL}/?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }}
        />
        {children}
        <ClientEffects />
        <SiteChrome />
      </body>
    </html>
  );
}
