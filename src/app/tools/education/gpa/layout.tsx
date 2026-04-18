import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GPA Calculator - Calculate Semester and Cumulative GPA Online",
  description:
    "Calculate GPA with credits, target planning, and a standard 4.0 scale. Use this free browser-based GPA calculator for semester or cumulative grade point averages.",
  keywords: [
    "gpa calculator",
    "semester gpa calculator",
    "college gpa calculator",
    "target gpa calculator",
    "grade point average",
    "cumulative gpa",
  ],
  openGraph: {
    title: "GPA Calculator - Calculate Semester and Cumulative GPA Online",
    description:
      "Calculate current GPA, plan target grades, and understand credit-weighted averages with Koovlo.",
    type: "website",
    url: "https://www.koovlo.com/tools/education/gpa",
  },
  twitter: {
    card: "summary_large_image",
    title: "GPA Calculator - Calculate Semester and Cumulative GPA Online",
    description:
      "Calculate current GPA, plan target grades, and understand credit-weighted averages with Koovlo.",
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
    canonical: "https://www.koovlo.com/tools/education/gpa",
  },
};

export default function GPALayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
