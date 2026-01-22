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
        <ToolCard title="Image Resize" desc="Resize images to custom dimensions" link="/tools/image/resize" icon="📏" />
        <ToolCard title="Image Compress" desc="Reduce image size without quality loss" link="/tools/image/compress" icon="📉" />
        <ToolCard title="Image Crop" desc="Crop images to desired size" link="/tools/image/crop" icon="✂️" />
        <ToolCard title="Image Rotate" desc="Rotate images" link="/tools/image/rotate" icon="🔄" />
        <ToolCard title="Image Flip" desc="Flip images horizontally or vertically" link="/tools/image/flip" icon="🔄" />
        <ToolCard title="Image Convert" desc="Convert between JPG, PNG, WebP" link="/tools/image/convert" icon="🔄" />
        <ToolCard title="Change Image Quality" desc="Change image quality" link="/tools/image/quality" icon="⚙️" />
        <ToolCard title="Reduce Image Size" desc="Reduce image size (KB target)" link="/tools/image/reduce-size" icon="📉" />
        <ToolCard title="Convert to WebP" desc="Convert images to WebP format" link="/tools/image/webp" icon="⚡" />
        <ToolCard title="Progressive JPEG" desc="Convert to progressive JPEG" link="/tools/image/progressive-jpeg" icon="📷" />
        <ToolCard title="Strip Metadata" desc="Remove EXIF metadata" link="/tools/image/strip-metadata" icon="🗑️" />
        <ToolCard title="Image Blur" desc="Blur images" link="/tools/image/blur" icon="🌫️" />
        <ToolCard title="Image Grayscale" desc="Convert to grayscale" link="/tools/image/grayscale" icon="⚫" />
        <ToolCard title="Brightness / Contrast" desc="Adjust brightness and contrast" link="/tools/image/brightness" icon="☀️" />
        <ToolCard title="Saturation Adjust" desc="Adjust color saturation" link="/tools/image/saturation" icon="🌈" />
        <ToolCard title="Sepia Filter" desc="Apply sepia filter" link="/tools/image/sepia" icon="📜" />
        <ToolCard title="Invert Colors" desc="Invert image colors" link="/tools/image/invert" icon="🔄" />
        <ToolCard title="Add Text to Image" desc="Add text overlays to images" link="/tools/image/add-text" icon="📝" />
        <ToolCard title="Add Image Watermark" desc="Add watermark to images" link="/tools/image/add-watermark" icon="💧" />
        <ToolCard title="Draw / Annotate" desc="Draw and annotate on images" link="/tools/image/annotate" icon="✏️" />
        <ToolCard title="Add Shapes" desc="Add shapes to images" link="/tools/image/add-shapes" icon="🔲" />
        <ToolCard title="Add Border / Padding" desc="Add borders to images" link="/tools/image/border" icon="🔲" />
        <ToolCard title="Image to Base64" desc="Convert image to Base64" link="/tools/image/to-base64" icon="🔢" />
        <ToolCard title="Base64 to Image" desc="Convert Base64 to image" link="/tools/image/from-base64" icon="🖼️" />
        <ToolCard title="Image Dimensions Checker" desc="Check image dimensions" link="/tools/image/dimensions" icon="📐" />
        <ToolCard title="Image DPI Checker" desc="Check image DPI" link="/tools/image/dpi-checker" icon="📏" />
        <ToolCard title="Image Size Calculator" desc="Calculate image size" link="/tools/image/size-calculator" icon="📊" />
        <ToolCard title="Bulk Resize Images" desc="Resize multiple images" link="/tools/image/bulk-resize" icon="📏" />
        <ToolCard title="Bulk Convert Images" desc="Convert multiple images" link="/tools/image/bulk-convert" icon="🔄" />
        <ToolCard title="Bulk Compress Images" desc="Compress multiple images" link="/tools/image/bulk-compress" icon="📉" />
        <ToolCard title="Background Remover" desc="Remove image backgrounds" link="/tools/image/bg-remove" icon="🪄" />
      </div>
    </main>
  );
}
