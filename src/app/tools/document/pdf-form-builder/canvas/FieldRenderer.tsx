"use client";

import { useRef } from "react";
import { FormField } from "../types/form-schema";

type Props = {
  field: FormField;
  selected: boolean;
  onSelect: () => void;
  onChange?: (field: FormField) => void;
};

export default function FieldRenderer({ field, selected, onSelect, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const startDrag = (event: React.MouseEvent) => {
    event.stopPropagation();
    onSelect();

    const startX = event.clientX - field.x;
    const startY = event.clientY - field.y;

    const handleMove = (moveEvent: MouseEvent) => {
      onChange?.({
        ...field,
        x: Math.max(0, moveEvent.clientX - startX),
        y: Math.max(0, moveEvent.clientY - startY),
      });
    };

    const handleUp = () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  const startResize = (event: React.MouseEvent) => {
    event.stopPropagation();
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = field.width;
    const startHeight = field.height;

    const handleMove = (moveEvent: MouseEvent) => {
      onChange?.({
        ...field,
        width: Math.max(40, startWidth + (moveEvent.clientX - startX)),
        height: Math.max(30, startHeight + (moveEvent.clientY - startY)),
      });
    };

    const handleUp = () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  return (
    <div
      ref={ref}
      onMouseDown={startDrag}
      style={{
        position: "absolute",
        left: field.x,
        top: field.y,
        width: field.width,
        height: field.height,
        border: selected ? "2px solid #2563eb" : "1px solid #9ca3af",
        background: "#fff",
        cursor: "move",
        padding: 6,
        boxSizing: "border-box",
      }}
    >
      <strong>{field.label}</strong>

      {selected && (
        <div
          onMouseDown={startResize}
          style={{
            position: "absolute",
            right: -6,
            bottom: -6,
            width: 12,
            height: 12,
            background: "#2563eb",
            cursor: "nwse-resize",
          }}
        />
      )}
    </div>
  );
}
