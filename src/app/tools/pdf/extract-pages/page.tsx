// src/app/tools/pdf/extract-pages/page.tsx
"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import styles from "./split.module.css";
import ToolInfo from "@/components/ToolInfo";

export default function PdfExtractPagesPage() {
    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [dragOver, setDragOver] = useState(false);
    const [progress, setProgress] = useState(0);
    const [totalPages, setTotalPages] = useState<number | null>(null);

    const handleFile = useCallback((selectedFile: File) => {
        if (selectedFile.type !== "application/pdf") {
            setMessage("Please upload a valid PDF file.");
            return;
        }
        setFile(selectedFile);
        setMessage("");
        // Get total pages
        selectedFile.arrayBuffer().then(bytes => {
            PDFDocument.load(bytes).then(pdf => {
                setTotalPages(pdf.getPageCount());
            });
        });
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) handleFile(f);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) handleFile(droppedFile);
    }, [handleFile]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setDragOver(false);
    }, []);

    const parsePageInput = (input: string): number[] => {
        if (!input.trim()) return [];
        
        const ranges = input.split(',').map(r => r.trim());
        const pages: number[] = [];
        
        for (const range of ranges) {
            if (range.includes('-')) {
                const [start, end] = range.split('-').map(n => parseInt(n.trim()));
                if (start && end && start <= end) {
                    for (let i = start; i <= end; i++) {
                        if (!pages.includes(i)) pages.push(i);
                    }
                }
            } else {
                const page = parseInt(range);
                if (page && !pages.includes(page)) pages.push(page);
            }
        }
        
        return pages.sort((a, b) => a - b);
    };

    const getPreviewPages = () => {
        return parsePageInput(pages).slice(0, 10);
    };

    const handleSplit = async () => {
        if (!file) return setMessage("Please upload a PDF first.");
        if (!pages.trim()) return setMessage("Enter page numbers to extract (e.g. 1-3,5)");

        const pageNumbers = parsePageInput(pages);
        if (pageNumbers.length === 0) return setMessage("No valid pages specified.");

        setLoading(true);
        setMessage("Extracting your PDF...");
        setProgress(0);

        try {
            const bytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(bytes);
            const totalPages = pdfDoc.getPageCount();

            // Validate pages
            const validPages = pageNumbers.filter(p => p >= 1 && p <= totalPages).map(p => p - 1);
            if (validPages.length === 0) {
                setMessage("No valid pages found in the document.");
                setLoading(false);
                return;
            }

            setProgress(50);

            const newPdf = await PDFDocument.create();
            const copied = await newPdf.copyPages(pdfDoc, validPages);
            copied.forEach((p) => newPdf.addPage(p));

            setProgress(80);

            const splitBytes = await newPdf.save();
            const blob = new Blob([splitBytes as unknown as BlobPart], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `extracted-pages-${validPages.length}.pdf`;
            a.click();

            setProgress(100);
            setMessage("✅ PDF Extracted successfully!");
        } catch (err) {
            console.error(err);
            setMessage("❌ Error Extracting PDF. Please try again.");
        } finally {
            setLoading(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    const clearFile = () => {
        setFile(null);
        setPages("");
        setMessage("");
        setTotalPages(null);
    };

    return (
        <main className={styles.container}>
            <section className={styles.box}>
                <h1 className={styles.pageTitle}>
                    <span className={styles.icon}>✂️</span>
                    <span className={styles.textGradient}>Extract Pages from PDF</span>
                </h1>
                <p>
                    Create a new PDF with selected pages. Fully offline & secure.
                </p>

                <div 
                    className={`${styles.dropZone} ${dragOver ? styles.dragOver : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <label className={styles.fileInput}>
                        <input type="file" accept="application/pdf" onChange={handleFileInput} disabled={loading} />
                        <span>{file ? file.name : "📂 Choose PDF File"}</span>
                    </label>
                    <p className={styles.dropText}>or drag and drop your PDF here</p>
                    {file && (
                        <div className={styles.fileInfo}>
                            <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            {totalPages && <p><strong>Total Pages:</strong> {totalPages}</p>}
                            <button onClick={clearFile} className={styles.clearBtn}>Change File</button>
                        </div>
                    )}
                </div>

                {file && (
                    <div className={styles.inputGroup}>
                        <label>Page Range:</label>
                        <input
                            type="text"
                            placeholder="e.g. 1-3, 5, 8-10"
                            value={pages}
                            onChange={(e) => setPages(e.target.value)}
                            disabled={loading}
                        />
                        <div className={styles.inputHelp}>
                            <p><strong>Examples:</strong></p>
                            <ul>
                                <li>Single page: <code>5</code></li>
                                <li>Multiple pages: <code>1,3,5</code></li>
                                <li>Page range: <code>5-10</code></li>
                                <li>Mixed: <code>1,3,5-7,10</code></li>
                            </ul>
                        </div>
                    </div>
                )}

                {pages && getPreviewPages().length > 0 && (
                    <div className={styles.preview}>
                        <h3>Pages to Extract:</h3>
                        <div className={styles.pageNumbers}>
                            {getPreviewPages().map((page, index) => (
                                <span key={index} className={styles.pageNumber}>{page}</span>
                            ))}
                            {parsePageInput(pages).length > 10 && <span className={styles.morePages}>...</span>}
                        </div>
                    </div>
                )}

                {loading && (
                    <div className={styles.progressContainer}>
                        <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
                        </div>
                        <p>{progress}% complete</p>
                    </div>
                )}

                <button onClick={handleSplit} disabled={loading || !file || !pages.trim()} className={styles.button}>
                    {loading ? "Extracting..." : "Extract Pages"}
                </button>

                {message && <p className={styles.message}>{message}</p>}
            </section>

            <ToolInfo
                howItWorks="1. Upload a PDF file.<br>2. Enter page numbers or ranges (e.g. 1-3,5).<br>3. Click 'Extract Pages' to create a new PDF with selected pages."
                faqs={[
                    { title: "How to specify pages?", content: "Use commas for individual pages (1,3,5) and dashes for ranges (1-5)." },
                    { title: "Is it secure?", content: "Yes, processing is done locally in your browser." },
                    { title: "What's the maximum pages?", content: "Depends on your PDF size, but typically up to 1000 pages." }
                ]}
                tips={["Page numbers start from 1. Invalid ranges are ignored.", "Extracted pages maintain original quality.", "Use for sharing specific information from large documents."]}
            />
        </main>
    );
}
