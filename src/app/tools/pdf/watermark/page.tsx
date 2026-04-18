"use client";

import dynamic from "next/dynamic";
import FaqSchema from "@/components/FaqSchema";
import RichSeoContent from "@/components/RichSeoContent";
import { getRelatedTools } from "@/lib/siteData";
import styles from "./watermark.module.css";

const PdfWatermarkTool = dynamic(() => import("@/components/PdfWatermarkToolFixed"), {
  ssr: false,
  loading: () => <div className={styles.loader}>Loading PDF Engine...</div>,
});

const faqItems = [
  {
    question: "How do I add a watermark to a PDF?",
    answer:
      "Upload your PDF, enter your watermark text, choose size and opacity settings, and click Apply. The watermark will be added to all pages of your PDF instantly.",
  },
  {
    question: "Can I use an image as a watermark?",
    answer:
      "This tool supports text-based watermarks. For image watermarks, you can use graphics design tools or convert your logo to text, then add it as a watermark.",
  },
  {
    question: "Can I watermark only specific pages?",
    answer:
      "This tool adds watermarks to all pages at once. If you need watermarks on specific pages only, extract those pages first, watermark them, and then merge them back.",
  },
  {
    question: "Will the watermark prevent PDF editing?",
    answer:
      "A watermark is a visual element layered on the PDF—it doesn't prevent editing or copying. For actual protection, use PDF encryption or password protection instead.",
  },
  {
    question: "Why add a watermark to a PDF?",
    answer:
      "Watermarks are useful for marking documents as drafts, confidential, copyrighted, or with your company branding. They serve as visual indicators without fully locking the PDF.",
  },
  {
    question: "Is my PDF safe when adding a watermark?",
    answer:
      "Yes. All watermarking happens in your browser locally. Your files are never uploaded to a server or stored on our systems.",
  },
];

const relatedTools = getRelatedTools("/tools/pdf/watermark");

export default function PdfWatermarkPage() {
  return (
    <main className={styles.container}>
      <PdfWatermarkTool />

      <RichSeoContent
        introTitle="When watermarking a PDF is useful"
        introText={[
          "PDF watermarks serve as visible identifiers without fully restricting the document. They're useful for marking documents as confidential, draft versions, copyrighted material, or branded with your company name or logo. Watermarks are less intrusive than full PDF encryption but more visible than hidden metadata.",
          "This page explains why browser-side watermarking matters, how to apply watermarks effectively, and what to expect from the process. It also helps search engines understand that this page supports practical PDF security and branding workflows.",
        ]}
        steps={[
          "Upload your PDF using the file picker or drag it into the drop zone.",
          "Enter your watermark text and configure the appearance (size, opacity, position).",
          "Click 'Apply Watermark' to add it to all pages of your PDF.",
          "Download the watermarked PDF immediately. The original remains unchanged.",
        ]}
        benefits={[
          "Adds visible text watermarks to mark PDFs as confidential, draft, or copyrighted.",
          "Customizable appearance—adjust size, opacity, and positioning to suit your needs.",
          "Applies to all pages automatically without requiring manual page-by-page editing.",
          "Works offline with browser-side processing, keeping your documents private.",
          "Useful for branding documents with company names, logos, or legal notices.",
        ]}
        faqItems={faqItems}
        relatedTools={relatedTools}
      />

      <FaqSchema items={faqItems} />
    </main>
  );
}
