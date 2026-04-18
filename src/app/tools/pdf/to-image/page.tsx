"use client";

import dynamic from "next/dynamic";
import FaqSchema from "@/components/FaqSchema";
import RichSeoContent from "@/components/RichSeoContent";
import { getRelatedTools } from "@/lib/siteData";
import styles from "./toimage.module.css";

const PdfToImageConverter = dynamic(() => import("@/components/PdfToImageConverter"), {
  ssr: false,
  loading: () => (
    <div className={styles.loading}>
      <p>Loading PDF engine...</p>
    </div>
  ),
});

const faqItems = [
  {
    question: "How do I convert a PDF to JPG or PNG?",
    answer:
      "Upload or select your PDF, choose the image format you want, and download the generated image files once conversion finishes.",
  },
  {
    question: "Will PDF to image conversion reduce quality?",
    answer:
      "Quality depends on the export settings and the original PDF. Higher-quality output usually creates larger image files.",
  },
  {
    question: "When should I use PNG instead of JPG?",
    answer:
      "PNG is usually better for sharp text, diagrams, and transparent elements, while JPG is often better for smaller file sizes and photo-heavy pages.",
  },
  {
    question: "Can I convert multi-page PDFs?",
    answer:
      "Yes. Multi-page PDFs are supported and each page can be exported as an image.",
  },
  {
    question: "Is this useful for presentations and websites?",
    answer:
      "Yes. PDF to image conversion is common when you need slide previews, image thumbnails, social snippets, or web-ready page snapshots.",
  },
  {
    question: "Does Koovlo store my converted files?",
    answer:
      "The workflow is designed around browser-side processing wherever possible, which helps keep conversions fast and privacy-aware.",
  },
];

const relatedTools = getRelatedTools("/tools/pdf/to-image");

export default function PdfToImagePage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>\uD83D\uDCF8</span>
        <span className={styles.textGradient}>PDF to Image Converter</span>
      </h1>
      <p className={styles.description}>
        Convert PDF pages into high-quality PNG or JPG images for websites, presentations, previews, and easy sharing.
      </p>

      <PdfToImageConverter />

      <RichSeoContent
        introTitle="When a PDF to image converter is actually useful"
        introText={[
          "People rarely search PDF to image just to get a file conversion. They often need page previews for a website, static slides for a presentation, images for social sharing, or quick extracts from a brochure, report, or portfolio. That is why a strong PDF to image page should explain use cases, output formats, and quality tradeoffs instead of showing only a button.",
          "This page now does more of that work. It helps users understand when JPG is the better option for lighter files, when PNG is worth the larger size for sharper text, and why browser-based conversion can be a useful privacy and speed angle. Those details also give search engines more evidence that the page is genuinely helpful.",
        ]}
        steps={[
          "Choose the PDF file you want to convert into images.",
          "Select the image format and quality level that fits your use case.",
          "Start the conversion and wait for each page to be rendered.",
          "Download the exported images and use related tools if you need additional compression or edits.",
        ]}
        benefits={[
          "Useful for screenshots, previews, slide decks, and image-based sharing workflows.",
          "Lets users choose between lighter JPG files and sharper PNG output.",
          "Works well with related PDF and image tools such as compression and image conversion.",
          "Adds practical guidance that broad competitor pages often hide behind generic marketing copy.",
        ]}
        faqItems={faqItems}
        relatedTools={relatedTools}
      />

      <FaqSchema items={faqItems} />
    </main>
  );
}
