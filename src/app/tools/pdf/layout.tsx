import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Tools - Merge, Compress, Convert, Sign and Edit PDFs",
  description:
    "Use free browser-based PDF tools on Koovlo to merge, compress, split, convert, sign, and organize documents with a privacy-first workflow.",
  keywords: [
    "pdf tools",
    "merge pdf",
    "compress pdf",
    "convert pdf",
    "sign pdf",
    "browser based pdf tools",
  ],
  openGraph: {
    title: "PDF Tools - Merge, Compress, Convert, Sign and Edit PDFs",
    description:
      "Use Koovlo's PDF tools to work on documents faster with less friction and better privacy messaging.",
    url: "https://www.koovlo.com/tools/pdf",
    siteName: "Koovlo",
    type: "website",
  },
  alternates: {
    canonical: "https://www.koovlo.com/tools/pdf",
  },
};

export default function PdfLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
