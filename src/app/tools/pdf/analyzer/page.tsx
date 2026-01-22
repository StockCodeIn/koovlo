"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import styles from "./analyzer.module.css";

export default function PdfAnalyzerPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState<string | null>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        if (f.type !== "application/pdf") {
            alert("Please upload a valid PDF file.");
            return;
        }
        setFile(f);
        setInfo(null);
    };

    const analyzePdf = async () => {
        if (!file) return alert("Please upload a PDF first.");
        setLoading(true);
        setInfo("Analyzing your PDF...");

        try {
            const bytes = await file.arrayBuffer();

            // Try to load PDF
            let pdfDoc;
            try {
                pdfDoc = await PDFDocument.load(bytes);
            } catch (err) {
                const errMsg = String(err);
                if (errMsg.includes("encrypted")) {
                    setInfo("🔒 This PDF is encrypted and requires a password to open.");
                } else {
                    setInfo("❌ Unable to read PDF. It may be corrupted or fully secured.");
                }
                setLoading(false);
                return;
            }

            // Extract metadata
            const title = pdfDoc.getTitle() || "Untitled Document";
            const author = pdfDoc.getAuthor() || "Unknown Author";
            const subject = pdfDoc.getSubject() || "No subject";
            const pageCount = pdfDoc.getPageCount();

            // pdf-lib doesn’t expose permission flags — only metadata
            const analysisText = `
📄 Title: ${title}
✍️ Author: ${author}
📚 Subject: ${subject}
📑 Pages: ${pageCount}
🟢 This PDF is accessible and not fully encrypted.
      `;

            setInfo(analysisText);
        } catch (err) {
            console.error(err);
            setInfo("❌ Error analyzing PDF. Please try another file.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={styles.container}>
            <section className={styles.box}>
                <h1 className={styles.pageTitle}>
                    <span className={styles.icon}>🧠</span>
                    <span className={styles.textGradient}>PDF Analyzer (Pro)</span>
                </h1>
                <p>Detect encryption, metadata, and page info — fully offline.</p>

                <div className={styles.fileInput}>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFile}
                        disabled={loading}
                        style={{ display: "none" }}
                        id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload" className={styles.uploadLabel}>
                        {file ? file.name : "Click to Choose PDF File"}
                    </label>
                </div>

                <button
                    onClick={analyzePdf}
                    disabled={loading || !file}
                    className={styles.button}
                >
                    {loading ? "Analyzing..." : "Analyze PDF"}
                </button>

                {info && <pre className={styles.infoBox}>{info}</pre>}
            </section>
        </main>
    );
}
