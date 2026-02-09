import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Unlocker - Remove Password Protection Online",
  description:
    "Remove password protection from PDF files instantly. Unlock secured PDFs to enable editing, copying, and printing. Only works with PDFs you own. Works offline in your browser.",
  keywords: [
    "unlock PDF",
    "remove PDF password",
    "PDF password remover",
    "decrypt PDF",
    "unlock secured PDF",
    "free PDF tool",
    "remove PDF security",
    "PDF unlocker",
  ],
  openGraph: {
    title: "Free PDF Unlocker - Remove Password Protection",
    description:
      "Remove password protection from PDFs instantly. Unlock secured files for editing and printing.",
    type: "website",
    url: "https://www.koovlo.com/tools/pdf/unlock",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Unlocker",
    description: "Remove password protection from PDF files - unlock instantly.",
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
    canonical: "https://www.koovlo.com/tools/pdf/unlock",
  },
};

export default function UnlockLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
