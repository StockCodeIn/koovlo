import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Cropper - Remove Margins & Crop Pages Online",
  description:
    "Crop PDF pages by removing margins or setting custom coordinates. Remove unwanted whitespace and resize PDF pages easily. Works offline in your browser.",
  keywords: [
    "crop PDF",
    "remove margins PDF",
    "PDF cropper",
    "trim PDF",
    "crop PDF pages",
    "free PDF tool",
    "reduce PDF margins",
    "online PDF editor",
  ],
  openGraph: {
    title: "Free PDF Cropper - Remove Margins & Crop Pages",
    description:
      "Crop PDF pages by removing margins or using custom coordinates. Clean up documents instantly.",
    type: "website",
    url: "https://www.koovlo.com/tools/pdf/crop",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Cropper",
    description: "Remove margins and crop PDF pages - margins or coordinate mode.",
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
    canonical: "https://www.koovlo.com/tools/pdf/crop",
  },
};

export default function CropLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
