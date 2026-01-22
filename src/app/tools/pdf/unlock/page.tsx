"use client";

import dynamic from "next/dynamic";
import styles from "./unlock.module.css";

// Disable SSR (fixes DOMMatrix, window, canvas)
const PdfUnlocker = dynamic(() => import("@/components/PdfUnlocker"), {
  ssr: false,
  loading: () => (
    <div className={styles.box}>
      <p>Loading PDF engine...</p>
    </div>
  ),
});

export default function PdfUnlockPage() {
  return (
    <main className={styles.container}>
      <PdfUnlocker />
    </main>
  );
}
