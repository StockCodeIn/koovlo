import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Image Tools – Koovlo",
  description:
    "Use Koovlo's free online image tools to resize, compress, convert and optimize images instantly. Supports JPG, PNG and WebP formats. Fast, secure and mobile friendly.",
  keywords: [
    "image compress",
    "image resize",
    "image to webp",
    "background remover",
    "Koovlo image tools",
  ],
  alternates: {
    canonical: "https://www.koovlo.com/tools/image",
  },
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
  return <>{children}</>;
}
