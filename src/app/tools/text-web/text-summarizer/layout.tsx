import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Text Summarizer - Summarize Long Text Automatically",
  description:
    "Summarize long text instantly with extractive and bullet-point modes. Get key sentences, adjust compression ratio, and track summary history.",
  keywords: [
    "text summarizer",
    "summarize text",
    "text summary generator",
    "content summarizer",
    "free summarizer tool",
    "AI summarizer",
    "automatic summarization",
    "text compression",
  ],
  openGraph: {
    title: "Free Text Summarizer - Summarize Long Text Automatically",
    description:
      "Summarize long text instantly with extractive and bullet-point modes. Get key sentences, adjust compression ratio, and track summary history.",
    type: "website",
    url: "https://www.koovlo.com/tools/text-web/text-summarizer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Text Summarizer - Summarize Long Text Automatically",
    description:
      "Summarize long text instantly with extractive and bullet-point modes. Get key sentences, adjust compression ratio, and track summary history.",
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
    canonical: "https://www.koovlo.com/tools/text-web/text-summarizer",
  },
};

export default function TextSummarizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
