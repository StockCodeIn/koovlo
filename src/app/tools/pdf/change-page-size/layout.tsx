import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Page Size Converter - Change Document Dimensions Online",
  description:
    "Change PDF page size from A4 to A3, Letter, Legal, or custom dimensions. Resize all pages instantly with our free online tool. No upload needed.",
  keywords: [
    "PDF page size",
    "change PDF dimensions",
    "PDF resize",
    "A4 to A3 converter",
    "PDF page converter",
    "resize PDF pages",
    "free PDF tool",
  ],
  openGraph: {
    title: "PDF Page Size Converter - Resize PDF Pages Online",
    description:
      "Easily change PDF page sizes from A4, A3, Letter to custom dimensions. Works instantly in your browser.",
    type: "website",
    url: "https://koovlo.com/tools/pdf/change-page-size",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Page Size Converter",
    description: "Change PDF page dimensions online - A4, A3, Letter, Legal, or custom sizes.",
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
    canonical: "https://koovlo.com/tools/pdf/change-page-size",
  },
};

export default function ChangePageSizeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
