import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Lorem Ipsum Generator - Generate Placeholder Text Online",
  description:
    "Generate dummy text instantly with customizable paragraphs and word count. Perfect for design mockups and content placeholders.",
  keywords: [
    "Lorem Ipsum generator",
    "placeholder text generator",
    "dummy text",
    "generate Lorem Ipsum",
    "text generator",
    "free Lorem tool",
    "placeholder content",
    "mock text",
  ],
  openGraph: {
    title: "Free Lorem Ipsum Generator - Generate Placeholder Text Online",
    description:
      "Generate dummy text instantly with customizable paragraphs and word count. Perfect for design mockups and content placeholders.",
    type: "website",
    url: "https://koovlo.com/tools/text-web/lorem-ipsum",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Lorem Ipsum Generator - Generate Placeholder Text Online",
    description:
      "Generate dummy text instantly with customizable paragraphs and word count. Perfect for design mockups and content placeholders.",
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
    canonical: "https://koovlo.com/tools/text-web/lorem-ipsum",
  },
};

export default function LoremIpsumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
