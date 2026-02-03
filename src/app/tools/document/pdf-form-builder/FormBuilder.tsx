"use client";

import { useState, useEffect } from "react";
import { FormField } from "./types/form-schema";
import { generateFillablePdf } from "./pdf/generatePdf";
import styles from "./pdf-form-builder.module.css";

// Pre-built templates
const TEMPLATES = [
  {
    id: "job-application",
    name: "Job Application",
    description: "Complete job application form",
    fields: [
      { id: "1", type: "text" as const, label: "Full Name", required: true, x: 50, y: 50, width: 400, height: 40 },
      { id: "2", type: "text" as const, label: "Email Address", required: true, x: 50, y: 100, width: 400, height: 40 },
      { id: "3", type: "text" as const, label: "Phone Number", required: true, x: 50, y: 150, width: 400, height: 40 },
      { id: "4", type: "text" as const, label: "Position Applied For", required: true, x: 50, y: 200, width: 400, height: 40 },
      { id: "5", type: "textarea" as const, label: "Previous Experience", required: false, x: 50, y: 250, width: 400, height: 100 },
      { id: "6", type: "select" as const, label: "Education Level", required: true, x: 50, y: 370, width: 400, height: 40, options: ["High School", "Bachelor's", "Master's", "PhD"] },
      { id: "7", type: "checkbox" as const, label: "I agree to terms and conditions", required: true, x: 50, y: 430, width: 300, height: 30 },
      { id: "8", type: "signature" as const, label: "Signature", required: true, x: 50, y: 480, width: 300, height: 80 },
    ]
  },
  {
    id: "contact-form",
    name: "Contact Form",
    description: "Simple contact information form",
    fields: [
      { id: "1", type: "text" as const, label: "Name", required: true, x: 50, y: 50, width: 400, height: 40 },
      { id: "2", type: "text" as const, label: "Email", required: true, x: 50, y: 100, width: 400, height: 40 },
      { id: "3", type: "text" as const, label: "Subject", required: true, x: 50, y: 150, width: 400, height: 40 },
      { id: "4", type: "textarea" as const, label: "Message", required: true, x: 50, y: 200, width: 400, height: 150 },
    ]
  },
  {
    id: "survey",
    name: "Customer Survey",
    description: "Feedback and rating form",
    fields: [
      { id: "1", type: "text" as const, label: "Your Name", required: false, x: 50, y: 50, width: 400, height: 40 },
      { id: "2", type: "radio" as const, label: "How satisfied are you?", required: true, x: 50, y: 100, width: 400, height: 120, options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"] },
      { id: "3", type: "checkbox" as const, label: "Would you recommend us?", required: false, x: 50, y: 240, width: 400, height: 30 },
      { id: "4", type: "textarea" as const, label: "Additional Comments", required: false, x: 50, y: 290, width: 400, height: 120 },
    ]
  },
  {
    id: "registration",
    name: "Event Registration",
    description: "Event registration form",
    fields: [
      { id: "1", type: "text" as const, label: "Full Name", required: true, x: 50, y: 50, width: 400, height: 40 },
      { id: "2", type: "text" as const, label: "Email", required: true, x: 50, y: 100, width: 400, height: 40 },
      { id: "3", type: "text" as const, label: "Organization", required: false, x: 50, y: 150, width: 400, height: 40 },
      { id: "4", type: "select" as const, label: "Ticket Type", required: true, x: 50, y: 200, width: 400, height: 40, options: ["Standard", "VIP", "Student"] },
      { id: "5", type: "checkbox" as const, label: "Vegetarian meal option", required: false, x: 50, y: 260, width: 400, height: 30 },
      { id: "6", type: "textarea" as const, label: "Special Requirements", required: false, x: 50, y: 310, width: 400, height: 100 },
    ]
  }
];

export default function FormBuilder() {
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formName, setFormName] = useState("My Form");

  // Auto-save to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("pdf-form-builder-data");
    if (saved) {
      const data = JSON.parse(saved);
      setFields(data.fields || []);
      setFormName(data.formName || "My Form");
    }
  }, []);

  useEffect(() => {
    if (fields.length > 0) {
      localStorage.setItem("pdf-form-builder-data", JSON.stringify({ fields, formName }));
    }
  }, [fields, formName]);

  const selectedField = fields.find((f) => f.id === selectedId) || null;

  const addField = (type: FormField["type"]) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `New ${type} field`,
      required: false,
      x: 50,
      y: 50 + fields.length * 60,
      width: type === "textarea" ? 400 : 300,
      height: type === "textarea" ? 100 : type === "signature" ? 80 : 40,
      ...(type === "select" || type === "radio" ? { options: ["Option 1", "Option 2"] } : {})
    };
    setFields((prev) => [...prev, newField]);
    setSelectedId(newField.id);
  };

  const updateField = (updated: FormField) => {
    setFields((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  };

  const deleteField = () => {
    if (selectedId) {
      setFields((prev) => prev.filter((f) => f.id !== selectedId));
      setSelectedId(null);
    }
  };

  const loadTemplate = (templateId: string) => {
    const template = TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setFields(template.fields);
      setFormName(template.name);
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
      const pdfBytes = await generateFillablePdf(fields, formName);
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
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
            style={{ minWidth: "200px" }}
          />
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
        {/* Left Sidebar - Templates & Fields */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>📋 Templates</h2>
            <p>Start with a template</p>
          </div>
          <div className={styles.sidebarContent}>
            <div className={styles.templatesSection}>
              <div className={styles.templateGrid}>
                {TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    className={styles.templateCard}
                    onClick={() => loadTemplate(template.id)}
                  >
                    <h4>{template.name}</h4>
                    <p>{template.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.sidebarHeader} style={{ marginTop: "20px" }}>
              <h2>🎨 Fields</h2>
              <p>Drag to canvas</p>
            </div>
            <div className={styles.fieldPalette}>
              <button className={styles.fieldBtn} onClick={() => addField("text")}>
                <div className={styles.fieldIcon}>📝</div>
                <div className={styles.fieldInfo}>
                  <h4>Text Input</h4>
                  <p>Single line text</p>
                </div>
              </button>
              <button className={styles.fieldBtn} onClick={() => addField("textarea")}>
                <div className={styles.fieldIcon}>📄</div>
                <div className={styles.fieldInfo}>
                  <h4>Text Area</h4>
                  <p>Multi-line text</p>
                </div>
              </button>
              <button className={styles.fieldBtn} onClick={() => addField("checkbox")}>
                <div className={styles.fieldIcon}>☑️</div>
                <div className={styles.fieldInfo}>
                  <h4>Checkbox</h4>
                  <p>Yes/No option</p>
                </div>
              </button>
              <button className={styles.fieldBtn} onClick={() => addField("radio")}>
                <div className={styles.fieldIcon}>🔘</div>
                <div className={styles.fieldInfo}>
                  <h4>Radio Group</h4>
                  <p>Select one option</p>
                </div>
              </button>
              <button className={styles.fieldBtn} onClick={() => addField("select")}>
                <div className={styles.fieldIcon}>📋</div>
                <div className={styles.fieldInfo}>
                  <h4>Dropdown</h4>
                  <p>Select from list</p>
                </div>
              </button>
              <button className={styles.fieldBtn} onClick={() => addField("signature")}>
                <div className={styles.fieldIcon}>✍️</div>
                <div className={styles.fieldInfo}>
                  <h4>Signature</h4>
                  <p>Sign here</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Center - Canvas */}
        <div className={styles.canvas}>
          <div className={styles.canvasPage}>
            {fields.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>👆 Start Building</h3>
                <p>Select a template or add fields from the left sidebar</p>
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
                  <div className={styles.fieldLabel}>
                    {field.label}
                    {field.required && <span className={styles.required}>*</span>}
                  </div>
                  <div className={styles.fieldPreview}>
                    {field.type === "text" && <input type="text" placeholder="Text input" style={{ width: "100%", padding: "4px" }} disabled />}
                    {field.type === "textarea" && <textarea placeholder="Text area" style={{ width: "100%", height: "60px", padding: "4px" }} disabled />}
                    {field.type === "checkbox" && <input type="checkbox" disabled />}
                    {field.type === "radio" && field.options?.map((opt, i) => (
                      <div key={i} style={{ fontSize: "0.85rem" }}>
                        <input type="radio" disabled /> {opt}
                      </div>
                    ))}
                    {field.type === "select" && (
                      <select style={{ width: "100%", padding: "4px" }} disabled>
                        {field.options?.map((opt, i) => <option key={i}>{opt}</option>)}
                      </select>
                    )}
                    {field.type === "signature" && (
                      <div style={{ border: "1px solid #ccc", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
                        Sign here
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
              <p>Select a field to edit its properties</p>
            </div>
          ) : (
            <div className={styles.propertiesContent}>
              <div className={styles.sidebarHeader}>
                <h2>⚙️ Field Properties</h2>
                <p>{selectedField.type} field</p>
              </div>

              <div className={styles.propSection}>
                <h3>Basic</h3>
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
                    checked={selectedField.required}
                    onChange={(e) => updateField({ ...selectedField, required: e.target.checked })}
                  />
                  <label>Required field</label>
                </div>
              </div>

              <div className={styles.propSection}>
                <h3>Position & Size</h3>
                <div className={styles.gridRow}>
                  <div className={styles.formGroup}>
                    <label>X</label>
                    <input type="number" value={selectedField.x} onChange={(e) => updateField({ ...selectedField, x: Number(e.target.value) })} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Y</label>
                    <input type="number" value={selectedField.y} onChange={(e) => updateField({ ...selectedField, y: Number(e.target.value) })} />
                  </div>
                </div>
                <div className={styles.gridRow}>
                  <div className={styles.formGroup}>
                    <label>Width</label>
                    <input type="number" value={selectedField.width} onChange={(e) => updateField({ ...selectedField, width: Number(e.target.value) })} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Height</label>
                    <input type="number" value={selectedField.height} onChange={(e) => updateField({ ...selectedField, height: Number(e.target.value) })} />
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
