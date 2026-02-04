import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Percentage Calculator - Calculate Score Percentages Online",
  description:
    "Calculate percentages instantly. Simple percentage, subject-wise, weighted calculations, and CGPA to percentage conversion. Get instant results.",
  keywords: [
    "percentage calculator",
    "calculate percentage",
    "percent calculator",
    "score percentage",
    "free percentage tool",
    "weighted average calculator",
    "percentage converter",
    "CGPA to percentage",
  ],
  openGraph: {
    title: "Free Percentage Calculator - Calculate Score Percentages Online",
    description:
      "Calculate percentages instantly. Simple percentage, subject-wise, weighted calculations, and CGPA to percentage conversion. Get instant results.",
    type: "website",
    url: "https://koovlo.com/tools/education/percentage",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Percentage Calculator - Calculate Score Percentages Online",
    description:
      "Calculate percentages instantly. Simple percentage, subject-wise, weighted calculations, and CGPA to percentage conversion. Get instant results.",
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
    canonical: "https://koovlo.com/tools/education/percentage",
  },
};

export default function PercentageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
