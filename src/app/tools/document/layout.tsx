import type { Metadata } from "next";
import ToolsNav from "@/components/ToolsNav";

export const metadata: Metadata = {
  title: "Free Document Tools – Koovlo",
  description:
    "Generate professional documents quickly with Koovlo’s free online tools: resumes, invoices, certificates, and more.",
  keywords: [
    "resume builder",
    "invoice generator",
    "certificate generator",
    "document templates",
    "Koovlo document tools",
  ],
  openGraph: {
    title: "Free Document Tools – Koovlo",
    description:
        "Create and customize various documents easily with Koovlo’s document generation tools.",
    url: "https://koovlo.com/tools/document",
    siteName: "Koovlo",
    type: "website",
  },
};

export default function DocumentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        <ToolsNav />
    <section >
      <div>{children}</div>
    </section>
    </>
  );
}
