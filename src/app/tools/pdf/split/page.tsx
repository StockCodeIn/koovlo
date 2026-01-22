"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import styles from "./split.module.css";
import ToolInfo from "@/components/ToolInfo";

export default function PdfSplitPage() {
    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        if (f.type !== "application/pdf") {
            alert("Please upload a valid PDF file.");
            return;
        }
        setFile(f);
        setMessage("");
    };

    const handleSplit = async () => {
        if (!file) return setMessage("Please upload a PDF first.");
        if (!pages.trim()) return setMessage("Enter page numbers to extract (e.g. 1-3,5)");

        setLoading(true);
        setMessage("Splitting your PDF...");

        try {
            const bytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(bytes);
            const totalPages = pdfDoc.getPageCount();

            // Parse input like "1-3,5,8"
            const pageRanges = pages
                .split(",")
                .flatMap((range) => {
                    const [start, end] = range.split("-").map((n) => parseInt(n.trim(), 10));
                    if (!end) return [start - 1];
                    const validStart = Math.max(1, start);
                    const validEnd = Math.min(totalPages, end);
                    return Array.from({ length: validEnd - validStart + 1 }, (_, i) => validStart + i - 1);
                })
                .filter((n) => !isNaN(n) && n >= 0 && n < totalPages);

            if (pageRanges.length === 0) {
                setMessage("Invalid page range. Please check your input.");
                setLoading(false);
                return;
            }

            const newPdf = await PDFDocument.create();
            const copied = await newPdf.copyPages(pdfDoc, pageRanges);
            copied.forEach((p) => newPdf.addPage(p));

            const splitBytes = await newPdf.save();
            const blob = new Blob([splitBytes as unknown as BlobPart], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "koovlo-split.pdf";
            a.click();

            setMessage("✅ PDF split successfully!");
        } catch (err) {
            console.error(err);
            setMessage("❌ Error splitting PDF. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={styles.container}>
            <section className={styles.box}>
                <h1 className={styles.pageTitle}>
                    <span className={styles.icon}>✂️</span>
                    <span className={styles.textGradient}>Split PDF</span>
                </h1>
                <p>
                    Extract specific pages or page ranges from your PDF. Works completely
                    offline — your files stay private.
                </p>

                <label className={styles.fileInput}>
                    <input type="file" accept="application/pdf" onChange={handleFile} disabled={loading} />
                    <span>{file ? file.name : "Choose PDF File"}</span>
                </label>

                {file && (
                    <div className={styles.inputGroup}>
                        <label>Page Range:</label>
                        <input
                            type="text"
                            placeholder="e.g. 1-3, 5, 8"
                            value={pages}
                            onChange={(e) => setPages(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                )}

                <button onClick={handleSplit} disabled={loading || !file} className={styles.button}>
                    {loading ? "Splitting..." : "Split PDF"}
                </button>

                {message && <p className={styles.message}>{message}</p>}
            </section>

            <ToolInfo
                howItWorks="1. Upload a PDF file.<br>2. Enter page numbers or ranges (e.g. 1-3,5).<br>3. Click 'Split PDF' to extract the specified pages."
                faqs={[
                    { title: "How to specify pages?", content: "Use commas for individual pages (1,3,5) and dashes for ranges (1-5)." },
                    { title: "Is it secure?", content: "Yes, processing is done locally in your browser." }
                ]}
                tips={["Page numbers start from 1. Invalid ranges are ignored."]}
            />
        </main>
    );
}
