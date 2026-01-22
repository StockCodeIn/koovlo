"use client";

import { useRef, useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import SignatureCanvas from "react-signature-canvas";
import { Rnd } from "react-rnd";
import styles from "./sign.module.css";

export const dynamic = 'force-dynamic';

export default function PdfSignPro() {
  const [pdfjsLib, setPdfjsLib] = useState<any>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPages, setPdfPages] = useState<string[]>([]);
  const [signs, setSigns] = useState<any[]>([]);
  const [sigData, setSigData] = useState<string | null>(null);
  const [sigColor, setSigColor] = useState("#000000");
  const [sigWidth, setSigWidth] = useState(2);
  const [activePage, setActivePage] = useState(0);
  const sigPadRef = useRef<SignatureCanvas>(null);

  useEffect(() => {
    import('pdfjs-dist').then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      setPdfjsLib(pdfjs);
    });
  }, []);

  // ✅ PDF preview load
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pdfjsLib) return;
    setPdfFile(file);

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: context, viewport, canvas}).promise;
      pages.push(canvas.toDataURL());
    }
    setPdfPages(pages);
  };

  // ✅ Signature handling
  const handleSaveSign = () => {
    const data = sigPadRef.current?.toDataURL("image/png");
    if (data) setSigData(data);
  };

  const handleClearSign = () => {
    sigPadRef.current?.clear();
    setSigData(null);
  };

  const addSignToPage = () => {
    if (!sigData) return alert("पहले signature बनाएँ।");
    setSigns((prev) => [
      ...prev,
      {
        id: Date.now(),
        page: activePage,
        x: 100,
        y: 100,
        img: sigData,
        width: 120,
        height: 50,
      },
    ]);
  };

  // ✅ Download signed PDF
  const handleDownload = async () => {
    if (!pdfFile || signs.length === 0) return;

    const bytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);

    for (const s of signs) {
      const page = pdfDoc.getPage(s.page);
      const pngImage = await pdfDoc.embedPng(s.img);
      const { width, height } = page.getSize();

      page.drawImage(pngImage, {
        x: s.x,
        y: height - s.y - s.height,
        width: s.width,
        height: s.height,
      });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "signed-document.pdf";
    a.click();
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>🖋️ PDF Signature Pro</h1>

      <div className={styles.uploadBox}>
        <input type="file" accept="application/pdf" onChange={handlePdfUpload} />
      </div>

      <div className={styles.signatureTools}>
        <h3>Draw Signature</h3>
        <SignatureCanvas
          ref={sigPadRef}
          penColor={sigColor}
          minWidth={sigWidth}
          maxWidth={sigWidth}
          canvasProps={{
            width: 300,
            height: 150,
            className: styles.signaturePad,
          }}
        />
        <div className={styles.controls}>
          <label>
            Color:{" "}
            <input
              type="color"
              value={sigColor}
              onChange={(e) => setSigColor(e.target.value)}
            />
          </label>
          <label>
            Width:{" "}
            <input
              type="range"
              min="1"
              max="5"
              value={sigWidth}
              onChange={(e) => setSigWidth(Number(e.target.value))}
            />
          </label>
          <div className={styles.btnGroup}>
            <button className={styles.btn} onClick={handleSaveSign}>
              Save
            </button>
            <button className={styles.btn} onClick={handleClearSign}>
              Clear
            </button>
            <button
              className={styles.btn}
              onClick={addSignToPage}
              disabled={!sigData}
            >
              Add sign in the page
            </button>
          </div>
        </div>
      </div>

      {pdfPages.length > 0 && (
        <div className={styles.previewContainer}>
          <div className={styles.pageSelector}>
            {pdfPages.map((_, i) => (
              <button
                key={i}
                className={`${styles.pageBtn} ${
                  i === activePage ? styles.activePageBtn : ""
                }`}
                onClick={() => setActivePage(i)}
              >
                Page {i + 1}
              </button>
            ))}
          </div>

          <div className={styles.previewArea}>
            <img
              src={pdfPages[activePage]}
              className={styles.pdfPage}
              alt="PDF Page"
            />
            {signs
              .filter((s) => s.page === activePage)
              .map((s) => (
                <Rnd
                  key={s.id}
                  size={{ width: s.width, height: s.height }}
                  position={{ x: s.x, y: s.y }}
                  bounds="parent"
                  onDragStop={(_, data) => {
                    setSigns((prev) =>
                      prev.map((p) =>
                        p.id === s.id ? { ...p, x: data.x, y: data.y } : p
                      )
                    );
                  }}
                  onResizeStop={(_, __, ref, ___, pos) => {
                    setSigns((prev) =>
                      prev.map((p) =>
                        p.id === s.id
                          ? {
                              ...p,
                              width: parseFloat(ref.style.width),
                              height: parseFloat(ref.style.height),
                              ...pos,
                            }
                          : p
                      )
                    );
                  }}
                >
                  <img src={s.img} alt="sign" className={styles.signImg} />
                </Rnd>
              ))}
          </div>
        </div>
      )}

      <div className={styles.downloadSection}>
        <button
          className={styles.btn}
          onClick={handleDownload}
          disabled={!pdfFile || signs.length === 0}
        >
          Download Signed PDF
        </button>
      </div>
    </main>
  );
}
