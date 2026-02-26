import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Education Tools – Koovlo",
  description:
    "Use Koovlo's free online education tools to calculate GPA, CGPA, percentage, grades, attendance and exam scores instantly. Accurate formulas, fast results and mobile friendly.",
  keywords: [
    "percentage calculator",
    "CGPA calculator",
    "exam marks calculator",
    "study planner",
    "Koovlo education tools",
  ],
  alternates: {
    canonical: "https://www.koovlo.com/tools/education",
  },
  openGraph: {
    title: "Free Education Tools – Koovlo",
    description:
      "Smart, free education tools for students — calculate grades, CGPA, attendance, and more in seconds.",
    url: "https://www.koovlo.com/tools/education",
    siteName: "Koovlo",
    type: "website",
  },
};

export default function EducationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
