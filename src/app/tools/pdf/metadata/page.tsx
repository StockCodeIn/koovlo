"use client";

import { useState, useRef } from "react";
import { PDFDocument, PDFName } from "pdf-lib";
import styles from "./metadata.module.css";

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

type MetaInfo = {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modificationDate?: string;
  pageCount?: number;
  encrypted?: boolean;
  pdfVersion?: string;
  fileSize?: string;
};

export default function PdfMetadataEditorPro() {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<MetaInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.type !== 'application/pdf') {
        setMessage('❌ Please upload a valid PDF file');
        setMessageType('error');
        return;
      }
      handleFileUpload(selectedFile);
    }
  };

  const clearFile = () => {
    setFile(null);
    setMetadata(null);
    setMessage("");
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setMessage('❌ Please select a valid PDF file');
        setMessageType('error');
        return;
      }
      handleFileUpload(selectedFile);
    }
  };

  const handleFileUpload = async (selectedFile: File) => {
    setFile(selectedFile);
    setMessage("Reading PDF metadata...");
    setMessageType("info");
    setLoading(true);
    setProgress(25);

    try {
      const bytes = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });

      setProgress(75);

      // ✅ safer access, avoids PDFName type errors
      const infoDict = pdfDoc.context.lookup(pdfDoc.catalog.get(PDFName.of("Info")));

      const meta: MetaInfo = {
        title: pdfDoc.getTitle() || "",
        author: pdfDoc.getAuthor() || "",
        subject: pdfDoc.getSubject() || "",
        keywords: (pdfDoc.getKeywords && pdfDoc.getKeywords()) || "",
        creator: pdfDoc.getCreator() || "Unknown",
        producer: pdfDoc.getProducer() || "Unknown",
        creationDate: pdfDoc.getCreationDate()?.toLocaleString() || "N/A",
        modificationDate: pdfDoc.getModificationDate()?.toLocaleString() || "N/A",
        pageCount: pdfDoc.getPageCount(),
        encrypted: pdfDoc.isEncrypted || false,
        pdfVersion: "1.x",
        fileSize: formatFileSize(selectedFile.size),
      };

      setMetadata(meta);
      setProgress(100);
      setMessage("✅ Metadata loaded successfully!");
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessage("❌ Could not read metadata. The file may be encrypted.");
      setMessageType("error");
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!metadata) return;
    const { name, value } = e.target;
    setMetadata((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const saveMetadata = async () => {
    if (!file || !metadata) return;
    setLoading(true);
    setMessage("Saving updated metadata...");
    setMessageType("info");
    setProgress(25);

    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });

      setProgress(50);

      pdfDoc.setTitle(metadata.title);
      pdfDoc.setAuthor(metadata.author);
      pdfDoc.setSubject(metadata.subject);
      if (metadata.keywords)
        pdfDoc.setKeywords([metadata.keywords]); // ✅ expects array

      setProgress(75);

      const updatedBytes = await pdfDoc.save();

      setProgress(90);

      // ✅ safer Blob creation
      const blob = new Blob([new Uint8Array(updatedBytes)], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(".pdf", "-meta.pdf");
      a.click();
      URL.revokeObjectURL(url);

      setProgress(100);
      setMessage("✅ Metadata updated successfully!");
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to save metadata.");
      setMessageType("error");
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>🧾</span>
        <span className={styles.textGradient}>PDF Metadata Editor</span>
      </h1>
      <p className={styles.description}>
        Edit and inspect PDF metadata — title, author, subject, version, and more. Works fully offline — files never leave your device.
      </p>

      <div className={styles.converter}>
        <div className={styles.inputSection}>
          <div
            className={`${styles.dropZone} ${isDragOver ? styles.dragOver : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <label className={styles.fileLabel}>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFile}
                disabled={loading}
                className={styles.hiddenInput}
                
              />
              📄 {file ? file.name : "Choose PDF File"}
            </label>
            <p className={styles.dropText}>Or drag and drop a PDF file here</p>
          </div>

          {file && (
            <div className={styles.fileInfo}>
              <p><strong>File:</strong> {file.name}</p>
              <p><strong>Size:</strong> {formatFileSize(file.size)}</p>
              <button onClick={clearFile} className={styles.clearBtn}>
                Clear File
              </button>
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
              <p>Processing PDF...</p>
            </div>
          )}
        </div>

        {metadata && (
          <div className={styles.metaGrid}>
            <div className={styles.editSection}>
              <h2>Editable Fields</h2>

              {["title", "author", "subject", "keywords"].map((key) => (
                <div className={styles.inputGroup} key={key}>
                  <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                  <input
                    name={key}
                    value={(metadata as any)[key] || ""}
                    onChange={handleChange}
                    placeholder={`Enter ${key}`}
                    disabled={loading}
                  />
                </div>
              ))}

              <button
                onClick={saveMetadata}
                disabled={loading}
                className={styles.button}
              >
                {loading ? "💾 Saving..." : "💾 Save Metadata"}
              </button>
            </div>

            <div className={styles.infoSection}>
              <h2>📊 Technical Info</h2>
              <ul>
                <li><strong>File Size:</strong> {metadata.fileSize}</li>
                <li><strong>Pages:</strong> {metadata.pageCount}</li>
                <li><strong>Title:</strong> {metadata.title || "Not set"}</li>
                <li><strong>Author:</strong> {metadata.author || "Not set"}</li>
                <li><strong>Created:</strong> {metadata.creationDate}</li>
                <li><strong>Modified:</strong> {metadata.modificationDate}</li>
                <li><strong>Encrypted:</strong> {metadata.encrypted ? "Yes" : "No"}</li>
                <li><strong>Creator:</strong> {metadata.creator}</li>
                <li><strong>Producer:</strong> {metadata.producer}</li>
                <li><strong>PDF Version:</strong> {metadata.pdfVersion}</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {message && (
        <div className={`${styles.message} ${styles[messageType]}`}>
          {message}
        </div>
      )}

      <div className={styles.tips}>
        <h4>💡 Metadata Tips</h4>
        <ul>
          <li>Metadata helps organize and identify your PDF documents</li>
          <li>Title, author, and subject appear in PDF readers and search results</li>
          <li>Keywords improve searchability in document management systems</li>
          <li>Technical info shows PDF properties and creation details</li>
          <li>Always keep a backup of your original file</li>
        </ul>
      </div>
    </main>
  );
}
