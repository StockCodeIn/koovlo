import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Document Tools - Koovlo",
  description:
    "Use Koovlo's free online document tools to create resumes, CVs, invoices, and fillable PDF forms instantly. Professional templates, PDF export, and mobile-friendly workflows.",
  keywords: [
    "resume builder",
    "invoice generator",
    "certificate generator",
    "document templates",
    "Koovlo document tools",
  ],
  alternates: {
    canonical: "https://www.koovlo.com/tools/document",
  },
  openGraph: {
    title: "Free Document Tools - Koovlo",
    description:
      "Create and customize documents easily with Koovlo's browser-based document tools.",
    url: "https://www.koovlo.com/tools/document",
    siteName: "Koovlo",
    type: "website",
  },
};

export default function DocumentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
