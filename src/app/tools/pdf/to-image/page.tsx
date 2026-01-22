// app/tools/pdf/to-image/page.tsx
"use client";

import dynamic from "next/dynamic";
import styles from "./toimage.module.css";

// ✅ Sabse important: ssr: false se DOMMatrix error solve hoga
const PdfConverter = dynamic(() => import("@/components/PdfConverter"), {
  ssr: false,
  loading: () => (
    <div className={styles.box}>
      <p>Loading PDF Engine...</p>
    </div>
  ),
});

export default function PdfToImagePage() {
  return (
    <main className={styles.container}>
      <PdfConverter />
    </main>
  );
}