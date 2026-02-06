// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from "@/components/Analytics";
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

export const metadata: Metadata = {
  title: "Koovlo – Free Online Tools for PDF, Image, Education & More",
  description: "Koovlo offers fast, free and secure online tools for PDF manipulation, image editing, education calculators, document generators, and text utilities. No uploads required.",
  keywords: "PDF tools, image tools, online calculators, document generator, text utilities, free tools",

  applicationName: "Koovlo",

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
    title: "Koovlo – Free Online Tools",
    description: "Fast, free and secure online tools for everyday tasks.",
    url: "https://koovlo.com",
    siteName: "Koovlo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Koovlo – Free Online Tools",
    description: "Fast, free and secure online tools for everyday tasks.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Koovlo",
    "description": "Free online tools for PDF, image, education, and text processing",
    "url": "https://koovlo.com",
    "applicationCategory": "Utility",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {/* Google Analytics - Add your GA4 ID in environment variables */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        
        <Header />
        <main itemScope itemType="https://schema.org/WebApplication">
          {children}
        </main>
        <Footer />
        
        {/* Vercel Analytics */}
        <VercelAnalytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
