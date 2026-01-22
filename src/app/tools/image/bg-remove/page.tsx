"use client";
import { useState } from "react";

export default function BgRemove() {
  const [preview, setPreview] = useState<string | null>(null);

  const handle = (e: any) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPreview(URL.createObjectURL(f));
  };

  const removeBg = async () => {
    if (!preview) return;

    const img = new Image();
    img.src = preview;
    await img.decode();

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imgData.data;

    for (let i = 0; i < d.length; i += 4) {
      if (d[i] > 240 && d[i + 1] > 240 && d[i + 2] > 240) {
        d[i + 3] = 0;
      }
    }

    ctx.putImageData(imgData, 0, 0);

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "koovlo-bg-removed.png";
    link.click();
  };

  return (
    <main style={wrap}>
      <h1>Image Background Remover</h1>
      <p>Remove white background instantly. No upload.</p>

      <input type="file" accept="image/*" onChange={handle} />

      {preview && (
        <>
          <img src={preview} style={{ maxWidth: "100%", marginTop: "20px" }} />
          <button onClick={removeBg} style={btn}>
            Remove Background
          </button>
        </>
      )}
    </main>
  );
}

const wrap = { padding: "40px", maxWidth: "800px", margin: "auto" };
const btn = {
  marginTop: "20px",
  padding: "12px",
  background: "#000",
  color: "#fff",
  border: "none",
};
