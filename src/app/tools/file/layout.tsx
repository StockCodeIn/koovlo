import type { Metadata } from "next";
import ToolsNav from "@/components/ToolsNav";

export const metadata: Metadata = {
  title: "File Tools – Koovlo",
  description:
    "Free online file tools including ZIP file creator, file size checker, bulk renamer, text to PDF converter, and PDF to text extractor.",
  keywords: [
    "file tools",
    "zip file creator",
    "file size checker",
    "bulk renamer",
    "text to PDF converter",
    "PDF to text extractor",
  ],
  openGraph: {
    title: "File Tools – Koovlo",
    description:
        "Free online file tools including ZIP file creator, file size checker, bulk renamer, text to PDF converter, and PDF to text extractor.",
    url: "https://koovlo.com/tools/file",
    siteName: "Koovlo",
    type: "website",
  },
};

export default function FileLayout({
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
