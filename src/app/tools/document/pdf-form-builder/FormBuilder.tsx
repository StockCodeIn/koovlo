"use client";

import { useState } from "react";
import { FormField } from "./types/form-schema";
import FieldPalette from "./sidebar/FieldPalette";
import PropertiesPanel from "./sidebar/PropertiesPanel";
import Canvas from "./canvas/Canvas";

export default function FormBuilder() {
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedField =
    fields.find((f) => f.id === selectedId) || null;

  const updateField = (updated: FormField) => {
    setFields((prev) =>
      prev.map((f) => (f.id === updated.id ? updated : f))
    );
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr 280px",
        height: "100vh",
      }}
    >
      <FieldPalette
        onAddField={(field) => {
          setFields((prev) => [...prev, field]);
          setSelectedId(field.id);
        }}
      />

      <Canvas
        fields={fields}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <PropertiesPanel
        field={selectedField}
        onChange={updateField}
      />
    </div>
  );
}
