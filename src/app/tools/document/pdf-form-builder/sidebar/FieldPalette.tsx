"use client";

import { v4 as uuid } from "uuid";
import { FormField, FieldType } from "../types/form-schema";

type Props = {
  onAddField: (field: FormField) => void;
};

const FIELD_DEFS: {
  type: FieldType;
  label: string;
  description: string;
}[] = [
  {
    type: "text",
    label: "Text Input",
    description: "Single line text field",
  },
  {
    type: "textarea",
    label: "Textarea",
    description: "Multi-line text field",
  },
  {
    type: "checkbox",
    label: "Checkbox",
    description: "Yes / No selection",
  },
  {
    type: "radio",
    label: "Radio Group",
    description: "Single option selection",
  },
  {
    type: "select",
    label: "Dropdown",
    description: "Select from options",
  },
  {
    type: "signature",
    label: "Signature",
    description: "User signature field",
  },
];

export default function FieldPalette({ onAddField }: Props) {
  const createField = (type: FieldType) => {
    const base: FormField = {
      id: uuid(),
      type,
      label: "Untitled Field",
      required: false,

      // default layout (PDF points)
      x: 50,
      y: 700,
      width: 200,
      height: type === "textarea" ? 60 : 24,

      // field specific defaults
      options:
        type === "radio" || type === "select"
          ? ["Option 1", "Option 2"]
          : [],
    };

    onAddField(base);
  };

  return (
    <aside
      style={{
        borderRight: "1px solid #e5e7eb",
        padding: "12px",
        overflowY: "auto",
        background: "#fafafa",
      }}
    >
      <h3 style={{ fontWeight: 600, marginBottom: 12 }}>
        ➕ Add Fields
      </h3>

      <div style={{ display: "grid", gap: 8 }}>
        {FIELD_DEFS.map((f) => (
          <button
            key={f.type}
            onClick={() => createField(f.type)}
            style={{
              textAlign: "left",
              padding: "10px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: "white",
              cursor: "pointer",
            }}
          >
            <div style={{ fontWeight: 500 }}>{f.label}</div>
            <div
              style={{
                fontSize: 12,
                color: "#6b7280",
                marginTop: 2,
              }}
            >
              {f.description}
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
