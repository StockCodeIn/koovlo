import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Image to PDF Converter - Convert JPG, PNG to PDF Online",
  description:
    "Convert multiple images to PDF instantly. Combine JPG, PNG images into a single PDF document. Perfect for creating photo albums, presentations, and portfolios. Works offline in your browser.",
  keywords: [
    "image to PDF",
    "JPG to PDF",
    "PNG to PDF",
    "convert images to PDF",
    "image PDF converter",
    "free PDF tool",
    "combine images PDF",
    "photo to PDF",
  ],
  openGraph: {
    title: "Free Image to PDF Converter - JPG, PNG to PDF",
    description:
      "Convert multiple images to PDF instantly. Combine JPG and PNG images into one document.",
    type: "website",
    url: "https://www.koovlo.com/tools/pdf/to-pdf",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image to PDF Converter",
    description: "Convert JPG and PNG images to PDF - combine multiple images instantly.",
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
    canonical: "https://www.koovlo.com/tools/pdf/to-pdf",
  },
};

export default function ToPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
