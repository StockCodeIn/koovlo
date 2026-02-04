import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Resume & CV Builder - Create ATS-Friendly Resumes Online",
  description:
    "Create professional ATS-friendly resumes and comprehensive CVs instantly. Choose from multiple templates, customize colors, and download as PDF. Perfect for job applications and career advancement.",
  keywords: [
    "resume builder",
    "CV builder",
    "resume maker",
    "ATS-friendly resume",
    "free resume builder",
    "CV template",
    "professional resume",
    "resume creator",
  ],
  openGraph: {
    title: "Free Resume & CV Builder - Create Professional Resumes",
    description:
      "Build ATS-friendly resumes and CVs with professional templates. Customize and download as PDF instantly.",
    type: "website",
    url: "https://koovlo.com/tools/document/resume-builder",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Resume & CV Builder",
    description: "Create professional resumes and CVs - templates, export to PDF, auto-save.",
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
    canonical: "https://koovlo.com/tools/document/resume-builder",
  },
};

export default function ResumeBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
