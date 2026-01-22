"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import styles from "./merge.module.css";
import ToolInfo from "@/components/ToolInfo";

export default function PdfMergePage() {
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selected = Array.from(e.target.files).filter(
            (file) => file.type === "application/pdf"
        );
        if (selected.length < e.target.files.length) {
            setMessage("⚠️ Some non-PDF files were ignored.");
        } else {
            setMessage("");
        }
        setFiles(selected);
    };

    const mergePDFs = async () => {
        if (files.length < 2) {
            setMessage("Please select at least 2 PDF files to merge.");
            return;
        }
        setLoading(true);
        setMessage("Merging your PDFs...");

        try {
            const mergedPdf = await PDFDocument.create();

            for (const file of files) {
                const bytes = await file.arrayBuffer();
                const pdf = await PDFDocument.load(bytes);
                const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                pages.forEach((page) => mergedPdf.addPage(page));
            }

            const mergedBytes = await mergedPdf.save();
            const blob = new Blob([mergedBytes as unknown as BlobPart], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "koovlo-merged.pdf";
            a.click();

            setMessage("✅ PDF merged successfully!");
        } catch (error) {
            console.error(error);
            setMessage("❌ Error merging PDFs. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={styles.container}>
            <section className={styles.box}>
                <h1 className={styles.pageTitle}>
                    <span className={styles.icon}>📎</span>
                    <span className={styles.textGradient}>Merge PDF</span>
                </h1>
                <p>
                    Combine multiple PDF documents into one. 100% private — files never
                    leave your device.
                </p>

                <label className={styles.fileInput}>
                    <input
                        type="file"
                        accept="application/pdf"
                        multiple
                        onChange={handleFiles}
                        disabled={loading}
                    />
                    <span>Select PDF Files</span>
                </label>

                {files.length > 0 && (
                    <div className={styles.fileList}>
                        <h3>Selected Files ({files.length})</h3>
                        <ul>
                            {files.map((f, i) => (
                                <li key={i}>{f.name}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <button
                    onClick={mergePDFs}
                    disabled={loading || files.length < 2}
                    className={styles.button}
                >
                    {loading ? "Merging..." : "Merge PDFs"}
                </button>

                {message && <p className={styles.message}>{message}</p>}
            </section>

            <ToolInfo
                howItWorks="1. Select multiple PDF files using the file picker.<br>2. Click 'Merge PDFs' to combine them.<br>3. Download the merged PDF."
                faqs={[
                    { title: "Is my data secure?", content: "Yes, all processing happens in your browser. Files are not uploaded to any server." },
                    { title: "What's the maximum file size?", content: "Depends on your browser, but typically up to 100MB total." }
                ]}
                tips={["For best results, ensure all PDFs have the same page size. Large files may take longer to process."]}
            />
        </main>
    );
}
