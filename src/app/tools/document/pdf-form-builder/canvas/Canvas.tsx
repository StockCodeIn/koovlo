"use client";

import { FormField } from "../types/form-schema";
import FieldRenderer from "./FieldRenderer";
import Grid from "./Grid";

type Props = {
  fields: FormField[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

export default function Canvas({ fields, selectedId, onSelect }: Props) {
  return (
    <div
      style={{
        position: "relative",
        background: "#f9fafb",
        overflow: "auto",
      }}
      onClick={() => onSelect(null)}
    >
      <Grid />

      {fields.map((field) => (
        <FieldRenderer
          key={field.id}
          field={field}
          selected={field.id === selectedId}
          onSelect={() => onSelect(field.id)}
        />
      ))}
    </div>
  );
}
