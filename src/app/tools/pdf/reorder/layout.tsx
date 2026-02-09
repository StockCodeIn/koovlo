import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Page Reorder Tool - Rearrange & Delete Pages Online",
  description:
    "Reorder PDF pages visually with drag-and-drop interface. Delete unwanted pages and rearrange your document easily. Perfect for organizing PDFs. Works offline in your browser.",
  keywords: [
    "reorder PDF pages",
    "rearrange PDF",
    "PDF page organizer",
    "delete PDF pages",
    "drag and drop PDF",
    "free PDF tool",
    "reorganize PDF",
    "PDF page sorter",
  ],
  openGraph: {
    title: "Free PDF Page Reorder Tool - Rearrange & Delete Pages",
    description:
      "Reorder PDF pages visually with drag-and-drop. Delete pages and reorganize documents instantly.",
    type: "website",
    url: "https://www.koovlo.com/tools/pdf/reorder",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Page Reorder Tool",
    description: "Drag-and-drop to reorder PDF pages - delete and reorganize easily.",
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
    canonical: "https://www.koovlo.com/tools/pdf/reorder",
  },
};

export default function ReorderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
