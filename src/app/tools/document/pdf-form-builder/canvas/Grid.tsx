"use client";

export default function Grid() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundSize: "20px 20px",
        backgroundImage:
          "linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)",
        pointerEvents: "none",
      }}
    />
  );
}
