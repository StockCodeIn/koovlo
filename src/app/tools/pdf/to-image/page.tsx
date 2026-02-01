// app/tools/pdf/to-image/page.tsx
"use client";

import dynamic from "next/dynamic";
import styles from "./toimage.module.css";

// ✅ Dynamic import to fix DOMMatrix error
const PdfToImageConverter = dynamic(() => import("@/components/PdfToImageConverter"), {
  ssr: false,
  loading: () => (
    <div className={styles.loading}>
      <p>Loading PDF Engine...</p>
    </div>
  ),
});

export default function PdfToImagePage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>📸</span>
        <span className={styles.textGradient}>PDF to Image Converter</span>
      </h1>
      <p className={styles.description}>
        Convert your PDF into high-quality images — choose the right balance between clarity and file size.
      </p>

      <PdfToImageConverter />
    </main>
  );
}