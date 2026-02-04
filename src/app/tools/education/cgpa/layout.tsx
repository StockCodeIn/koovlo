import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free CGPA Calculator - Cumulative GPA Calculator Online",
  description:
    "Calculate CGPA across multiple semesters instantly. Support for 4.0 and 10.0 grade scales. Track semester-wise GPA and cumulative performance.",
  keywords: [
    "CGPA calculator",
    "cumulative GPA calculator",
    "semester GPA",
    "calculate CGPA",
    "free CGPA tool",
    "multi-semester GPA",
    "college CGPA",
    "GPA tracker",
  ],
  openGraph: {
    title: "Free CGPA Calculator - Cumulative GPA Calculator Online",
    description:
      "Calculate CGPA across multiple semesters instantly. Support for 4.0 and 10.0 grade scales. Track semester-wise GPA and cumulative performance.",
    type: "website",
    url: "https://koovlo.com/tools/education/cgpa",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free CGPA Calculator - Cumulative GPA Calculator Online",
    description:
      "Calculate CGPA across multiple semesters instantly. Support for 4.0 and 10.0 grade scales. Track semester-wise GPA and cumulative performance.",
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
    canonical: "https://koovlo.com/tools/education/cgpa",
  },
};

export default function CGPALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
