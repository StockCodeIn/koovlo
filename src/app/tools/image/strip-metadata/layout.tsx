import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free EXIF Metadata Remover - Strip Image Metadata Online",
  description:
    "Remove EXIF data, GPS, and metadata from images instantly for privacy. Clean photos before sharing. Fast, secure browser-based metadata stripper.",
  keywords: [
    "remove metadata",
    "strip metadata",
    "EXIF remover",
    "remove EXIF data",
    "image privacy",
    "metadata stripper",
    "GPS remover",
    "free metadata tool",
  ],
  openGraph: {
    title: "Free EXIF Metadata Remover - Strip Image Metadata Online",
    description:
      "Remove EXIF data, GPS, and metadata from images instantly for privacy. Clean photos before sharing. Fast, secure browser-based metadata stripper.",
    type: "website",
    url: "https://www.koovlo.com/tools/image/strip-metadata",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free EXIF Metadata Remover - Strip Image Metadata Online",
    description:
      "Remove EXIF data, GPS, and metadata from images instantly for privacy. Clean photos before sharing. Fast, secure browser-based metadata stripper.",
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
    canonical: "https://www.koovlo.com/tools/image/strip-metadata",
  },
};

export default function StripMetadataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
