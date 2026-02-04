// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Koovlo – Free Online Tools for PDF, Image, Education & More",
  description: "Koovlo offers fast, free and secure online tools for PDF manipulation, image editing, education calculators, document generators, and text utilities. No uploads required.",
  keywords: "PDF tools, image tools, online calculators, document generator, text utilities, free tools",
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
        <Header />
        <main itemScope itemType="https://schema.org/WebApplication">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
