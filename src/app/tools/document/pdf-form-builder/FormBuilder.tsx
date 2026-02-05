"use client";

import { useState, useEffect, useRef } from "react";
import { FormField } from "./types/form-schema";
import { generateFillablePdf } from "./pdf/generatePdf";
import styles from "./pdf-form-builder.module.css";

// Page size definitions (in pixels at 96 DPI for display)
const PAGE_SIZES = {
  A4: { name: "A4", width: 595, height: 842 },
  A5: { name: "A5", width: 420, height: 595 },
  Letter: { name: "Letter", width: 612, height: 792 },
  Legal: { name: "Legal", width: 612, height: 1008 },
};

type ExtendedFormField = FormField & {
  bgColor?: string;
  lineColor?: string;
  textColor?: string;
};

const FIELD_TYPES = [
  { type: "text" as const, name: "Text Input", icon: "📝", desc: "Single line text" },
  { type: "textarea" as const, name: "Text Area", icon: "📄", desc: "Multi-line text" },
  { type: "checkbox" as const, name: "Checkbox", icon: "☑️", desc: "Yes/No option" },
  { type: "radio" as const, name: "Radio Group", icon: "🔘", desc: "Select one" },
  { type: "select" as const, name: "Dropdown", icon: "📋", desc: "Select from list" },
  { type: "signature" as const, name: "Signature", icon: "✓", desc: "Sign here" },
];

export default function FormBuilder() {
  const [fields, setFields] = useState<ExtendedFormField[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formName, setFormName] = useState("My Form");
  const [pageSize, setPageSize] = useState<keyof typeof PAGE_SIZES>("A4");
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragType, setDragType] = useState<FormField["type"] | null>(null);

  // Auto-save to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("pdf-form-builder-data");
    if (saved) {
      const data = JSON.parse(saved);
      setFields(data.fields || []);
      setFormName(data.formName || "My Form");
      setPageSize(data.pageSize || "A4");
    }
  }, []);

  useEffect(() => {
    if (fields.length > 0) {
      localStorage.setItem("pdf-form-builder-data", JSON.stringify({ fields, formName, pageSize }));
    }
  }, [fields, formName, pageSize]);

  const selectedField = fields.find((f) => f.id === selectedId) as ExtendedFormField | undefined;
  const pageConfig = PAGE_SIZES[pageSize];

  const addField = (type: FormField["type"]) => {
    let newField: ExtendedFormField;

    if (type === "select" || type === "radio") {
      newField = {
        id: Date.now().toString(),
        type,
        label: `New ${type} field`,
        required: false,
        x: 20,
        y: 20 + fields.length * 80,
        width: 300,
        height: 120,
        options: ["Option 1", "Option 2"],
        bgColor: "#ffffff",
        lineColor: "#000000",
        textColor: "#000000",
      };
    } else {
      newField = {
        id: Date.now().toString(),
        type,
        label: `New ${type} field`,
        required: false,
        x: 20,
        y: 20 + fields.length * 80,
        width: type === "textarea" ? 400 : 300,
        height: type === "textarea" ? 100 : type === "signature" ? 80 : 40,
        bgColor: "#ffffff",
        lineColor: "#000000",
        textColor: "#000000",
      };
    }

    setFields((prev) => [...prev, newField]);
    setSelectedId(newField.id);
  };

  const updateField = (updated: ExtendedFormField) => {
    const pageConfig = PAGE_SIZES[pageSize];
    const MARGIN = 10;
    
    const validated = {
      ...updated,
      x: Math.max(MARGIN, Math.min(updated.x, pageConfig.width - MARGIN - updated.width)),
      y: Math.max(MARGIN, Math.min(updated.y, pageConfig.height - MARGIN - updated.height)),
      width: Math.min(updated.width, pageConfig.width - 2 * MARGIN),
      height: Math.min(updated.height, pageConfig.height - 2 * MARGIN),
    };

    setFields((prev) => prev.map((f) => (f.id === validated.id ? validated : f)));
  };

  const deleteField = () => {
    if (selectedId) {
      setFields((prev) => prev.filter((f) => f.id !== selectedId));
      setSelectedId(null);
    }
  };

  const clearForm = () => {
    if (confirm("Are you sure you want to clear all fields?")) {
      setFields([]);
      setSelectedId(null);
      setFormName("My Form");
    }
  };

  const saveForm = () => {
    const data = JSON.stringify({ fields, formName }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formName.replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          setFields(data.fields || []);
          setFormName(data.formName || "My Form");
          setSelectedId(null);
        } catch (error) {
          alert("Invalid form file");
        }
      };
      reader.readAsText(file);
    }
  };

  const exportPdf = async () => {
    if (fields.length === 0) {
      alert("Please add some fields first!");
      return;
    }
    try {
      const pdfBytes = await generateFillablePdf(fields as any, formName);
      const bytes = new Uint8Array(pdfBytes);
      const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
      const blob = new Blob([buffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${formName.replace(/\s+/g, "-")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("Error generating PDF. Please try again.");
      console.error(error);
    }
  };

  const handleDragStart = (type: FormField["type"]) => {
    setDragType(type);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).style.backgroundColor = "#f0f0f0";
  };

  const handleDragLeave = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.backgroundColor = "#ffffff";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).style.backgroundColor = "#ffffff";
    
    if (!dragType || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const canvasX = e.clientX - rect.left + canvasRef.current.scrollLeft;
    const canvasY = e.clientY - rect.top + canvasRef.current.scrollTop;

    let newField: ExtendedFormField;
    if (dragType === "select" || dragType === "radio") {
      newField = {
        id: Date.now().toString(),
        type: dragType,
        label: `New ${dragType} field`,
        required: false,
        x: Math.max(10, Math.min(canvasX - 150, pageConfig.width - 310)),
        y: Math.max(10, Math.min(canvasY - 60, pageConfig.height - 130)),
        width: 300,
        height: 120,
        options: ["Option 1", "Option 2"],
        bgColor: "#ffffff",
        lineColor: "#000000",
        textColor: "#000000",
      };
    } else {
      newField = {
        id: Date.now().toString(),
        type: dragType,
        label: `New ${dragType} field`,
        required: false,
        x: Math.max(10, Math.min(canvasX - 150, pageConfig.width - 310)),
        y: Math.max(10, Math.min(canvasY - 20, pageConfig.height - 60)),
        width: dragType === "textarea" ? 400 : 300,
        height: dragType === "textarea" ? 100 : dragType === "signature" ? 80 : 40,
        bgColor: "#ffffff",
        lineColor: "#000000",
        textColor: "#000000",
      };
    }

    setFields((prev) => [...prev, newField]);
    setSelectedId(newField.id);
    setDragType(null);
  };

  return (
    <div className={styles.builderWrapper}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className={styles.toolBtn}
            placeholder="Form Name"
            style={{ minWidth: "200px" }}
          />
          <select 
            value={pageSize} 
            onChange={(e) => setPageSize(e.target.value as keyof typeof PAGE_SIZES)}
            className={styles.toolBtn}
            style={{ minWidth: "120px" }}
          >
            {Object.keys(PAGE_SIZES).map((size) => (
              <option key={size} value={size}>
                📄 {size}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.toolbarRight}>
          <button className={styles.toolBtn} onClick={clearForm}>
            🗑️ Clear
          </button>
          <label className={styles.toolBtn}>
            📂 Load
            <input type="file" accept=".json" onChange={loadForm} style={{ display: "none" }} />
          </label>
          <button className={styles.toolBtn} onClick={saveForm}>
            💾 Save
          </button>
          <button className={`${styles.toolBtn} ${styles.primary}`} onClick={exportPdf}>
            📥 Download PDF
          </button>
        </div>
      </div>

      {/* Form Builder Grid */}
      <div className={styles.formBuilder}>
        {/* Left Sidebar - Fields */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>🎨 Fields</h2>
            <p>Drag to canvas</p>
          </div>
          <div className={styles.sidebarContent}>
            <div className={styles.fieldPalette}>
              {FIELD_TYPES.map((field) => (
                <div
                  key={field.type}
                  className={styles.fieldBtn}
                  draggable
                  onDragStart={() => handleDragStart(field.type as FormField["type"])}
                  onClick={() => addField(field.type as FormField["type"])}
                  title="Click to add or drag to canvas"
                >
                  <div className={styles.fieldIcon}>{field.icon}</div>
                  <div className={styles.fieldInfo}>
                    <h4>{field.name}</h4>
                    <p>{field.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Canvas */}
        <div 
          className={styles.canvas} 
          ref={canvasRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div 
            className={styles.canvasPage}
            style={{
              width: `${pageConfig.width}px`,
              height: `${pageConfig.height}px`,
              position: 'relative',
              backgroundColor: '#fff',
              border: '2px solid #ddd',
              boxShadow: '0 0 20px rgba(0,0,0,0.1)',
            }}
          >
            {fields.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>👆 Start Building</h3>
                <p>Click or drag fields from left sidebar</p>
              </div>
            ) : (
              fields.map((field) => (
                <div
                  key={field.id}
                  className={`${styles.canvasField} ${selectedId === field.id ? styles.selected : ""}`}
                  style={{
                    left: `${field.x}px`,
                    top: `${field.y}px`,
                    width: `${field.width}px`,
                    height: `${field.height}px`,
                    backgroundColor: field.bgColor || "#ffffff",
                    borderColor: field.lineColor || "#000000",
                    color: field.textColor || "#000000",
                  }}
                  onClick={() => setSelectedId(field.id)}
                  onMouseDown={(e) => {
                    if (e.target === e.currentTarget) {
                      const startX = e.clientX - field.x;
                      const startY = e.clientY - field.y;
                      const handleMove = (moveE: MouseEvent) => {
                        updateField({
                          ...field,
                          x: moveE.clientX - startX,
                          y: moveE.clientY - startY,
                        });
                      };
                      const handleUp = () => {
                        document.removeEventListener("mousemove", handleMove);
                        document.removeEventListener("mouseup", handleUp);
                      };
                      document.addEventListener("mousemove", handleMove);
                      document.addEventListener("mouseup", handleUp);
                    }
                  }}
                >
                  <button className={styles.deleteBtn} onClick={(e) => { e.stopPropagation(); deleteField(); }}>
                    ✕
                  </button>
                  <div className={styles.fieldLabel} style={{ color: field.textColor || "#000000" }}>
                    {field.label}
                    {field.required && <span className={styles.required}>*</span>}
                  </div>
                  <div className={styles.fieldPreview}>
                    {field.type === "text" && <input type="text" placeholder="Text" disabled />}
                    {field.type === "textarea" && <textarea placeholder="Text area" disabled />}
                    {field.type === "checkbox" && <input type="checkbox" disabled />}
                    {field.type === "radio" && field.options?.map((opt: string, i: number) => (
                      <div key={i} style={{ fontSize: "0.8rem" }}>
                        <input type="radio" disabled /> {opt}
                      </div>
                    ))}
                    {field.type === "select" && (
                      <select disabled>
                        {field.options?.map((opt, i) => <option key={i}>{opt}</option>)}
                      </select>
                    )}
                    {field.type === "signature" && (
                      <div style={{ border: "1px dashed #ccc", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
                        ✓ Sign here
                      </div>
                    )}
                  </div>
                  <div
                    className={styles.resizeHandle}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      const startX = e.clientX;
                      const startY = e.clientY;
                      const startWidth = field.width;
                      const startHeight = field.height;
                      const handleMove = (moveE: MouseEvent) => {
                        updateField({
                          ...field,
                          width: Math.max(100, startWidth + (moveE.clientX - startX)),
                          height: Math.max(30, startHeight + (moveE.clientY - startY)),
                        });
                      };
                      const handleUp = () => {
                        document.removeEventListener("mousemove", handleMove);
                        document.removeEventListener("mouseup", handleUp);
                      };
                      document.addEventListener("mousemove", handleMove);
                      document.addEventListener("mouseup", handleUp);
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className={styles.propertiesPanel}>
          {!selectedField ? (
            <div className={styles.propertiesEmpty}>
              <h3>⚙️ Properties</h3>
              <p>Select a field to edit</p>
            </div>
          ) : (
            <div className={styles.propertiesContent}>
              <div className={styles.sidebarHeader}>
                <h2>⚙️ Properties</h2>
                <p>{selectedField.type} field</p>
              </div>

              <div className={styles.propSection}>
                <h3>Basic Info</h3>
                <div className={styles.formGroup}>
                  <label>Label</label>
                  <input
                    type="text"
                    value={selectedField.label}
                    onChange={(e) => updateField({ ...selectedField, label: e.target.value })}
                  />
                </div>
                <div className={styles.checkbox}>
                  <input
                    type="checkbox"
                    id="required-check"
                    checked={selectedField.required}
                    onChange={(e) => updateField({ ...selectedField, required: e.target.checked })}
                  />
                  <label htmlFor="required-check">Required field</label>
                </div>
              </div>

              <div className={styles.propSection}>
                <h3>Styling</h3>
                <div className={styles.colorRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="bg-color">Background</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        id="bg-color"
                        type="color" 
                        value={selectedField.bgColor || "#ffffff"}
                        onChange={(e) => updateField({ ...selectedField, bgColor: e.target.value })}
                        style={{ width: '50px', height: '35px', cursor: 'pointer' }}
                      />
                      <input 
                        type="text" 
                        value={selectedField.bgColor || "#ffffff"}
                        onChange={(e) => updateField({ ...selectedField, bgColor: e.target.value })}
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.colorRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="line-color">Border</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        id="line-color"
                        type="color" 
                        value={selectedField.lineColor || "#000000"}
                        onChange={(e) => updateField({ ...selectedField, lineColor: e.target.value })}
                        style={{ width: '50px', height: '35px', cursor: 'pointer' }}
                      />
                      <input 
                        type="text" 
                        value={selectedField.lineColor || "#000000"}
                        onChange={(e) => updateField({ ...selectedField, lineColor: e.target.value })}
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.colorRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="text-color">Text</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        id="text-color"
                        type="color" 
                        value={selectedField.textColor || "#000000"}
                        onChange={(e) => updateField({ ...selectedField, textColor: e.target.value })}
                        style={{ width: '50px', height: '35px', cursor: 'pointer' }}
                      />
                      <input 
                        type="text" 
                        value={selectedField.textColor || "#000000"}
                        onChange={(e) => updateField({ ...selectedField, textColor: e.target.value })}
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.propSection}>
                <h3>Position & Size</h3>
                <div className={styles.gridRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="field-x">X</label>
                    <input 
                      id="field-x"
                      type="number" 
                      value={selectedField.x} 
                      onChange={(e) => updateField({ ...selectedField, x: Number(e.target.value) })} 
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="field-y">Y</label>
                    <input 
                      id="field-y"
                      type="number" 
                      value={selectedField.y} 
                      onChange={(e) => updateField({ ...selectedField, y: Number(e.target.value) })} 
                    />
                  </div>
                </div>
                <div className={styles.gridRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="field-width">Width</label>
                    <input 
                      id="field-width"
                      type="number" 
                      value={selectedField.width} 
                      onChange={(e) => updateField({ ...selectedField, width: Number(e.target.value) })} 
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="field-height">Height</label>
                    <input 
                      id="field-height"
                      type="number" 
                      value={selectedField.height} 
                      onChange={(e) => updateField({ ...selectedField, height: Number(e.target.value) })} 
                    />
                  </div>
                </div>
              </div>

              {(selectedField.type === "radio" || selectedField.type === "select") && (
                <div className={styles.propSection}>
                  <h3>Options</h3>
                  <div className={styles.optionsList}>
                    {selectedField.options?.map((opt, i) => (
                      <div key={i} className={styles.optionItem}>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...(selectedField.options || [])];
                            newOptions[i] = e.target.value;
                            updateField({ ...selectedField, options: newOptions });
                          }}
                        />
                        <button onClick={() => {
                          const newOptions = selectedField.options?.filter((_, idx) => idx !== i);
                          updateField({ ...selectedField, options: newOptions });
                        }}>✕</button>
                      </div>
                    ))}
                  </div>
                  <button className={styles.addOptionBtn} onClick={() => {
                    const newOptions = [...(selectedField.options || []), `Option ${(selectedField.options?.length || 0) + 1}`];
                    updateField({ ...selectedField, options: newOptions });
                  }}>+ Add Option</button>
                </div>
              )}

              <div className={styles.propSection}>
                <button
                  className={styles.toolBtn}
                  style={{ width: "100%", background: "#ef4444", color: "white", border: "none" }}
                  onClick={deleteField}
                >
                  🗑️ Delete Field
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
