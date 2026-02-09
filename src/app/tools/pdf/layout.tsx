import type { Metadata } from "next";
import ToolsNav from "@/components/ToolsNav";

export const metadata: Metadata = {
  title: "Free PDF Tools – Koovlo",
  description:
    "Fast, secure, and privacy-friendly PDF tools by Koovlo. Merge, compress, split, rotate, and manage PDFs instantly — all offline.",
  keywords: [
    "PDF merge",
    "PDF compress",
    "PDF tools online",
    "Free PDF editor",
    "Koovlo PDF tools",
  ],
  openGraph: {
    title: "Free PDF Tools – Koovlo",
    description:
      "Use Koovlo's powerful free PDF utilities: merge, compress, split, and manage PDFs online.",
    url: "https://www.koovlo.com/tools/pdf",
    siteName: "Koovlo",
    type: "website",
  },
};

export default function PdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        <ToolsNav />
    <section>
      <div>{children}</div>
    </section>
    </>
  );
}
