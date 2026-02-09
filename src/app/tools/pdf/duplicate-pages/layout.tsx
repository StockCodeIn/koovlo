import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Page Duplicator - Copy Pages Within PDF Online",
  description:
    "Duplicate specific pages within your PDF document. Create multiple copies of selected pages instantly. Perfect for templates, forms, and worksheets. Works offline in your browser.",
  keywords: [
    "duplicate PDF pages",
    "copy PDF pages",
    "PDF duplicator",
    "repeat PDF pages",
    "clone PDF pages",
    "free PDF tool",
    "multiply PDF pages",
    "PDF page copies",
  ],
  openGraph: {
    title: "Free PDF Page Duplicator - Copy Pages Within PDF",
    description:
      "Duplicate specific pages within your PDF. Create multiple copies of selected pages for templates and forms.",
    type: "website",
    url: "https://www.koovlo.com/tools/pdf/duplicate-pages",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Page Duplicator",
    description: "Duplicate specific pages within your PDF - perfect for templates and worksheets.",
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
    canonical: "https://www.koovlo.com/tools/pdf/duplicate-pages",
  },
};

export default function DuplicatePagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
