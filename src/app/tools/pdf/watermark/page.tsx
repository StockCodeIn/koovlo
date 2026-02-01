"use client";

import dynamic from "next/dynamic";
import styles from "./watermark.module.css";

const PdfWatermarkTool = dynamic(() => import("@/components/PdfWatermarkToolFixed"), {
  ssr: false,
  loading: () => <div className={styles.loader}>Loading PDF Engine...</div>,
});

export default function PdfWatermarkPage() {
  return (
    <main className={styles.container}>
      <PdfWatermarkTool />
    </main>
  );
}
