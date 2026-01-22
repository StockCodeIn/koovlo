"use client";

import dynamic from "next/dynamic";
import styles from "./grayscale.module.css";

// ✅ Dynamically import with SSR disabled (fixes DOMMatrix error)
const PdfGrayscaleClient = dynamic(() => import("@/components/PdfGrayscaleClient"), {
  ssr: false,
  loading: () => <p className={styles.message}>Loading PDF Engine...</p>,
});

export default function GrayscalePage() {
  return (
    <main className={styles.container}>
      <PdfGrayscaleClient />
    </main>
  );
}
