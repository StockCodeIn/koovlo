import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Education Tools - GPA, CGPA, Grade and Attendance Calculators",
  description:
    "Free education tools for GPA, CGPA, percentages, grades, attendance, and revision workflows. Built for students with clear formulas and mobile-friendly inputs.",
  keywords: [
    "gpa calculator",
    "cgpa calculator",
    "attendance calculator",
    "grade calculator",
    "student tools",
    "education tools",
  ],
  alternates: {
    canonical: "https://www.koovlo.com/tools/education",
  },
  openGraph: {
    title: "Education Tools - GPA, CGPA, Grade and Attendance Calculators",
    description:
      "Student-friendly calculators and study tools for everyday academic tasks.",
    url: "https://www.koovlo.com/tools/education",
    siteName: "Koovlo",
    type: "website",
  },
};

export default function EducationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
