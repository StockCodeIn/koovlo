import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Image Resizer - Change Image Dimensions Online",
  description:
    "Resize images instantly with multiple modes: exact dimensions, percentage, or presets (thumbnail to 4K). Maintain aspect ratio and choose output format.",
  keywords: [
    "image resizer",
    "resize image",
    "change image dimensions",
    "image size reducer",
    "free image resizer",
    "batch image resize",
    "aspect ratio",
    "image scaler",
  ],
  openGraph: {
    title: "Free Image Resizer - Change Image Dimensions Online",
    description:
      "Resize images instantly with multiple modes: exact dimensions, percentage, or presets (thumbnail to 4K). Maintain aspect ratio and choose output format.",
    type: "website",
    url: "https://www.koovlo.com/tools/image/resize",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image Resizer - Change Image Dimensions Online",
    description:
      "Resize images instantly with multiple modes: exact dimensions, percentage, or presets (thumbnail to 4K). Maintain aspect ratio and choose output format.",
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
    canonical: "https://www.koovlo.com/tools/image/resize",
  },
};

export default function ResizeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
