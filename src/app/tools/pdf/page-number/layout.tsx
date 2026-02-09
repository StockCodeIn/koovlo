import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Page Number Tool - Add Page Numbers to PDF Online",
  description:
    "Add customizable page numbers to PDF documents instantly. Choose position, font size, color, and starting number. Perfect for reports, manuals, and presentations. Works offline in your browser.",
  keywords: [
    "add page numbers PDF",
    "PDF page numbering",
    "number PDF pages",
    "PDF pagination",
    "page number tool",
    "free PDF tool",
    "custom page numbers",
    "PDF page counter",
  ],
  openGraph: {
    title: "Free PDF Page Number Tool - Add Numbers to PDF",
    description:
      "Add customizable page numbers to PDF documents. Choose position, font size, and color instantly.",
    type: "website",
    url: "https://www.koovlo.com/tools/pdf/page-number",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Page Number Tool",
    description: "Add page numbers to PDF - customize position, size, and color.",
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
    canonical: "https://www.koovlo.com/tools/pdf/page-number",
  },
};

export default function PageNumberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
