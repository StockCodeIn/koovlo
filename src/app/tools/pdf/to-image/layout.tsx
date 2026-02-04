import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF to Image Converter - Convert PDF to PNG, JPG Online",
  description:
    "Convert PDF pages to high-quality images (PNG, JPG). Extract all pages or specific pages as image files. Perfect for presentations, websites, and sharing. Works offline in your browser.",
  keywords: [
    "PDF to image",
    "PDF to PNG",
    "PDF to JPG",
    "convert PDF to image",
    "PDF image converter",
    "free PDF tool",
    "PDF to picture",
    "extract PDF images",
  ],
  openGraph: {
    title: "Free PDF to Image Converter - PNG, JPG",
    description:
      "Convert PDF pages to high-quality images. Choose PNG or JPG format and download instantly.",
    type: "website",
    url: "https://koovlo.com/tools/pdf/to-image",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF to Image Converter",
    description: "Convert PDF to PNG or JPG images - high quality and fast.",
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
    canonical: "https://koovlo.com/tools/pdf/to-image",
  },
};

export default function ToImageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
