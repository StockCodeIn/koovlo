import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to Image Converter - Convert PDF to PNG or JPG Online",
  description:
    "Convert PDF pages to PNG or JPG images online for websites, previews, presentations, and quick sharing. Fast browser-based PDF to image conversion.",
  keywords: [
    "pdf to image",
    "pdf to png",
    "pdf to jpg",
    "convert pdf to image",
    "pdf image converter",
    "browser based pdf converter",
  ],
  openGraph: {
    title: "PDF to Image Converter - Convert PDF to PNG or JPG Online",
    description:
      "Convert PDF pages into PNG or JPG images with browser-based processing and practical output guidance.",
    type: "website",
    url: "https://www.koovlo.com/tools/pdf/to-image",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF to Image Converter - Convert PDF to PNG or JPG Online",
    description:
      "Convert PDF pages into PNG or JPG images with browser-based processing and practical output guidance.",
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
    canonical: "https://www.koovlo.com/tools/pdf/to-image",
  },
};

export default function ToImageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
