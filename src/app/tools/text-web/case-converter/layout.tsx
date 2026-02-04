import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Case Converter - Convert Text Case Online",
  description:
    "Convert text between uppercase, lowercase, title case, camelCase, snake_case, and kebab-case instantly. Supports multiple case formats.",
  keywords: [
    "case converter",
    "convert case",
    "text case converter",
    "uppercase converter",
    "camelcase converter",
    "snake case converter",
    "kebab case",
    "text transformation",
  ],
  openGraph: {
    title: "Free Case Converter - Convert Text Case Online",
    description:
      "Convert text between uppercase, lowercase, title case, camelCase, snake_case, and kebab-case instantly. Supports multiple case formats.",
    type: "website",
    url: "https://koovlo.com/tools/text-web/case-converter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Case Converter - Convert Text Case Online",
    description:
      "Convert text between uppercase, lowercase, title case, camelCase, snake_case, and kebab-case instantly. Supports multiple case formats.",
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
    canonical: "https://koovlo.com/tools/text-web/case-converter",
  },
};

export default function CaseConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
