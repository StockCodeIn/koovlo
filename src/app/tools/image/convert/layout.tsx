import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Image Format Converter - Convert PNG, JPG, WebP Online",
  description:
    "Convert images between formats (PNG, JPG, WebP) instantly with quality control. Adjust dimensions while converting. Fast, secure, browser-based conversion.",
  keywords: [
    "image converter",
    "convert image format",
    "PNG to JPG",
    "JPG to PNG",
    "image format converter",
    "free image converter",
    "batch convert",
    "WebP converter",
  ],
  openGraph: {
    title: "Free Image Format Converter - Convert PNG, JPG, WebP Online",
    description:
      "Convert images between formats (PNG, JPG, WebP) instantly with quality control. Adjust dimensions while converting. Fast, secure, browser-based conversion.",
    type: "website",
    url: "https://www.koovlo.com/tools/image/convert",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image Format Converter - Convert PNG, JPG, WebP Online",
    description:
      "Convert images between formats (PNG, JPG, WebP) instantly with quality control. Adjust dimensions while converting. Fast, secure, browser-based conversion.",
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
    canonical: "https://www.koovlo.com/tools/image/convert",
  },
};

export default function ConvertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
