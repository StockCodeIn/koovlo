import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Quiz Generator - Create Custom Quizzes & Tests Online",
  description:
    "Generate quizzes with multiple choice, true-false, and short answer questions. Set time limits, track scores, and analyze performance across attempts.",
  keywords: [
    "quiz generator",
    "create quiz",
    "online quiz maker",
    "test generator",
    "free quiz tool",
    "quiz builder",
    "question generator",
    "exam maker",
  ],
  openGraph: {
    title: "Free Quiz Generator - Create Custom Quizzes & Tests Online",
    description:
      "Generate quizzes with multiple choice, true-false, and short answer questions. Set time limits, track scores, and analyze performance across attempts.",
    type: "website",
    url: "https://www.koovlo.com/tools/education/quiz-generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Quiz Generator - Create Custom Quizzes & Tests Online",
    description:
      "Generate quizzes with multiple choice, true-false, and short answer questions. Set time limits, track scores, and analyze performance across attempts.",
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
    canonical: "https://www.koovlo.com/tools/education/quiz-generator",
  },
};

export default function QuizGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
