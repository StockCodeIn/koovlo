"use client";

import { useState } from "react";

export default function ImageToWebP() {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  const convert = async () => {
    if (!preview) return;

    const img = new Image();
    img.src = preview;
    await img.decode();

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    canvas.getContext("2d")!.drawImage(img, 0, 0);

    const webp = canvas.toDataURL("image/webp", 0.8);
    const link = document.createElement("a");
    link.href = webp;
    link.download = "koovlo.webp";
    link.click();
  };

  return (
    <main style={wrap}>
      <h1>Image to WebP</h1>
      <p>Convert JPG/PNG to WebP instantly.</p>

      <input type="file" accept="image/*" onChange={handleFile} />

      {preview && (
        <>
          <img src={preview} style={{ maxWidth: "100%", marginTop: "20px" }} />
          <button onClick={convert} style={btn}>
            Convert & Download
          </button>
        </>
      )}
    </main>
  );
}

const wrap = { padding: "40px", maxWidth: "800px", margin: "auto" };
const btn = {
  marginTop: "20px",
  padding: "12px 18px",
  background: "#000",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
};
