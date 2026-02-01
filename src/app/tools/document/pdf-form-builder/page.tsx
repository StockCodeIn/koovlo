// /tools/document/pdf-form-builder/page.tsx
"use client";

import FormBuilder from "./FormBuilder";

export default function PdfFormBuilderPage() {
  return (
    <main style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #e5e7eb",
          fontWeight: 600,
        }}
      >
        🧾 Create Fillable PDF Form
      </header>

      <div style={{ flex: 1, overflow: "hidden" }}>
        <FormBuilder />
      </div>
    </main>
  );
}
