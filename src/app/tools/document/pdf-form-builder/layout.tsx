import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Form Builder - Create Fillable PDF Forms Online",
  description:
    "Create professional fillable PDF forms instantly with drag-and-drop form builder. Add text fields, checkboxes, dropdowns, and signatures. Perfect for surveys, applications, and documents.",
  keywords: [
    "PDF form builder",
    "fillable PDF",
    "create PDF forms",
    "form builder online",
    "free form maker",
    "editable PDF forms",
    "interactive PDF",
    "PDF form creator",
  ],
  openGraph: {
    title: "Free PDF Form Builder - Create Fillable Forms",
    description:
      "Create professional fillable PDF forms with drag-and-drop editor. Add fields, signatures, and more.",
    type: "website",
    url: "https://www.koovlo.com/tools/document/pdf-form-builder",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Form Builder",
    description: "Create fillable PDF forms instantly - drag, drop, and download.",
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
    canonical: "https://www.koovlo.com/tools/document/pdf-form-builder",
  },
};

export default function PdfFormBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
