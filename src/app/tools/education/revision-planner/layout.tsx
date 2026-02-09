import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Revision Planner - Plan Study Schedule & Exam Preparation",
  description:
    "Create effective study plans by subject and topic. Track hours needed, monitor progress, analyze performance, and manage exam preparation timeline.",
  keywords: [
    "revision planner",
    "study planner",
    "exam preparation planner",
    "study schedule maker",
    "revision schedule",
    "free study planner",
    "exam planner",
    "study plan generator",
  ],
  openGraph: {
    title: "Free Revision Planner - Plan Study Schedule & Exam Preparation",
    description:
      "Create effective study plans by subject and topic. Track hours needed, monitor progress, analyze performance, and manage exam preparation timeline.",
    type: "website",
    url: "https://www.koovlo.com/tools/education/revision-planner",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Revision Planner - Plan Study Schedule & Exam Preparation",
    description:
      "Create effective study plans by subject and topic. Track hours needed, monitor progress, analyze performance, and manage exam preparation timeline.",
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
    canonical: "https://www.koovlo.com/tools/education/revision-planner",
  },
};

export default function RevisionPlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
