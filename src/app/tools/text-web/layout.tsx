import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Online Text & Web Tools – Word Counter, JSON Formatter | Koovlo",
  description:
    "Use Koovlo's free online text and web tools including Word Counter, Case Converter, JSON Formatter, Base64 Encoder, URL Encoder, Text to Speech and more. Fast, secure and browser-based utilities.",
  keywords: [
    " text tools", "web tools", "word counter", "case converter", "text to speech", "JSON formatter", "online utilities"
  ],
  alternates: {
    canonical: "https://www.koovlo.com/tools/text-web",
  },
  openGraph: {
    title: "Free Online Text & Web Tools – Word Counter, JSON Formatter | Koovlo",
    description:
      "A collection of free online text and web tools including word counter, case converter, text to speech, JSON formatter, and more.",
    url: "https://www.koovlo.com/tools/text-web",
    siteName: "Koovlo",
    type: "website",
  },
};

export default function textWebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
