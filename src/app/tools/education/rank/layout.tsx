import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Rank Calculator - Calculate Student Rankings & Scores",
  description:
    "Calculate student rankings based on scores. View statistics (highest, lowest, average, median), track performance history, and analyze trends.",
  keywords: [
    "rank calculator",
    "student ranking system",
    "rank students",
    "score ranking",
    "free rank tool",
    "ranking calculator",
    "leaderboard creator",
    "performance tracker",
  ],
  openGraph: {
    title: "Free Rank Calculator - Calculate Student Rankings & Scores",
    description:
      "Calculate student rankings based on scores. View statistics (highest, lowest, average, median), track performance history, and analyze trends.",
    type: "website",
    url: "https://koovlo.com/tools/education/rank",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Rank Calculator - Calculate Student Rankings & Scores",
    description:
      "Calculate student rankings based on scores. View statistics (highest, lowest, average, median), track performance history, and analyze trends.",
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
    canonical: "https://koovlo.com/tools/education/rank",
  },
};

export default function RankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
