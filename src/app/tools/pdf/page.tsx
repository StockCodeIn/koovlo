// src/app/tools/pdf/page.tsx
import ToolCard from "@/components/ToolCard";
import styles from "../tools-common.module.css";

export const metadata = {
  title: "PDF Tools – Koovlo",
  description:
    "Fast, free and secure online PDF tools. Merge, compress, split and manage your PDFs with Koovlo.",
};

export default function PdfToolsPage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>📄</span>
        <span className={styles.textGradient}>PDF Tools</span>
      </h1>
      <p className={styles.subText}>
        Fast, free and privacy-friendly tools to merge, compress, and manage PDFs.
      </p>

      <div className={styles.grid}>
        <ToolCard title="PDF Merge" desc="Combine multiple PDF files into one document" link="/tools/pdf/merge" icon="📎" />
        <ToolCard title="Extract PDF Pages" desc="Create a new PDF using selected pages only" link="/tools/pdf/extract-pages" icon="✂️" />
        <ToolCard title="Split PDF by Page Range" desc="Split PDF into multiple files by page ranges" link="/tools/pdf/page-range-split" icon="📄" />
        <ToolCard title="Reorder PDF Pages" desc="Reorder or delete PDF pages visually" link="/tools/pdf/reorder" icon="↕️" />
        <ToolCard title="Rotate PDF Pages" desc="Rotate specific or all pages in a PDF" link="/tools/pdf/rotate" icon="🔄" />
        <ToolCard title="Duplicate PDF Pages" desc="Copy selected pages within a PDF file" link="/tools/pdf/duplicate-pages" icon="📋" />
        <ToolCard title="PDF to Images" desc="Convert PDF pages into high-quality images" link="/tools/pdf/to-image" icon="🖼️" />
        <ToolCard title="Images to PDF" desc="Convert JPG, PNG images into a PDF file" link="/tools/pdf/to-pdf" icon="📄" />
        <ToolCard title="Change PDF Page Size" desc="Resize PDF pages to A4, Letter, or custom size" link="/tools/pdf/change-page-size" icon="📏" />
        <ToolCard title="Crop PDF Pages" desc="Crop margins and unwanted areas from PDF pages" link="/tools/pdf/crop" icon="✂️" />
        <ToolCard title="Add Page Numbers to PDF" desc="Insert custom page numbers into your PDF" link="/tools/pdf/page-number" icon="🔢" />
        <ToolCard title="Compress PDF" desc="Reduce PDF file size without losing quality" link="/tools/pdf/compress" icon="🗜️" />
        <ToolCard title="PDF Metadata Editor" desc="Add or remove metadata from PDF files" link="/tools/pdf/metadata" icon="🧾" />
        <ToolCard title="Add PDF Watermark" desc="Add text or image watermark to PDF files" link="/tools/pdf/watermark" icon="💧" />
        <ToolCard title="Convert PDF to Grayscale" desc="Turn colorful PDFs into black-and-white files" link="/tools/pdf/grayscale" icon="🖤" />
        <ToolCard title="PDF to Word Converter" desc="Convert PDF documents into editable Word files" link="/tools/pdf/to-word" icon="📝" />
        <ToolCard title="Remove PDF Password" desc="Unlock password-protected PDF files" link="/tools/pdf/unlock" icon="🔓" />
        <ToolCard title="Sign PDF" desc="Add a digital signature to your PDF" link="/tools/pdf/sign" icon="✍️" />
      </div>
    </main>
  );
}
