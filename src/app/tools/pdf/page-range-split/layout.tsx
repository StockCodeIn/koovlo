import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Page Range Splitter - Split PDF by Custom Ranges Online",
  description:
    "Split PDF into multiple files by custom page ranges. Specify ranges like 1-5, 7, 10-15 to create separate PDFs. Perfect for organizing documents into chapters or sections. Works offline in your browser.",
  keywords: [
    "split PDF by range",
    "PDF page range splitter",
    "divide PDF pages",
    "custom PDF split",
    "PDF range tool",
    "free PDF tool",
    "split PDF chapters",
    "PDF sections splitter",
  ],
  openGraph: {
    title: "Free PDF Page Range Splitter - Split by Custom Ranges",
    description:
      "Split PDF into multiple files using custom page ranges. Organize documents into chapters instantly.",
    type: "website",
    url: "https://koovlo.com/tools/pdf/page-range-split",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Page Range Splitter",
    description: "Split PDF by page ranges - download all split files as ZIP.",
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
    canonical: "https://koovlo.com/tools/pdf/page-range-split",
  },
};

export default function PageRangeSplitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
