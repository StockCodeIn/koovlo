import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Text to Speech - Convert Text to Audio Online",
  description:
    "Convert text to speech instantly with multiple voice options, languages, and adjustable rate/pitch. Perfect for accessibility and content creators.",
  keywords: [
    "text to speech",
    "convert text to audio",
    "text to voice",
    "free TTS tool",
    "voice generator",
    "speech synthesis",
    "accessibility tool",
    "audio content creator",
  ],
  openGraph: {
    title: "Free Text to Speech - Convert Text to Audio Online",
    description:
      "Convert text to speech instantly with multiple voice options, languages, and adjustable rate/pitch. Perfect for accessibility and content creators.",
    type: "website",
    url: "https://koovlo.com/tools/text-web/text-to-speech",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Text to Speech - Convert Text to Audio Online",
    description:
      "Convert text to speech instantly with multiple voice options, languages, and adjustable rate/pitch. Perfect for accessibility and content creators.",
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
    canonical: "https://koovlo.com/tools/text-web/text-to-speech",
  },
};

export default function TextToSpeechLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
