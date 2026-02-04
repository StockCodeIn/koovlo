import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Image Compressor - Reduce Image File Size Online",
  description:
    "Compress images instantly with adjustable quality and format options (JPEG, WebP). Reduce file size for web without quality loss. Batch processing available.",
  keywords: [
    "image compressor",
    "compress image",
    "reduce image size",
    "image optimization",
    "free image compressor",
    "batch compress",
    "lossy compression",
    "optimize images",
  ],
  openGraph: {
    title: "Free Image Compressor - Reduce Image File Size Online",
    description:
      "Compress images instantly with adjustable quality and format options (JPEG, WebP). Reduce file size for web without quality loss. Batch processing available.",
    type: "website",
    url: "https://koovlo.com/tools/image/compress",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image Compressor - Reduce Image File Size Online",
    description:
      "Compress images instantly with adjustable quality and format options (JPEG, WebP). Reduce file size for web without quality loss. Batch processing available.",
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
    canonical: "https://koovlo.com/tools/image/compress",
  },
};

export default function CompressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
