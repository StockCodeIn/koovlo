import type { Metadata } from "next";
import ToolsNav from "@/components/ToolsNav";

export const metadata: Metadata = {
  title: "Free Document Tools – Koovlo",
  description:
    "Use Koovlo's free online document tools to create resumes, CVs, invoices and fillable PDF forms instantly. Professional templates, PDF export and mobile friendly.",
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
    title: "Free Document Tools – Koovlo",
    description:
      "Create and customize various documents easily with Koovlo’s document generation tools.",
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