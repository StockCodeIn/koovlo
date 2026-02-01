"use client";

import { useRef, useState } from "react";
import { FormField } from "../types/form-schema";

type Props = {
  field: FormField;
  selected: boolean;
  onSelect: () => void;
};

export default function FieldRenderer({
  field,
  selected,
  onSelect,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);

  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ w: 0, h: 0 });

  const onMouseDownDrag = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    setDragging(true);
    startPos.current = {
      x: e.clientX - field.x,
      y: e.clientY - field.y,
    };
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopAll);
  };

  const onDrag = (e: MouseEvent) => {
    if (!dragging) return;
    field.x = Math.max(0, e.clientX - startPos.current.x);
    field.y = Math.max(0, e.clientY - startPos.current.y);
    ref.current?.style.setProperty("left", field.x + "px");
    ref.current?.style.setProperty("top", field.y + "px");
  };

  const onMouseDownResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResizing(true);
    startSize.current = {
      w: field.width,
      h: field.height,
    };
    startPos.current = { x: e.clientX, y: e.clientY };
    window.addEventListener("mousemove", onResize);
    window.addEventListener("mouseup", stopAll);
  };

  const onResize = (e: MouseEvent) => {
    if (!resizing) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;

    field.width = Math.max(40, startSize.current.w + dx);
    field.height = Math.max(30, startSize.current.h + dy);

    ref.current?.style.setProperty("width", field.width + "px");
    ref.current?.style.setProperty("height", field.height + "px");
  };

  const stopAll = () => {
    setDragging(false);
    setResizing(false);
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mousemove", onResize);
    window.removeEventListener("mouseup", stopAll);
  };

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDownDrag}
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

      {/* resize handle */}
      {selected && (
        <div
          onMouseDown={onMouseDownResize}
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
