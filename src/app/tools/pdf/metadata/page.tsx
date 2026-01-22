"use client";

import { useState } from "react";
import { PDFDocument, PDFName } from "pdf-lib";
import styles from "./metadata.module.css";

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
};

export default function PdfMetadataEditorPro() {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<MetaInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    setFile(f);
    setMessage("Reading PDF metadata...");
    setLoading(true);

    try {
      const bytes = await f.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });

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
      };

      setMetadata(meta);
      setMessage("✅ Metadata loaded successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Could not read metadata. The file may be encrypted.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!metadata) return;
    const { name, value } = e.target;
    setMetadata((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const saveMetadata = async () => {
    if (!file || !metadata) return alert("Please select a PDF first.");
    setLoading(true);
    setMessage("Saving updated metadata...");

    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });

      pdfDoc.setTitle(metadata.title);
      pdfDoc.setAuthor(metadata.author);
      pdfDoc.setSubject(metadata.subject);
      if (metadata.keywords)
        pdfDoc.setKeywords([metadata.keywords]); // ✅ expects array

      const updatedBytes = await pdfDoc.save();

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

      setMessage("✅ Metadata updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to save metadata.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>🧾</span>
          <span className={styles.textGradient}>PDF Metadata Editor</span>
        </h1>
        <p>Edit and inspect PDF metadata — title, author, subject, version, and more.</p>

        <label className={styles.fileInput}>
          <input type="file" accept="application/pdf" onChange={handleFile} />
          <span>{file ? file.name : "Choose PDF File"}</span>
        </label>

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
                  />
                </div>
              ))}

              <button
                onClick={saveMetadata}
                disabled={loading}
                className={styles.button}
              >
                {loading ? "Saving..." : "Save Metadata"}
              </button>
            </div>

            <div className={styles.infoSection}>
              <h2>Technical Info</h2>
              <ul>
                <li><strong>Creator:</strong> {metadata.creator}</li>
                <li><strong>Producer:</strong> {metadata.producer}</li>
                <li><strong>Created:</strong> {metadata.creationDate}</li>
                <li><strong>Modified:</strong> {metadata.modificationDate}</li>
                <li><strong>Pages:</strong> {metadata.pageCount}</li>
                <li><strong>PDF Version:</strong> {metadata.pdfVersion}</li>
                <li><strong>Encrypted:</strong> {metadata.encrypted ? "Yes" : "No"}</li>
              </ul>
            </div>
          </div>
        )}

        {message && <p className={styles.message}>{message}</p>}
      </section>
    </main>
  );
}
