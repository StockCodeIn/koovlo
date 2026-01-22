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
        <ToolCard title="PDF Merge" desc="Combine multiple PDFs into one file" link="/tools/pdf/merge" icon="📎" />
        <ToolCard title="PDF Split" desc="Split PDF into multiple files" link="/tools/pdf/split" icon="✂️" />
        <ToolCard title="Page Range Split" desc="Split PDF by page ranges" link="/tools/pdf/page-range-split" icon="📄" />
        <ToolCard title="Single Page Extract" desc="Extract single pages from PDF" link="/tools/pdf/single-page-extract" icon="📄" />
        <ToolCard title="Delete PDF Pages" desc="Remove specific pages from PDF" link="/tools/pdf/delete-pages" icon="🗑️" />
        <ToolCard title="Reorder PDF Pages" desc="Reorder PDF pages" link="/tools/pdf/reorder" icon="↕️" />
        <ToolCard title="Rotate PDF Pages" desc="Rotate PDF pages" link="/tools/pdf/rotate" icon="🔄" />
        <ToolCard title="Extract PDF Pages" desc="Extract pages from PDF" link="/tools/pdf/extract-pages" icon="📄" />
        <ToolCard title="Duplicate Pages" desc="Duplicate PDF pages" link="/tools/pdf/duplicate-pages" icon="📋" />
        <ToolCard title="Preview PDF Pages" desc="Preview PDF pages" link="/tools/pdf/preview" icon="👁️" />
        <ToolCard title="Count PDF Pages" desc="Count pages in PDF" link="/tools/pdf/count-pages" icon="🔢" />
        <ToolCard title="Get PDF Info" desc="Get PDF metadata and info" link="/tools/pdf/info" icon="ℹ️" />
        <ToolCard title="PDF to Images" desc="Convert PDF pages to images" link="/tools/pdf/to-image" icon="🖼️" />
        <ToolCard title="Images to PDF" desc="Convert images to PDF" link="/tools/pdf/to-pdf" icon="📄" />
        <ToolCard title="Change Page Size" desc="Change PDF page size" link="/tools/pdf/change-page-size" icon="📏" />
        <ToolCard title="Crop PDF Pages" desc="Crop PDF pages" link="/tools/pdf/crop" icon="✂️" />
        <ToolCard title="Add Text to PDF" desc="Add text to PDF" link="/tools/pdf/add-text" icon="📝" />
        <ToolCard title="Add Image to PDF" desc="Add image to PDF" link="/tools/pdf/add-image" icon="🖼️" />
        <ToolCard title="Add Page Numbers" desc="Add page numbers to PDF" link="/tools/pdf/page-number" icon="🔢" />
        <ToolCard title="Highlight Text" desc="Highlight text in PDF" link="/tools/pdf/highlight" icon="🖍️" />
        <ToolCard title="Underline Text" desc="Underline text in PDF" link="/tools/pdf/underline" icon="📏" />
        <ToolCard title="Strike Text" desc="Strike through text in PDF" link="/tools/pdf/strike" icon="📏" />
        <ToolCard title="Compress PDF" desc="Reduce PDF file size" link="/tools/pdf/compress" icon="🗜️" />
        <ToolCard title="Flatten PDF" desc="Flatten PDF forms" link="/tools/pdf/flatten" icon="📄" />
        <ToolCard title="Remove Metadata" desc="Remove PDF metadata" link="/tools/pdf/metadata" icon="🗑️" />
        <ToolCard title="PDF Analyzer" desc="Detect encryption, metadata, and page info" link="/tools/pdf/analyzer" icon="🧠" />
        <ToolCard title="Fill PDF Form" desc="Fill PDF forms" link="/tools/pdf/fill-form" icon="📝" />
        <ToolCard title="Flatten Filled Form" desc="Flatten filled PDF forms" link="/tools/pdf/flatten-form" icon="📄" />
        <ToolCard title="Watermark" desc="Add watermark to PDF" link="/tools/pdf/watermark" icon="💧" />
        <ToolCard title="Grayscale PDF" desc="Convert colorful PDFs to black-and-white" link="/tools/pdf/grayscale" icon="🖤" />
        <ToolCard title="PDF to Word" desc="Convert PDF to Word" link="/tools/pdf/to-word" icon="📝" />
        <ToolCard title="PDF to Excel" desc="Convert PDF to Excel" link="/tools/pdf/to-excel" icon="📊" />
        <ToolCard title="Remove PDF Password" desc="Remove PDF password" link="/tools/pdf/unlock" icon="🔓" />
        <ToolCard title="Digital Signature" desc="Add digital signature to PDF" link="/tools/pdf/sign" icon="✍️" />

      </div>
    </main>
  );
}
