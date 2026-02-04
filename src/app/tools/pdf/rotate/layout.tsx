import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Rotate Tool - Rotate PDF Pages Online",
  description:
    "Rotate all PDF pages by 90°, 180°, or 270° instantly. Fix document orientation quickly and easily. Perfect for scanned documents and images. Works offline in your browser.",
  keywords: [
    "rotate PDF",
    "PDF rotation",
    "turn PDF pages",
    "rotate PDF pages",
    "fix PDF orientation",
    "free PDF tool",
    "PDF page rotation",
    "rotate document",
  ],
  openGraph: {
    title: "Free PDF Rotate Tool - Rotate Pages Instantly",
    description:
      "Rotate all PDF pages by 90°, 180°, or 270°. Fix orientation and download instantly.",
    type: "website",
    url: "https://koovlo.com/tools/pdf/rotate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Rotate Tool",
    description: "Rotate PDF pages by 90°, 180°, or 270° - fix orientation instantly.",
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
    canonical: "https://koovlo.com/tools/pdf/rotate",
  },
};

export default function RotateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
