import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free GPA Calculator - Calculate Grade Point Average Online",
  description:
    "Calculate GPA instantly with multiple grade scales. Add courses with credits, use bulk input, and track target GPA. Supports preset curricula.",
  keywords: [
    "GPA calculator",
    "calculate GPA",
    "grade point average",
    "free GPA tool",
    "GPA grade scale",
    "cumulative GPA",
    "college GPA calculator",
    "course calculator",
  ],
  openGraph: {
    title: "Free GPA Calculator - Calculate Grade Point Average Online",
    description:
      "Calculate GPA instantly with multiple grade scales. Add courses with credits, use bulk input, and track target GPA. Supports preset curricula.",
    type: "website",
    url: "https://www.koovlo.com/tools/education/gpa",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free GPA Calculator - Calculate Grade Point Average Online",
    description:
      "Calculate GPA instantly with multiple grade scales. Add courses with credits, use bulk input, and track target GPA. Supports preset curricula.",
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
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
