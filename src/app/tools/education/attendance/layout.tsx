import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Attendance Tracker - Calculate Attendance Percentage Online",
  description:
    "Track student attendance with daily records. Calculate attendance percentage, set targets, and manage class rosters. Support for multiple absence types.",
  keywords: [
    "attendance tracker",
    "attendance calculator",
    "track attendance",
    "attendance percentage",
    "free attendance tool",
    "student attendance",
    "class attendance sheet",
    "absence tracker",
  ],
  openGraph: {
    title: "Free Attendance Tracker - Calculate Attendance Percentage Online",
    description:
      "Track student attendance with daily records. Calculate attendance percentage, set targets, and manage class rosters. Support for multiple absence types.",
    type: "website",
    url: "https://www.koovlo.com/tools/education/attendance",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Attendance Tracker - Calculate Attendance Percentage Online",
    description:
      "Track student attendance with daily records. Calculate attendance percentage, set targets, and manage class rosters. Support for multiple absence types.",
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
    canonical: "https://www.koovlo.com/tools/education/attendance",
  },
};

export default function AttendanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
