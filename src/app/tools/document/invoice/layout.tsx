import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Invoice Generator - Create Professional Invoices Online",
  description:
    "Create and customize professional invoices instantly with templates. Add items, apply taxes, discounts, and download as PDF. Perfect for freelancers, small businesses, and service providers.",
  keywords: [
    "invoice generator",
    "create invoice",
    "professional invoice",
    "free invoice maker",
    "invoice template",
    "invoicing software",
    "business invoice",
    "invoice creator",
  ],
  openGraph: {
    title: "Free Invoice Generator - Create Professional Invoices",
    description:
      "Create beautiful, professional invoices with customizable templates. Download as PDF instantly.",
    type: "website",
    url: "https://www.koovlo.com/tools/document/invoice",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Invoice Generator",
    description: "Create professional invoices instantly - customize, download, and print.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://www.koovlo.com/tools/document/invoice",
  },
};

export default function InvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
