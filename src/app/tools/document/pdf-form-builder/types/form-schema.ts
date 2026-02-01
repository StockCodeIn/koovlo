// types/form-schema.ts

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "checkbox"
  | "radio"
  | "select"
  | "date"
  | "signature";

/* ---------- Base Layout ---------- */
export interface FieldLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

/* ---------- Base Field ---------- */
export interface BaseField extends FieldLayout {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
}

/* ---------- Specific Fields ---------- */
export interface TextField extends BaseField {
  type: "text" | "textarea" | "number" | "date";
}

export interface ChoiceField extends BaseField {
  type: "radio" | "select";
  options: string[];
}

export interface CheckboxField extends BaseField {
  type: "checkbox";
}

export interface SignatureField extends BaseField {
  type: "signature";
}
/* ---------- Full Form Schema ---------- */

export interface PdfFormSchema {
  title?: string;
  page: {
    width: number;
    height: number;
  };
  fields: Array<{
    id: string;
    type: FieldType;
    label: string;
    required: boolean;

    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    };

    options?: string[];
    defaultValue?: string;
  }>;
}

/* ---------- Union ---------- */
export type FormField =
  | TextField
  | ChoiceField
  | CheckboxField
  | SignatureField;
