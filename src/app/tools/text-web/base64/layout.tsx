import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Base64 Encoder/Decoder - Encode & Decode Base64 Online",
  description:
    "Encode and decode Base64 strings instantly. Convert text to Base64 and vice versa. Perfect for data encoding and API integration.",
  keywords: [
    "Base64 encoder",
    "Base64 decoder",
    "encode Base64",
    "decode Base64",
    "Base64 converter",
    "free Base64 tool",
    "text encoding",
    "Base64 encoding",
  ],
  openGraph: {
    title: "Free Base64 Encoder/Decoder - Encode & Decode Base64 Online",
    description:
      "Encode and decode Base64 strings instantly. Convert text to Base64 and vice versa. Perfect for data encoding and API integration.",
    type: "website",
    url: "https://koovlo.com/tools/text-web/base64",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Base64 Encoder/Decoder - Encode & Decode Base64 Online",
    description:
      "Encode and decode Base64 strings instantly. Convert text to Base64 and vice versa. Perfect for data encoding and API integration.",
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
    canonical: "https://koovlo.com/tools/text-web/base64",
  },
};

export default function Base64Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
