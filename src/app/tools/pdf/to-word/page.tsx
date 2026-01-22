"use client";

import dynamic from "next/dynamic";
import styles from "./toword.module.css";

const PdfToWordTool = dynamic(() => import("@/components/PdfToWordTool"), {
  ssr: false,
  loading: () => <div className={styles.loader}>Loading PDF Engine...</div>,
});

export default function PdfToWordPage() {
  return (
    <main className={styles.container}>
      <PdfToWordTool />
    </main>
  );
}
