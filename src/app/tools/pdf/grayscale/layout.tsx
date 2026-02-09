import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF to Grayscale Converter - Remove Colors from PDF Online",
  description:
    "Convert colored PDFs to grayscale instantly. Remove all colors from PDF documents for printing or file size reduction. Works offline in your browser.",
  keywords: [
    "PDF to grayscale",
    "convert PDF grayscale",
    "PDF black and white",
    "remove color from PDF",
    "grayscale PDF converter",
    "free PDF tool",
    "desaturate PDF",
    "monochrome PDF",
  ],
  openGraph: {
    title: "Free PDF to Grayscale Converter",
    description:
      "Convert colored PDFs to grayscale instantly. Perfect for printing and reducing file sizes.",
    type: "website",
    url: "https://www.koovlo.com/tools/pdf/grayscale",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF to Grayscale Converter",
    description: "Remove colors from PDF documents - convert to black and white instantly.",
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
    canonical: "https://www.koovlo.com/tools/pdf/grayscale",
  },
};

export default function GrayscaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
