import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Metadata Editor - View & Edit PDF Properties Online",
  description:
    "View and edit PDF metadata including title, author, subject, keywords, and technical properties. Inspect creation date, page count, encryption status, and more. Works offline in your browser.",
  keywords: [
    "PDF metadata",
    "edit PDF properties",
    "PDF metadata editor",
    "PDF document info",
    "PDF title author",
    "free PDF tool",
    "PDF information editor",
    "view PDF metadata",
  ],
  openGraph: {
    title: "Free PDF Metadata Editor - Edit PDF Properties",
    description:
      "View and edit PDF metadata - title, author, subject, keywords, and technical properties instantly.",
    type: "website",
    url: "https://www.koovlo.com/tools/pdf/metadata",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Metadata Editor",
    description: "Edit PDF metadata and view technical properties - works offline in your browser.",
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
    canonical: "https://www.koovlo.com/tools/pdf/metadata",
  },
};

export default function MetadataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
