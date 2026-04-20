// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css" with { type: "css" };
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolsNavServer from "@/components/ToolsNavServer";
import ToolsNavClient from "@/components/ToolsNavClient";
import ToolsNav from "@/components/ToolsNav";
import { GoogleAnalytics } from "@/components/Analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.koovlo.com"),
  alternates: {
    canonical: "https://www.koovlo.com",
  },
  title: {
    default: "Koovlo - Free Online Tools for PDF, Image, Education and More",
    template: "%s | Koovlo",
  },
  description:
    "Koovlo offers fast, free, and privacy-first online tools for PDF workflows, image editing, education calculators, document generation, and text utilities.",
  keywords: [
    "PDF tools",
    "image tools",
    "online calculators",
    "document generator",
    "text utilities",
    "free tools",
    "privacy first tools",
    "browser based converter",
    "PDF converter",
    "image converter",
    "GPA calculator",
    "resume builder",
    "invoice generator",
  ],
  applicationName: "Koovlo",
  authors: [{ name: "Koovlo Team" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Koovlo - Free Online Tools",
    description:
      "Fast, free, and privacy-first online tools for everyday PDF, image, document, and education tasks.",
    url: "https://www.koovlo.com",
    siteName: "Koovlo",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Koovlo - Free Online Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Koovlo - Free Online Tools",
    description:
      "Fast, free, and privacy-first online tools for everyday PDF, image, document, and education tasks.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Koovlo",
    description:
      "Free browser-based tools for PDF, image, education, document, and text processing",
    url: "https://www.koovlo.com",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    image: "https://www.koovlo.com/og-image.png",
    potentialAction: {
      "@type": "UseAction",
      target: "https://www.koovlo.com/tools",
    },
  };

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${poppins.variable}`}>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <Header />
        <ToolsNavServer />   {/* SEO */}
        {/* <ToolsNavClient />   */}
        {/* <ToolsNav /> */}
        <main>{children}</main>
        <Footer />
        <VercelAnalytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
