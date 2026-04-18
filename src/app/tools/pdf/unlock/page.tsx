"use client";

import dynamic from "next/dynamic";
import FaqSchema from "@/components/FaqSchema";
import RichSeoContent from "@/components/RichSeoContent";
import { getRelatedTools } from "@/lib/siteData";
import styles from "./unlock.module.css";

// Disable SSR (fixes DOMMatrix, window, canvas)
const PdfUnlocker = dynamic(() => import("@/components/PdfUnlocker"), {
  ssr: false,
  loading: () => (
    <div className={styles.container}>
      <div className={styles.box}>
        <p>Loading PDF engine...</p>
      </div>
    </div>
  ),
});

const faqItems = [
  {
    question: "How do I unlock a PDF?",
    answer:
      "Upload your PDF file to the tool. If the PDF has user password protection that prevents editing, the tool will remove those restrictions, allowing you to edit the content.",
  },
  {
    question: "Will this work on owner password-protected PDFs?",
    answer:
      "This tool is designed to remove user password restrictions (which prevent editing/printing). Owner passwords (which restrict copying) require different approaches and may not be fully removable by browser-side tools.",
  },
  {
    question: "Is unlocking a PDF legal?",
    answer:
      "Unlocking PDFs that you own or have permission to edit is generally legal. Always respect copyright and intellectual property rights. Only unlock documents you're authorized to modify.",
  },
  {
    question: "Will unlocking affect the PDF content?",
    answer:
      "No. Unlocking only removes permission restrictions—it doesn't change the document content, formatting, or appearance. The PDF remains exactly the same otherwise.",
  },
  {
    question: "Why would I need to unlock a PDF?",
    answer:
      "PDFs are often locked to prevent editing or printing. Unlocking allows you to edit content, add annotations, extract text, or modify documents you need to work with.",
  },
  {
    question: "Is my PDF safe when unlocking?",
    answer:
      "Yes. All processing happens in your browser locally. Your files are never uploaded or stored on our servers, keeping your documents completely private.",
  },
];

const relatedTools = getRelatedTools("/tools/pdf/unlock");

export default function PdfUnlockPage() {
  return (
    <>
      <PdfUnlocker />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" }}>
        <RichSeoContent
          introTitle="When PDF unlocking is necessary"
          introText={[
            "PDFs are sometimes locked to prevent editing, printing, or copying. While these restrictions can protect content, they also prevent you from editing documents you own or have permission to work with. Unlocking removes user-level restrictions while respecting the document's original content.",
            "This page explains why browser-side PDF unlocking matters, what it does, and when it's appropriate. It also helps search engines understand that this page supports legitimate document access workflows.",
          ]}
          steps={[
            "Upload your password-restricted PDF to the tool.",
            "The tool will attempt to remove user-level password protection.",
            "If successful, download the unlocked PDF immediately.",
            "Open the unlocked PDF in your editor and make your changes.",
          ]}
          benefits={[
            "Removes user-level password restrictions to enable editing and printing.",
            "Allows legitimate editing of PDFs you own or have permission to modify.",
            "Preserves all original content—only removes restrictions.",
            "Works offline with browser-side processing for complete privacy.",
            "Quick process—unlocking happens instantly.",
          ]}
          faqItems={faqItems}
          relatedTools={relatedTools}
        />

        <FaqSchema items={faqItems} />
      </div>
    </>
  );
}
