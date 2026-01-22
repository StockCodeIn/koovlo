"use client";

import dynamic from "next/dynamic";
import styles from "./reorder.module.css";

const PdfReorderTool = dynamic(() => import("@/components/PdfReorderTool"), {
  ssr: false,
  loading: () => <div className={styles.loader}>Loading PDF Engine...</div>,
});

export default function PdfReorderPage() {
  return (
    <main className={styles.container}>
      <PdfReorderTool />
    </main>
  );
}
