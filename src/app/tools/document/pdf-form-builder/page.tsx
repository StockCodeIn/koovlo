// /tools/document/pdf-form-builder/page.tsx
"use client";

import FormBuilder from "./FormBuilder";
import styles from './pdf-form-builder.module.css';

export default function PdfFormBuilderPage() {
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>📝 PDF Form Builder</h1>
          <p>Create professional fillable PDF forms in minutes - 100% Free!</p>
        </div>
      </header>
      <FormBuilder />
    </main>
  );
}

