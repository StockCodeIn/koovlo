import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Watermark Tool - Add Text or Image Watermarks Online",
  description:
    "Add custom text or image watermarks to PDF documents instantly. Protect your PDFs with watermarks, logos, or copyright notices. Customize position, opacity, and size. Works offline in your browser.",
  keywords: [
    "PDF watermark",
    "add watermark to PDF",
    "PDF watermark tool",
    "watermark PDF online",
    "PDF logo watermark",
    "free PDF tool",
    "text watermark PDF",
    "image watermark PDF",
  ],
  openGraph: {
    title: "Free PDF Watermark Tool - Text or Image",
    description:
      "Add custom watermarks to PDFs. Choose text or image watermarks with adjustable position and opacity.",
    type: "website",
    url: "https://www.koovlo.com/tools/pdf/watermark",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Watermark Tool",
    description: "Add text or image watermarks to PDFs - customize position and opacity.",
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
    canonical: "https://www.koovlo.com/tools/pdf/watermark",
  },
};

export default function WatermarkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
