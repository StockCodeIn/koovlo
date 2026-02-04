import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free JSON Formatter - Format & Validate JSON Online",
  description:
    "Format, validate, and minify JSON code instantly. Customize indentation, view error messages, and track formatting history.",
  keywords: [
    "JSON formatter",
    "format JSON",
    "JSON validator",
    "JSON minifier",
    "free JSON tool",
    "code formatter",
    "JSON beautifier",
    "validate JSON",
  ],
  openGraph: {
    title: "Free JSON Formatter - Format & Validate JSON Online",
    description:
      "Format, validate, and minify JSON code instantly. Customize indentation, view error messages, and track formatting history.",
    type: "website",
    url: "https://koovlo.com/tools/text-web/json-formatter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free JSON Formatter - Format & Validate JSON Online",
    description:
      "Format, validate, and minify JSON code instantly. Customize indentation, view error messages, and track formatting history.",
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
    canonical: "https://koovlo.com/tools/text-web/json-formatter",
  },
};

export default function JSONFormatterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
