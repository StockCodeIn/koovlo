import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Signature Tool - Sign PDF Documents Online",
  description:
    "Add digital signatures, initials, dates, and text to PDF documents. Drag-and-drop positioning on any page with customizable size and color. Works offline in your browser.",
  keywords: [
    "sign PDF",
    "PDF signature",
    "digital signature PDF",
    "add signature to PDF",
    "e-sign PDF",
    "free PDF tool",
    "PDF signing tool",
    "sign documents online",
  ],
  openGraph: {
    title: "Free PDF Signature Tool - Sign Documents Online",
    description:
      "Add digital signatures, initials, dates, and text to PDFs. Drag to position and customize instantly.",
    type: "website",
    url: "https://www.koovlo.com/tools/pdf/sign",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Signature Tool",
    description: "Sign PDFs with custom signatures - drag, resize, and position anywhere.",
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
    canonical: "https://www.koovlo.com/tools/pdf/sign",
  },
};

export default function SignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
