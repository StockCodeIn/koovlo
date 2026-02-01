"use client";

import { useRef, useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import SignatureCanvas from "react-signature-canvas";
import { Rnd } from "react-rnd";
import styles from "./sign.module.css";

export const dynamic = "force-dynamic";

interface Signature {
  id: string;
  page: number;
  x: number;
  y: number;
  img: string;
  width: number;
  height: number;
  type: "signature" | "initial" | "date" | "text";
  text?: string;
}

export default function PdfSignPro() {
  const [pdfjsLib, setPdfjsLib] = useState<any>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPages, setPdfPages] = useState<string[]>([]);
  const [pageDimensions, setPageDimensions] = useState<{ width: number; height: number }[]>([]);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [sigData, setSigData] = useState<string | null>(null);
  const [sigColor, setSigColor] = useState("#1a1a1a");
  const [sigWidth, setSigWidth] = useState(3);
  const [activePage, setActivePage] = useState(0);
  const [mode, setMode] = useState<"signature" | "initial" | "date" | "text">("signature");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [textInput, setTextInput] = useState("");
  const sigPadRef = useRef<SignatureCanvas>(null);
  const previewImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    import("pdfjs-dist").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      setPdfjsLib(pdfjs);
    });
  }, []);

  // PDF preview load
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pdfjsLib) return;

    if (file.type !== "application/pdf") {
      setMessage("❌ Please upload a valid PDF file.");
      return;
    }

    setLoading(true);
    setMessage("📄 Loading PDF...");

    try {
      setPdfFile(file);
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pages: string[] = [];
      const dimensions: { width: number; height: number }[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1 }); // Original PDF size
        dimensions.push({ width: viewport.width, height: viewport.height });
        
        // Render at original size (scale 1)
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport }).promise;
        pages.push(canvas.toDataURL());
      }

      setPdfPages(pages);
      setPageDimensions(dimensions);
      setActivePage(0);
      setMessage(`✅ PDF loaded! ${pdf.numPages} pages detected.`);
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to load PDF.");
    } finally {
      setLoading(false);
    }
  };

  // Signature handling
  const handleSaveSign = () => {
    const data = sigPadRef.current?.toDataURL("image/png");
    if (data) {
      setSigData(data);
      setMessage(`✅ ${mode.charAt(0).toUpperCase() + mode.slice(1)} saved!`);
      setTimeout(() => setMessage(""), 1500);
    }
  };

  const handleClearSign = () => {
    sigPadRef.current?.clear();
    setSigData(null);
  };

  const addSignToPage = () => {
    if (!sigData && mode !== "date" && mode !== "text") {
      setMessage("❌ Please create a signature first.");
      return;
    }

    if ((mode === "text" || mode === "date") && !textInput && mode === "text") {
      setMessage("❌ Please enter text.");
      return;
    }

    let imgData = sigData;

    // Create image for date/text
    if (mode === "date" || mode === "text") {
      const canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = sigColor;
        ctx.font = "24px Arial";
        const text = mode === "date" ? new Date().toLocaleDateString() : textInput;
        ctx.fillText(text, 10, 50);
      }
      imgData = canvas.toDataURL("image/png");
    }

    const newSig: Signature = {
      id: Date.now().toString(),
      page: activePage,
      x: 50,
      y: 50,
      img: imgData || "",
      width: mode === "signature" ? 150 : 120,
      height: mode === "signature" ? 60 : 40,
      type: mode,
      text: mode === "text" ? textInput : undefined,
    };

    setSignatures((prev) => [...prev, newSig]);
    setMessage(`✅ ${mode} added to page ${activePage + 1}!`);
    setTimeout(() => setMessage(""), 1500);

    if (mode !== "date") {
      handleClearSign();
      setTextInput("");
    }
  };

  const removeSignature = (id: string) => {
    setSignatures((prev) => prev.filter((s) => s.id !== id));
    setMessage("🗑️ Signature removed.");
  };

  // Download signed PDF
  const handleDownload = async () => {
    if (!pdfFile || signatures.length === 0) {
      setMessage("❌ Add at least one signature before downloading.");
      return;
    }

    setLoading(true);
    setMessage("📝 Processing PDF...");

    try {
      const bytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);

      for (const sig of signatures) {
        const page = pdfDoc.getPage(sig.page);
        const pngImage = await pdfDoc.embedPng(sig.img);
        const { width: pdfWidth, height: pdfHeight } = page.getSize();

        // Get the actual displayed size of preview image
        const displayedWidth = previewImgRef.current?.offsetWidth || pageDimensions[sig.page].width;
        const displayedHeight = previewImgRef.current?.offsetHeight || pageDimensions[sig.page].height;

        // Calculate scale from displayed preview to PDF
        const scaleX = pdfWidth / displayedWidth;
        const scaleY = pdfHeight / displayedHeight;

        // Scale coordinates from displayed preview to PDF size
        const scaledX = sig.x * scaleX;
        const scaledY = sig.y * scaleY;
        const scaledWidth = sig.width * scaleX;
        const scaledHeight = sig.height * scaleY;

        page.drawImage(pngImage, {
          x: scaledX,
          y: pdfHeight - scaledY - scaledHeight,
          width: scaledWidth,
          height: scaledHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = pdfFile.name.replace(".pdf", "-signed.pdf");
      a.click();
      URL.revokeObjectURL(url);

      setMessage("✅ PDF signed and downloaded!");
      setTimeout(() => {
        setMessage("");
        setPdfFile(null);
        setPdfPages([]);
        setPageDimensions([]);
        setSignatures([]);
        setSigData(null);
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to sign PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>
            <span className={styles.icon}>🖋️</span>
            <span className={styles.textGradient}>PDF Signature Pro</span>
          </h1>
          <p className={styles.subtitle}>
            Sign PDFs with custom signatures, initials, dates, and text. Drag to position on any page.
          </p>
        </div>

        <div className={styles.content}>
          {/* Step 1: Upload PDF */}
          <div className={styles.stepSection}>
            <p className={styles.stepLabel}>Step 1 · Upload PDF</p>
            <label className={styles.fileInputBox}>
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                disabled={loading}
              />
              <div className={styles.fileInputContent}>
                <span className={styles.fileIcon}>📄</span>
                <span className={styles.fileName}>
                  {pdfFile ? pdfFile.name : "Choose a PDF file or drag & drop"}
                </span>
                {pdfFile && (
                  <span className={styles.fileSize}>
                    {(pdfFile.size / 1024 / 1024).toFixed(2)} MB · {pdfPages.length} pages
                  </span>
                )}
              </div>
            </label>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`${styles.message} ${
                message.includes("✅")
                  ? styles.success
                  : message.includes("❌")
                  ? styles.error
                  : styles.info
              }`}
            >
              {message}
            </div>
          )}

          {pdfPages.length > 0 && (
            <>
              {/* Step 2: Create Signature */}
              <div className={styles.stepSection}>
                <p className={styles.stepLabel}>Step 2 · Create Signature</p>

                {/* Mode Selector */}
                <div className={styles.modeSelector}>
                  <button
                    className={`${styles.modeBtn} ${mode === "signature" ? styles.active : ""}`}
                    onClick={() => {
                      setMode("signature");
                      setSigData(null);
                      handleClearSign();
                    }}
                  >
                    ✍️ Signature
                  </button>
                  <button
                    className={`${styles.modeBtn} ${mode === "initial" ? styles.active : ""}`}
                    onClick={() => {
                      setMode("initial");
                      setSigData(null);
                      handleClearSign();
                    }}
                  >
                    🔤 Initial
                  </button>
                  <button
                    className={`${styles.modeBtn} ${mode === "date" ? styles.active : ""}`}
                    onClick={() => setMode("date")}
                  >
                    📅 Date
                  </button>
                  <button
                    className={`${styles.modeBtn} ${mode === "text" ? styles.active : ""}`}
                    onClick={() => {
                      setMode("text");
                      setSigData(null);
                      handleClearSign();
                    }}
                  >
                    📝 Text
                  </button>
                </div>

                {/* Signature Pad */}
                {(mode === "signature" || mode === "initial") && (
                  <div className={styles.signatureSection}>
                    <div className={styles.signaturePadWrapper}>
                      <SignatureCanvas
                        ref={sigPadRef}
                        penColor={sigColor}
                        minWidth={sigWidth}
                        maxWidth={sigWidth}
                        dotSize={sigWidth / 2}
                        velocityFilterWeight={0.7}
                        onEnd={() => {
                          // Trigger re-render to show saved state
                          const data = sigPadRef.current?.toDataURL("image/png");
                          if (data) setSigData(data);
                        }}
                        canvasProps={{
                          className: styles.signaturePad,
                          style: {
                            touchAction: "none",
                            border: "2px solid #ddd",
                            borderRadius: "8px",
                            background: "#fff",
                            cursor: "crosshair",
                            display: "block",
                            margin: "0 auto",
                          },
                        }}
                      />
                    </div>
                    <div className={styles.controlsGrid}>
                      <div className={styles.controlGroup}>
                        <label>Color:</label>
                        <input
                          type="color"
                          value={sigColor}
                          onChange={(e) => setSigColor(e.target.value)}
                          className={styles.colorInput}
                        />
                      </div>
                      <div className={styles.controlGroup}>
                        <label>Width:</label>
                        <input
                          type="range"
                          min="1"
                          max="8"
                          value={sigWidth}
                          onChange={(e) => setSigWidth(Number(e.target.value))}
                          className={styles.rangeInput}
                        />
                        <span>{sigWidth}px</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Text Input */}
                {mode === "text" && (
                  <div className={styles.textSection}>
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Enter text to add..."
                      className={styles.textInput}
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className={styles.buttonGroup}>
                  {(mode === "signature" || mode === "initial") && (
                    <>
                      <button
                        onClick={handleSaveSign}
                        className={styles.btn + " " + styles.primaryBtn}
                      >
                        Save {mode}
                      </button>
                      <button
                        onClick={handleClearSign}
                        className={styles.btn + " " + styles.secondaryBtn}
                      >
                        Clear
                      </button>
                    </>
                  )}
                  <button
                    onClick={addSignToPage}
                    disabled={
                      (mode !== "date" && mode !== "text" && !sigData) ||
                      (mode === "text" && !textInput)
                    }
                    className={styles.btn + " " + styles.successBtn}
                  >
                    + Add {mode} to Page
                  </button>
                </div>
              </div>

              {/* Step 3: Preview & Position */}
              <div className={styles.stepSection}>
                <p className={styles.stepLabel}>Step 3 · Preview & Position</p>

                {/* Page Selector */}
                <div className={styles.pageSelector}>
                  {pdfPages.map((_, i) => (
                    <button
                      key={i}
                      className={`${styles.pageBtn} ${activePage === i ? styles.activePageBtn : ""}`}
                      onClick={() => setActivePage(i)}
                    >
                      Page {i + 1}
                    </button>
                  ))}
                </div>

                {/* Preview Area */}
                <div className={styles.previewContainer}>
                  <div className={styles.previewArea}>
                    <img
                      ref={previewImgRef}
                      src={pdfPages[activePage]}
                      className={styles.pdfPage}
                      alt="PDF Page"
                    />
                    {signatures
                      .filter((s) => s.page === activePage)
                      .map((sig) => (
                        <Rnd
                          key={sig.id}
                          size={{ width: sig.width, height: sig.height }}
                          position={{ x: sig.x, y: sig.y }}
                          bounds="parent"
                          minWidth={50}
                          minHeight={30}
                          onDragStop={(_, data) => {
                            setSignatures((prev) =>
                              prev.map((s) =>
                                s.id === sig.id ? { ...s, x: data.x, y: data.y } : s
                              )
                            );
                          }}
                          onResizeStop={(_, __, ref, ___, pos) => {
                            const width = parseFloat(ref.style.width) || sig.width;
                            const height = parseFloat(ref.style.height) || sig.height;
                            setSignatures((prev) =>
                              prev.map((s) =>
                                s.id === sig.id
                                  ? {
                                      ...s,
                                      width: Math.max(50, width),
                                      height: Math.max(30, height),
                                      x: pos.x || sig.x,
                                      y: pos.y || sig.y,
                                    }
                                  : s
                              )
                            );
                          }}
                          enableResizing={{
                            top: false,
                            right: true,
                            bottom: true,
                            left: false,
                            topRight: true,
                            bottomRight: true,
                            bottomLeft: false,
                            topLeft: false,
                          }}
                        >
                          <div className={styles.signatureWrapper}>
                            <img
                              src={sig.img}
                              alt={sig.type}
                              className={styles.signImg}
                            />
                            <button
                              onClick={() => removeSignature(sig.id)}
                              className={styles.removeBtn}
                              title="Remove signature"
                            >
                              ✕
                            </button>
                          </div>
                        </Rnd>
                      ))}
                  </div>

                  {/* Signature List */}
                  {signatures.length > 0 && (
                    <div className={styles.signatureList}>
                      <p className={styles.listTitle}>
                        📋 Signatures ({signatures.length})
                      </p>
                      <ul>
                        {signatures.map((sig) => (
                          <li key={sig.id}>
                            <span>
                              {sig.type === "signature" && "✍️"}
                              {sig.type === "initial" && "🔤"}
                              {sig.type === "date" && "📅"}
                              {sig.type === "text" && "📝"} Page {sig.page + 1}
                            </span>
                            <button
                              onClick={() => removeSignature(sig.id)}
                              className={styles.deleteBtn}
                            >
                              Delete
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Bar */}
        <div className={styles.actionBar}>
          {pdfFile && (
            <>
              <button
                onClick={() => {
                  setPdfFile(null);
                  setPdfPages([]);
                  setPageDimensions([]);
                  setSignatures([]);
                  setSigData(null);
                  setMessage("");
                }}
                className={styles.secondaryBtn}
              >
                Start Over
              </button>
              <button
                onClick={handleDownload}
                disabled={loading || signatures.length === 0}
                className={styles.primaryBtn}
              >
                {loading ? "Processing..." : "📥 Download Signed PDF"}
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
