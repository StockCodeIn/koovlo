"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import styles from "./merge.module.css";
import ToolInfo from "@/components/ToolInfo";

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

            <ToolInfo
                howItWorks="1. Select multiple PDF files using the file picker or drag & drop.<br>2. Reorder files if needed using the arrow buttons.<br>3. Click 'Merge PDFs' to combine them.<br>4. Download the merged PDF."
                faqs={[
                    { title: "Is my data secure?", content: "Yes, all processing happens in your browser. Files are not uploaded to any server." },
                    { title: "What's the maximum file size?", content: "Depends on your browser, but typically up to 100MB total." },
                    { title: "Can I reorder the files?", content: "Yes, use the up/down arrows to change the merge order." }
                ]}
                tips={["For best results, ensure all PDFs have the same page size.<br>Large files may take longer to process.<br>Files are processed in the order shown."]}
            />
        </main>
    );
}
