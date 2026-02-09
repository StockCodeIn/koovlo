import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Page Extractor - Extract Specific Pages from PDF Online",
  description:
    "Extract specific pages from PDF files by page numbers or ranges. Create a new PDF with only the pages you need. Perfect for sharing specific sections. Works offline in your browser.",
  keywords: [
    "extract PDF pages",
    "PDF page extractor",
    "remove PDF pages",
    "select PDF pages",
    "split PDF by pages",
    "free PDF tool",
    "PDF page selector",
    "extract pages from PDF",
  ],
  openGraph: {
    title: "Free PDF Page Extractor - Extract Specific Pages",
    description:
      "Extract specific pages from PDF files by page numbers or ranges. Create a new PDF with selected pages instantly.",
    type: "website",
    url: "https://www.koovlo.com/tools/pdf/extract-pages",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Page Extractor",
    description: "Extract specific pages from PDF - enter page numbers or ranges to create new PDF.",
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
    canonical: "https://www.koovlo.com/tools/pdf/extract-pages",
  },
};

export default function ExtractPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
