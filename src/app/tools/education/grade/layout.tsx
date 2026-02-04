import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Grade Calculator - Convert Marks to Letter Grades Online",
  description:
    "Convert marks to grades instantly with weighted subjects, multiple grading scales, and exam history tracking. Save and analyze performance data.",
  keywords: [
    "grade calculator",
    "convert marks to grade",
    "letter grade calculator",
    "percentage to grade",
    "free grade converter",
    "exam grade calculator",
    "GPA converter",
    "mark calculator",
  ],
  openGraph: {
    title: "Free Grade Calculator - Convert Marks to Letter Grades Online",
    description:
      "Convert marks to grades instantly with weighted subjects, multiple grading scales, and exam history tracking. Save and analyze performance data.",
    type: "website",
    url: "https://koovlo.com/tools/education/grade",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Grade Calculator - Convert Marks to Letter Grades Online",
    description:
      "Convert marks to grades instantly with weighted subjects, multiple grading scales, and exam history tracking. Save and analyze performance data.",
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
    canonical: "https://koovlo.com/tools/education/grade",
  },
};

export default function GradeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
