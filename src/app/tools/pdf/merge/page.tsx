"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import FaqSchema from "@/components/FaqSchema";
import RichSeoContent from "@/components/RichSeoContent";
import { getRelatedTools } from "@/lib/siteData";
import styles from "./merge.module.css";

export default function PdfMergePage() {
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [progress, setProgress] = useState(0);
    const [dragOver, setDragOver] = useState(false);

    const handleFiles = useCallback((selectedFiles: File[]) => {
        const pdfFiles = selectedFiles.filter(
            (file) => file.type === "application/pdf"
        );
        if (pdfFiles.length < selectedFiles.length) {
            setMessage("⚠️ Some non-PDF files were ignored.");
        } else {
            setMessage("");
        }
        setFiles(prev => [...prev, ...pdfFiles]);
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(Array.from(e.target.files));
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFiles(droppedFiles);
    }, [handleFiles]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setDragOver(false);
    }, []);

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const moveFile = (fromIndex: number, toIndex: number) => {
        setFiles(prev => {
            const newFiles = [...prev];
            const [moved] = newFiles.splice(fromIndex, 1);
            newFiles.splice(toIndex, 0, moved);
            return newFiles;
        });
    };

    const clearAll = () => {
        setFiles([]);
        setMessage("");
    };

    const mergePDFs = async () => {
        if (files.length < 2) {
            setMessage("Please select at least 2 PDF files to merge.");
            return;
        }
        setLoading(true);
        setMessage("Merging your PDFs...");
        setProgress(0);

        try {
            const mergedPdf = await PDFDocument.create();
            const totalFiles = files.length;

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const bytes = await file.arrayBuffer();
                const pdf = await PDFDocument.load(bytes);
                const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                pages.forEach((page) => mergedPdf.addPage(page));
                
                setProgress(Math.round(((i + 1) / totalFiles) * 100));
            }

            const mergedBytes = await mergedPdf.save();
            const blob = new Blob([mergedBytes as unknown as BlobPart], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "koovlo-merged.pdf";
            a.click();

            setMessage("✅ PDF merged successfully!");
            setProgress(0);
        } catch (error) {
            console.error(error);
            setMessage("❌ Error merging PDFs. Please try again.");
            setProgress(0);
        } finally {
            setLoading(false);
        }
    };

    const faqItems = [
        {
            question: "Why would I merge PDF files?",
            answer: "Merging PDFs is useful when you have multiple documents to share as one file, create a complete report from separate chapters, combine scans into one document, or prepare files for printing or archiving.",
        },
        {
            question: "Can I reorder files before merging?",
            answer: "Yes. Use the up and down arrow buttons to change the order of files before starting the merge. Files are combined in the order shown.",
        },
        {
            question: "Is there a file size limit?",
            answer: "The limit depends on your browser and device memory, but most browsers can handle 100MB+ of files. Very large batches may be slower.",
        },
        {
            question: "Does the merge keep the original quality?",
            answer: "Yes. PDF merge is a lossless operation—pages are copied exactly as they are without re-compression or quality loss.",
        },
        {
            question: "Can I merge PDFs from different sources?",
            answer: "Yes. The tool works with any PDF files, even if they were created by different software or have different page sizes.",
        },
        {
            question: "Do you store my files after merging?",
            answer: "No. All merging happens in your browser, and no files are uploaded to any server.",
        },
    ];

    const relatedTools = getRelatedTools("/tools/pdf/merge");

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

                <div 
                    className={`${styles.dropZone} ${dragOver ? styles.dragOver : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <label className={styles.fileInput}>
                        <input
                            type="file"
                            accept="application/pdf"
                            multiple
                            onChange={handleFileInput}
                            disabled={loading}
                        />
                        <span>📂 Select PDF Files</span>
                    </label>
                    <p className={styles.dropText}>or drag and drop PDF files here</p>
                </div>

                {files.length > 0 && (
                    <div className={styles.fileList}>
                        <div className={styles.fileListHeader}>
                            <h3>Selected Files ({files.length})</h3>
                            <button onClick={clearAll} className={styles.clearBtn}>Clear All</button>
                        </div>
                        <ul className={styles.fileItems}>
                            {files.map((f, i) => (
                                <li key={i} className={styles.fileItem}>
                                    <div className={styles.fileInfo}>
                                        <span className={styles.fileName}>{f.name}</span>
                                        <span className={styles.fileSize}>({ (f.size / 1024 / 1024).toFixed(2) } MB)</span>
                                    </div>
                                    <div className={styles.fileActions}>
                                        <button 
                                            onClick={() => moveFile(i, Math.max(0, i - 1))} 
                                            disabled={i === 0}
                                            className={styles.moveBtn}
                                        >
                                            ↑
                                        </button>
                                        <button 
                                            onClick={() => moveFile(i, Math.min(files.length - 1, i + 1))} 
                                            disabled={i === files.length - 1}
                                            className={styles.moveBtn}
                                        >
                                            ↓
                                        </button>
                                        <button onClick={() => removeFile(i)} className={styles.removeBtn}>✕</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {loading && (
                    <div className={styles.progressContainer}>
                        <div className={styles.progressBar}>
                            <div 
                                className={styles.progressFill} 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p>{progress}% complete</p>
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

            <RichSeoContent
                introTitle="When PDF merging matters"
                introText={[
                    "People merge PDFs for many reasons: combining multiple scan pages into one document, consolidating chapters into a complete report, preparing files for submission or printing, or creating a master file from separate sources. The difference between a strong PDF merge tool and a weak one is speed, reliability, and the ability to reorder files.",
                    "This page explains why browser-side merging is useful (faster, more private), how to use it, and when it makes sense. It also helps search engines understand that this page is about practical PDF workflows, not just a generic file converter.",
                ]}
                steps={[
                    "Select multiple PDF files using the file picker or drag them into the drop zone.",
                    "Reorder files if needed using the up and down arrow buttons to set the merge sequence.",
                    "Click 'Merge PDFs' to start combining. The progress bar shows the merge status.",
                    "Download the merged PDF when complete. It contains all pages in the order you specified.",
                ]}
                benefits={[
                    "Useful for consolidating scans, reports, chapters, and documents from multiple sources.",
                    "Reorder files before merging—no need to guess or redo the process.",
                    "Browser-based processing means files stay private and merge happens fast.",
                    "Works with PDFs of different sizes, page counts, and origins.",
                    "No file size limits within browser capabilities—often 100MB+.",
                ]}
                faqItems={faqItems}
                relatedTools={relatedTools}
            />

            <FaqSchema items={faqItems} />
        </main>
    );
}
