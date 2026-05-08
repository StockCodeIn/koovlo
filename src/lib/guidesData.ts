export interface GuideRecord {
  slug: string;
  title: string;
  description: string;
  path: string;
  category: "pdf" | "education" | "image";
  relatedToolPaths: string[];
}

export const guides: GuideRecord[] = [
  {
    slug: "compress-pdf-for-email",
    title: "How to Compress a PDF for Email Without Ruining Readability",
    description:
      "Learn when to compress a PDF, which files compress best, and how to keep documents readable for email attachments.",
    path: "/guides/compress-pdf-for-email",
    category: "pdf",
    relatedToolPaths: ["/tools/pdf/compress", "/tools/pdf/merge", "/tools/pdf/to-image"],
  },
  {
    slug: "pdf-to-jpg-without-losing-quality",
    title: "How to Convert PDF to JPG Without Losing Too Much Quality",
    description:
      "A practical guide to turning PDF pages into images while balancing sharpness, speed, and file size.",
    path: "/guides/pdf-to-jpg-without-losing-quality",
    category: "pdf",
    relatedToolPaths: ["/tools/pdf/to-image", "/tools/image/compress", "/tools/image/resize"],
  },
  {
    slug: "gpa-vs-cgpa-calculator-guide",
    title: "GPA vs CGPA: What Is the Difference and How Do You Calculate Both?",
    description:
      "Clear explanations, formulas, and examples for students comparing GPA, CGPA, grades, and percentage conversions.",
    path: "/guides/gpa-vs-cgpa-calculator-guide",
    category: "education",
    relatedToolPaths: ["/tools/education/gpa", "/tools/education/cgpa", "/tools/education/percentage"],
  },
];

export function getGuideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}

