"use client";

import dynamic from "next/dynamic";
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

export default function PdfUnlockPage() {
  return <PdfUnlocker />;
}
