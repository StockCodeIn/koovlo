"use client";

import dynamic from "next/dynamic";
import FaqSchema from "@/components/FaqSchema";
import RichSeoContent from "@/components/RichSeoContent";
import { getRelatedTools } from "@/lib/siteData";
import styles from "./toword.module.css";

const PdfToWordTool = dynamic(() => import("@/components/PdfToWordTool"), {
  ssr: false,
  loading: () => <div className={styles.loader}>Loading PDF Engine...</div>,
});

const faqItems = [
  {
    question: "How do I convert a PDF to Word?",
    answer:
      "Upload your PDF, select your conversion options if available, and click Convert. The tool will generate an editable Word document that you can download immediately.",
  },
  {
    question: "Will my PDF to Word conversion preserve formatting?",
    answer:
      "Most formatting is preserved including text, headings, and basic layout. Complex designs, certain fonts, or embedded images may appear slightly different in Word, but the content remains intact and editable.",
  },
  {
    question: "Can I convert PDF forms and tables to Word?",
    answer:
      "Yes. Tables and basic form structures are converted to editable Word tables. More complex forms may require manual adjustment in Word after conversion.",
  },
  {
    question: "What if my PDF is scanned or image-based?",
    answer:
      "Image-based PDFs (from scans) cannot be directly converted to editable Word text without OCR. This tool works best with native PDFs that contain actual text data.",
  },
  {
    question: "Why convert PDF to Word instead of PDF to text?",
    answer:
      "Word documents preserve more formatting, support better organization with styles, and allow you to edit structure and layouts more easily than plain text files.",
  },
  {
    question: "Is my PDF safe during conversion?",
    answer:
      "Yes. All conversion happens in your browser using local processing. We don't upload or store your files on any server.",
  },
];

const relatedTools = getRelatedTools("/tools/pdf/to-word");

export default function PdfToWordPage() {
  return (
    <main className={styles.container}>
      <PdfToWordTool />

      <RichSeoContent
        introTitle="When converting PDF to Word makes sense"
        introText={[
          "Converting a PDF to Word is useful when you need to edit content that was locked in a PDF format, repurpose text and layouts from existing documents, collaborate with others who prefer Word files, or preserve formatting that plain text conversions would lose.",
          "This page explains what to expect from PDF to Word conversion, when it works well, and why browser-side conversion is both faster and more private than uploading to external services.",
        ]}
        steps={[
          "Upload your PDF using the file picker or drag it into the drop zone.",
          "Review any conversion options available (some PDFs offer layout or formatting choices).",
          "Click 'Convert to Word' to process your PDF into an editable document.",
          "Download the Word file and open it in Microsoft Word, Google Docs, or any compatible editor.",
        ]}
        benefits={[
          "Converts PDF content into fully editable Word documents with preserved formatting.",
          "Useful for repurposing reports, proposals, and other documents that need modification.",
          "Supports tables, images, and complex layouts better than text-only conversions.",
          "Works offline with browser-side processing, keeping your data secure and private.",
          "Faster than manual retyping and more flexible than staying locked in PDF format.",
        ]}
        faqItems={faqItems}
        relatedTools={relatedTools}
      />

      <FaqSchema items={faqItems} />
    </main>
  );
}
