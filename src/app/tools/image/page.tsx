// src/app/tools/image/page.tsx
import ToolCard from "@/components/ToolCard";
import styles from "../tools-common.module.css";


export const metadata = {
  title: "Image Tools – Koovlo",
  description:
    "Free online image tools to compress, resize, convert and edit images quickly and safely.",
};

export default function ImageToolsPage() {
  return (

    <main className={styles.container}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>🖼️</span>
        <span className={styles.textGradient}>Image Tools</span>
      </h1>
      <p className={styles.subText}>
        Simple, powerful and secure image utilities that run directly in your browser.
      </p>

      <div className={styles.grid}>
        <ToolCard title="Image Resize" desc="Resize multiple images with presets, percentage, or exact dimensions." link="/tools/image/resize" icon="📏" />
        <ToolCard title="Image Compress" desc="Compress multiple images at once. Fast, private, and free." link="/tools/image/compress" icon="🗜️" />
        <ToolCard title="Image Convert" desc="Convert multiple images between formats. Fast, private, and free." link="/tools/image/convert" icon="🔄" />
        <ToolCard title="Add Image Watermark" desc="Add text or logo watermark to images" link="/tools/image/add-watermark" icon="💧" />
        <ToolCard title="Strip Metadata" desc="Remove EXIF metadata from images" link="/tools/image/strip-metadata" icon="🗑️" />

      </div>
    </main>
  );
}
