import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Word Counter - Count Words, Characters & Sentences Online",
  description:
    "Count words, characters, lines, sentences, and paragraphs instantly. Get reading time, word statistics, and analyze text density. Supports history tracking.",
  keywords: [
    "word counter",
    "count words",
    "character counter",
    "text statistics",
    "free word counter",
    "sentence counter",
    "word density calculator",
    "text analyzer",
  ],
  openGraph: {
    title: "Free Word Counter - Count Words, Characters & Sentences Online",
    description:
      "Count words, characters, lines, sentences, and paragraphs instantly. Get reading time, word statistics, and analyze text density. Supports history tracking.",
    type: "website",
    url: "https://koovlo.com/tools/text-web/word-counter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Word Counter - Count Words, Characters & Sentences Online",
    description:
      "Count words, characters, lines, sentences, and paragraphs instantly. Get reading time, word statistics, and analyze text density. Supports history tracking.",
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
    canonical: "https://koovlo.com/tools/text-web/word-counter",
  },
};

export default function WordCounterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
