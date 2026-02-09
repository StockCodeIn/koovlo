import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Free Online Tools | Koovlo",
  description: "Browse all free online tools: PDF, image, education, document, and text utilities. Search 40+ tools organized by category.",
  keywords: [
    "all tools",
    "online tools",
    "free tools",
    "PDF tools",
    "image tools",
    "education tools",
    "document tools",
    "text tools",
  ],
  openGraph: {
    title: "All Free Online Tools | Koovlo",
    description: "Browse all free online tools: PDF, image, education, document, and text utilities.",
    url: "https://www.koovlo.com/tools",
  },
  alternates: {
    canonical: "https://www.koovlo.com/tools",
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
