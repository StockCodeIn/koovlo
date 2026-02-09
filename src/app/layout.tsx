// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from "@/components/Analytics";
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

export const metadata: Metadata = {
  metadataBase: new URL("https://www.koovlo.com"),
  title: {
    default: "Koovlo – Free Online Tools for PDF, Image, Education & More",
    template: "%s | Koovlo",
  },
  description: "Koovlo offers fast, free and secure online tools for PDF manipulation, image editing, education calculators, document generators, and text utilities. No uploads required.",
  keywords: [
    "PDF tools", 
    "image tools", 
    "online calculators", 
    "document generator", 
    "text utilities", 
    "free tools",
    "online converter",
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
    title: "Koovlo – Free Online Tools",
    description: "Fast, free and secure online tools for everyday tasks.",
    url: "https://www.koovlo.com",
    siteName: "Koovlo",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Koovlo - Free Online Tools",
      },
    ],
    locale: "en_US",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Koovlo – Free Online Tools",
    description: "Fast, free and secure online tools for everyday tasks.",
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
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Koovlo",
    "description": "Free online tools for PDF, image, education, and text processing",
    "url": "https://www.koovlo.com",
    "applicationCategory": "Utility",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "image": "https://www.koovlo.com/og-image.png",
    "potentialAction": {
      "@type": "UseAction",
      "target": "https://www.koovlo.com/tools"
    }
  };

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* Preload critical fonts and resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Canonical URL */}
        <link rel="canonical" href="https://www.koovlo.com" />
      </head>
      <body>
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        
        <Header />
        <main>
          {children}
        </main>
        <Footer />
        
        {/* Vercel Analytics & Speed Insights */}
        <VercelAnalytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
