import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Flashcard Maker - Create & Study Digital Flashcards Online",
  description:
    "Create, organize, and study flashcards with spaced repetition. Categorize by subject, track progress, and use timed study sessions. Perfect for exam prep.",
  keywords: [
    "flashcard maker",
    "create flashcards",
    "study flashcards",
    "flashcard app",
    "free flashcard tool",
    "spaced repetition",
    "digital flashcards",
    "flashcard organizer",
  ],
  openGraph: {
    title: "Free Flashcard Maker - Create & Study Digital Flashcards Online",
    description:
      "Create, organize, and study flashcards with spaced repetition. Categorize by subject, track progress, and use timed study sessions. Perfect for exam prep.",
    type: "website",
    url: "https://koovlo.com/tools/education/flashcard",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Flashcard Maker - Create & Study Digital Flashcards Online",
    description:
      "Create, organize, and study flashcards with spaced repetition. Categorize by subject, track progress, and use timed study sessions. Perfect for exam prep.",
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
    canonical: "https://koovlo.com/tools/education/flashcard",
  },
};

export default function FlashcardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
