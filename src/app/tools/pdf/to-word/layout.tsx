import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF to Word Converter - Convert PDF to DOCX Online",
  description:
    "Convert PDF documents to editable Word files (DOCX) instantly. Extract text and formatting from PDFs for easy editing. Perfect for documents, reports, and forms. Works offline in your browser.",
  keywords: [
    "PDF to Word",
    "PDF to DOCX",
    "convert PDF to Word",
    "PDF Word converter",
    "PDF to editable document",
    "free PDF tool",
    "PDF text extraction",
    "PDF to DOC",
  ],
  openGraph: {
    title: "Free PDF to Word Converter - Convert to DOCX",
    description:
      "Convert PDF documents to editable Word files instantly. Extract text and formatting easily.",
    type: "website",
    url: "https://www.koovlo.com/tools/pdf/to-word",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF to Word Converter",
    description: "Convert PDF to editable Word documents - fast and easy.",
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
    canonical: "https://www.koovlo.com/tools/pdf/to-word",
  },
};

export default function ToWordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
