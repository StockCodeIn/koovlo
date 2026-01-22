import type { Metadata } from "next";
import ToolsNav from "@/components/ToolsNav";

export const metadata: Metadata = {
  title: "Free Education Tools – Koovlo",
  description:
    "Calculate percentages, CGPA, grades, and exam scores instantly with Koovlo’s education tools. Fast, accurate, and student-friendly.",
  keywords: [
    "percentage calculator",
    "CGPA calculator",
    "exam marks calculator",
    "study planner",
    "Koovlo education tools",
  ],
  openGraph: {
    title: "Free Education Tools – Koovlo",
    description:
      "Smart, free education tools for students — calculate grades, CGPA, attendance, and more in seconds.",
    url: "https://koovlo.com/tools/education",
    siteName: "Koovlo",
    type: "website",
  },
};

export default function EducationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        <ToolsNav />
    <section>
      <div>{children}</div>
    </section>
    </>
  );
}
