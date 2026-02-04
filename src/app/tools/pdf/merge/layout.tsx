import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Merger - Combine Multiple PDF Files Online",
  description:
    "Merge multiple PDF files into one document instantly. Combine PDFs in any order with drag-and-drop support. Perfect for organizing documents. Works offline in your browser.",
  keywords: [
    "merge PDF",
    "combine PDF files",
    "PDF merger",
    "join PDF",
    "concatenate PDF",
    "free PDF tool",
    "PDF combiner",
    "unite PDF files",
  ],
  openGraph: {
    title: "Free PDF Merger - Combine Multiple PDFs",
    description:
      "Merge multiple PDF files into one document. Drag, reorder, and combine PDFs instantly.",
    type: "website",
    url: "https://koovlo.com/tools/pdf/merge",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Merger",
    description: "Combine multiple PDF files into one - reorder and merge instantly.",
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
    canonical: "https://koovlo.com/tools/pdf/merge",
  },
};

export default function MergeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
