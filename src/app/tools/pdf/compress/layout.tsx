import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Compressor - Reduce PDF File Size Online",
  description:
    "Compress PDF files instantly with 3 compression levels (Low, Medium, High). Reduce file size while maintaining quality. No upload required - process offline in your browser.",
  keywords: [
    "compress PDF",
    "reduce PDF size",
    "PDF compressor",
    "free PDF compression",
    "optimize PDF",
    "smaller PDF",
    "PDF file size reduction",
    "online PDF tool",
  ],
  openGraph: {
    title: "Free PDF Compressor - Reduce File Size Online",
    description:
      "Compress PDFs with multiple compression levels. Reduce file size instantly without quality loss. Works offline, fully private.",
    type: "website",
    url: "https://koovlo.com/tools/pdf/compress",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Compressor",
    description: "Reduce PDF file size with adjustable compression levels. Fast, secure, offline.",
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
    canonical: "https://koovlo.com/tools/pdf/compress",
  },
};

export default function CompressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
