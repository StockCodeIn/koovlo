// src/app/tools/file/page.tsx
import ToolCard from "@/components/ToolCard";
import styles from "../tools-common.module.css";

export const metadata = {
    title: "File Tools – Koovlo",
    description:
        "Free online file tools including ZIP file creator, file size checker, bulk renamer, text to PDF converter, and PDF to text extractor.",

};

export default function FileToolsPage() {
    return (

        <main className={styles.container}>
            <h1 className={styles.pageTitle}>
                <span className={styles.icon}>📁</span>
                <span className={styles.textGradient}>File Tools</span>
            </h1>
            <p className={styles.subText}>
                Free online file tools including ZIP file creator, file size checker, bulk renamer, text to PDF converter, and PDF to text extractor. 100% private.
            </p>

            <div className={styles.grid}>
                          <ToolCard title="ZIP File Creator" desc="Create ZIP archives" link="/tools/file/zip-creator" icon="📦" />
                          <ToolCard title="File Size Checker" desc="Check file sizes" link="/tools/file/size-checker" icon="📏" />
                          <ToolCard title="File Name Bulk Renamer" desc="Rename multiple files" link="/tools/file/bulk-renamer" icon="✏️" />
                          <ToolCard title="Text to PDF" desc="Convert text to PDF" link="/tools/file/text-to-pdf" icon="📄" />
                          <ToolCard title="PDF to Text" desc="Extract text from PDF" link="/tools/file/pdf-to-text" icon="📝" />
            </div>
        </main>
    );
}
