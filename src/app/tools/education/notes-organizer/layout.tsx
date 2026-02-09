import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Notes Organizer - Organize Study Notes & Manage Documents",
  description:
    "Organize study notes by category and tags. Search, pin favorites, color-code notes, and switch between list and grid views. Perfect note management.",
  keywords: [
    "notes organizer",
    "study notes app",
    "organize notes",
    "note taking app",
    "free notes tool",
    "note organizer",
    "document organizer",
    "digital notebook",
  ],
  openGraph: {
    title: "Free Notes Organizer - Organize Study Notes & Manage Documents",
    description:
      "Organize study notes by category and tags. Search, pin favorites, color-code notes, and switch between list and grid views. Perfect note management.",
    type: "website",
    url: "https://www.koovlo.com/tools/education/notes-organizer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Notes Organizer - Organize Study Notes & Manage Documents",
    description:
      "Organize study notes by category and tags. Search, pin favorites, color-code notes, and switch between list and grid views. Perfect note management.",
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
    canonical: "https://www.koovlo.com/tools/education/notes-organizer",
  },
};

export default function NotesOrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
