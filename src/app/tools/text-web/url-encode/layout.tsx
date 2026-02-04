import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free URL Encoder/Decoder - Encode & Decode URLs Online",
  description:
    "Encode and decode URLs instantly with customizable options. Convert special characters and manage URL parameters easily.",
  keywords: [
    "URL encoder",
    "URL decoder",
    "encode URL",
    "decode URL",
    "URL encoding",
    "free URL tool",
    "percent encoding",
    "URI encoder",
  ],
  openGraph: {
    title: "Free URL Encoder/Decoder - Encode & Decode URLs Online",
    description:
      "Encode and decode URLs instantly with customizable options. Convert special characters and manage URL parameters easily.",
    type: "website",
    url: "https://koovlo.com/tools/text-web/url-encode",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free URL Encoder/Decoder - Encode & Decode URLs Online",
    description:
      "Encode and decode URLs instantly with customizable options. Convert special characters and manage URL parameters easily.",
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
    canonical: "https://koovlo.com/tools/text-web/url-encode",
  },
};

export default function UrlEncodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
