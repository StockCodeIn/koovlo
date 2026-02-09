import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Watermark Maker - Add Text & Image Watermarks Online",
  description:
    "Add text or image watermarks to photos with customizable position, opacity, color, and font size. Protect images with brand watermarks instantly.",
  keywords: [
    "watermark maker",
    "add watermark",
    "image watermark",
    "text watermark",
    "photo watermark",
    "free watermark tool",
    "batch watermark",
    "watermark generator",
  ],
  openGraph: {
    title: "Free Watermark Maker - Add Text & Image Watermarks Online",
    description:
      "Add text or image watermarks to photos with customizable position, opacity, color, and font size. Protect images with brand watermarks instantly.",
    type: "website",
    url: "https://www.koovlo.com/tools/image/add-watermark",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Watermark Maker - Add Text & Image Watermarks Online",
    description:
      "Add text or image watermarks to photos with customizable position, opacity, color, and font size. Protect images with brand watermarks instantly.",
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
    canonical: "https://www.koovlo.com/tools/image/add-watermark",
  },
};

export default function AddWatermarkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
