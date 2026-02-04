import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Regex Tester - Test Regular Expressions Online",
  description:
    "Test and debug regular expressions instantly. Match patterns, highlight results, and use regex flags for flexible pattern testing.",
  keywords: [
    "regex tester",
    "regular expression tester",
    "pattern matcher",
    "regex debugger",
    "free regex tool",
    "test regex",
    "regex validator",
    "pattern testing",
  ],
  openGraph: {
    title: "Free Regex Tester - Test Regular Expressions Online",
    description:
      "Test and debug regular expressions instantly. Match patterns, highlight results, and use regex flags for flexible pattern testing.",
    type: "website",
    url: "https://koovlo.com/tools/text-web/regex-tester",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Regex Tester - Test Regular Expressions Online",
    description:
      "Test and debug regular expressions instantly. Match patterns, highlight results, and use regex flags for flexible pattern testing.",
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
    canonical: "https://koovlo.com/tools/text-web/regex-tester",
  },
};

export default function RegexTesterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
