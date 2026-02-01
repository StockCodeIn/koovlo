"use client";

import { FormField } from "../types/form-schema";

type Props = {
    field: FormField | null;
    onChange: (updated: FormField) => void;
};

export default function PropertiesPanel({ field, onChange }: Props) {
    if (!field) {
        return (
            <div style={panelStyle}>
                <h3>Properties</h3>
                <p style={{ color: "#6b7280" }}>Select a field to edit</p>
            </div>
        );
    }

    const update = <K extends keyof FormField>(
        key: K,
        value: FormField[K]
    ) => {
        onChange({ ...field, [key]: value });
    };

    return (
        <div style={panelStyle}>
            <h3>Field Properties</h3>

            {/* LABEL */}
            <label>Label</label>
            <input
                value={field.label}
                onChange={(e) => update("label", e.target.value)}
            />

            {/* REQUIRED */}
            <label style={{ marginTop: 12 }}>
                <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => update("required", e.target.checked)}
                />
                Required
            </label>

            {/* POSITION */}
            <Section title="Position">
                <NumberInput label="X" value={field.x} onChange={(v) => update("x", v)} />
                <NumberInput label="Y" value={field.y} onChange={(v) => update("y", v)} />
            </Section>

            {/* SIZE */}
            <Section title="Size">
                <NumberInput
                    label="Width"
                    value={field.width}
                    onChange={(v) => update("width", v)}
                />
                <NumberInput
                    label="Height"
                    value={field.height}
                    onChange={(v) => update("height", v)}
                />
            </Section>


            {/* OPTIONS */}
            {(field.type === "select" || field.type === "radio") && (
                <Section title="Options">
                    <textarea
                        value={field.options.join("\n")}
                        onChange={(e) =>
                            onChange({
                                ...field,
                                options: e.target.value.split("\n").filter(Boolean),
                            })
                        }
                        placeholder="One option per line"
                        rows={4}
                    />
                </Section>
            )}

        </div>
    );
}

/* ---------- helpers ---------- */

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div style={{ marginTop: 16 }}>
            <strong>{title}</strong>
            <div style={{ display: "grid", gap: 8 }}>{children}</div>
        </div>
    );
}

function NumberInput({
    label,
    value,
    onChange,
}: {
    label: string;
    value: number;
    onChange: (v: number) => void;
}) {
    return (
        <label style={{ display: "flex", gap: 8 }}>
            {label}
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                style={{ flex: 1 }}
            />
        </label>
    );
}

const panelStyle: React.CSSProperties = {
    width: 280,
    padding: 16,
    borderLeft: "1px solid #6481bb",
    background: "#fafafa",
    overflowY: "auto",
};
