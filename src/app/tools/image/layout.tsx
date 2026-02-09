import type { Metadata } from "next";
import ToolsNav from "@/components/ToolsNav";

export const metadata: Metadata = {
  title: "Free Image Tools – Koovlo",
  description:
    "Fast and secure online image tools by Koovlo. Compress, resize, convert, and edit images instantly — all within your browser.",
  keywords: [
    "image compress",
    "image resize",
    "image to webp",
    "background remover",
    "Koovlo image tools",
  ],
  openGraph: {
    title: "Free Image Tools – Koovlo",
    description:
      "Edit, compress and convert images instantly with Koovlo's free and privacy-friendly tools.",
    url: "https://www.koovlo.com/tools/image",
    siteName: "Koovlo",
    type: "website",
  },
};

export default function ImageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        <ToolsNav />
    <section>
      

      <div >{children}</div>
    </section>
    </>
  );
}
