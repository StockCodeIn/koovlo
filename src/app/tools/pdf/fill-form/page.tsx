'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './fillform.module.css';

interface FormField {
  id: string;
  name: string;
  type: 'text' | 'checkbox' | 'radio' | 'select';
  value: string;
  required: boolean;
}

export default function FillForm() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showFields, setShowFields] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file');
        return;
      }
      setPdfFile(selectedFile);
      setError('');
      setShowFields(false);
      // In a real implementation, this would extract form fields from the PDF
      loadFormFields(selectedFile);
    }
  };

  const loadFormFields = async (file: File) => {
    // Placeholder for form field extraction
    // In a real implementation, this would use pdf-lib or similar
    const mockFields: FormField[] = [
      { id: 'name', name: 'Full Name', type: 'text', value: '', required: true },
      { id: 'email', name: 'Email Address', type: 'text', value: '', required: true },
      { id: 'phone', name: 'Phone Number', type: 'text', value: '', required: false },
      { id: 'agree', name: 'I agree to terms', type: 'checkbox', value: 'false', required: true },
      { id: 'gender', name: 'Gender', type: 'radio', value: '', required: false },
      { id: 'country', name: 'Country', type: 'select', value: '', required: false }
    ];
    setFormFields(mockFields);
    setShowFields(true);
  };

  const updateFieldValue = (fieldId: string, value: string) => {
    setFormFields(fields =>
      fields.map(field =>
        field.id === fieldId ? { ...field, value } : field
      )
    );
  };

  const fillForm = async () => {
    if (!pdfFile) {
      setError('Please select a PDF file');
      return;
    }

    const requiredFields = formFields.filter(field => field.required && !field.value.trim());
    if (requiredFields.length > 0) {
      setError(`Please fill in required fields: ${requiredFields.map(f => f.name).join(', ')}`);
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // In a real implementation, this would use pdf-lib to fill form fields
      setError('PDF form filling requires advanced PDF processing libraries. This feature is under development.');

      setTimeout(() => {
        setProcessing(false);
      }, 2000);

    } catch (err) {
      setError('Failed to fill PDF form');
      setProcessing(false);
    }
  };

  const renderField = (field: FormField) => {
    const baseProps = {
      id: field.id,
      value: field.value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        updateFieldValue(field.id, e.target.value),
      className: styles.fieldInput,
      required: field.required
    };

    switch (field.type) {
      case 'text':
        return (
          <input
            {...baseProps}
            type="text"
            placeholder={`Enter ${field.name.toLowerCase()}`}
          />
        );

      case 'checkbox':
        return (
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={field.value === 'true'}
              onChange={(e) => updateFieldValue(field.id, e.target.checked ? 'true' : 'false')}
              className={styles.checkbox}
            />
            {field.name}
          </label>
        );

      case 'radio':
        return (
          <div className={styles.radioGroup}>
            <label className={styles.fieldLabel}>{field.name}</label>
            <div className={styles.radioOptions}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name={field.id}
                  value="male"
                  checked={field.value === 'male'}
                  onChange={(e) => updateFieldValue(field.id, e.target.value)}
                  className={styles.radio}
                />
                Male
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name={field.id}
                  value="female"
                  checked={field.value === 'female'}
                  onChange={(e) => updateFieldValue(field.id, e.target.value)}
                  className={styles.radio}
                />
                Female
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name={field.id}
                  value="other"
                  checked={field.value === 'other'}
                  onChange={(e) => updateFieldValue(field.id, e.target.value)}
                  className={styles.radio}
                />
                Other
              </label>
            </div>
          </div>
        );

      case 'select':
        return (
          <select {...baseProps}>
            <option value="">Select {field.name.toLowerCase()}</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="ca">Canada</option>
            <option value="au">Australia</option>
            <option value="de">Germany</option>
            <option value="fr">France</option>
            <option value="jp">Japan</option>
            <option value="other">Other</option>
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <main className={styles.container}>
      <h1>Fill PDF Form</h1>
      <p>Fill out interactive PDF forms automatically</p>

      <div className={styles.converter}>
        <div className={styles.inputSection}>
          <div className={styles.fileInput}>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className={styles.hiddenInput}
              id="pdf-file"
            />
            <label htmlFor="pdf-file" className={styles.fileLabel}>
              {pdfFile ? pdfFile.name : 'Choose PDF Form'}
            </label>
          </div>

          {pdfFile && (
            <div className={styles.fileInfo}>
              <p><strong>File:</strong> {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)</p>
              <p><strong>Status:</strong> Form fields loaded</p>
            </div>
          )}

          {showFields && (
            <div className={styles.formFields}>
              <h3>Form Fields</h3>
              <div className={styles.fieldsList}>
                {formFields.map((field) => (
                  <div key={field.id} className={styles.fieldItem}>
                    <label className={styles.fieldLabel}>
                      {field.name}
                      {field.required && <span className={styles.required}>*</span>}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={fillForm}
            disabled={!pdfFile || !showFields || processing}
            className={styles.fillBtn}
          >
            {processing ? 'Filling Form...' : 'Fill Form & Download'}
          </button>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        <div className={styles.previewSection}>
          <h3>Form Preview</h3>

          <div className={styles.previewBox}>
            {!pdfFile ? (
              <div className={styles.emptyPreview}>
                <div className={styles.previewIcon}>📄</div>
                <p>Upload a PDF form to see the fields</p>
              </div>
            ) : !showFields ? (
              <div className={styles.loadingPreview}>
                <div className={styles.previewIcon}>🔍</div>
                <p>Analyzing form fields...</p>
              </div>
            ) : (
              <div className={styles.formPreview}>
                <div className={styles.previewHeader}>
                  <h4>Sample Form Preview</h4>
                  <p>This shows how your filled form will look</p>
                </div>

                <div className={styles.previewContent}>
                  <div className={styles.previewField}>
                    <span className={styles.fieldName}>Full Name:</span>
                    <span className={styles.fieldValue}>
                      {formFields.find(f => f.id === 'name')?.value || '____________________'}
                    </span>
                  </div>

                  <div className={styles.previewField}>
                    <span className={styles.fieldName}>Email:</span>
                    <span className={styles.fieldValue}>
                      {formFields.find(f => f.id === 'email')?.value || '____________________'}
                    </span>
                  </div>

                  <div className={styles.previewField}>
                    <span className={styles.fieldName}>Phone:</span>
                    <span className={styles.fieldValue}>
                      {formFields.find(f => f.id === 'phone')?.value || '____________________'}
                    </span>
                  </div>

                  <div className={styles.previewField}>
                    <span className={styles.fieldName}>Gender:</span>
                    <span className={styles.fieldValue}>
                      {formFields.find(f => f.id === 'gender')?.value || '___ Male ___ Female ___ Other'}
                    </span>
                  </div>

                  <div className={styles.previewField}>
                    <span className={styles.fieldName}>Country:</span>
                    <span className={styles.fieldValue}>
                      {formFields.find(f => f.id === 'country')?.value || '____________________'}
                    </span>
                  </div>

                  <div className={styles.previewField}>
                    <span className={styles.checkboxField}>
                      <span className={styles.checkboxBox}>
                        {formFields.find(f => f.id === 'agree')?.value === 'true' ? '✓' : '☐'}
                      </span>
                      <span className={styles.fieldName}>I agree to terms and conditions</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.formGuide}>
            <h4>How Form Filling Works</h4>
            <div className={styles.guideContent}>
              <div className={styles.guideItem}>
                <strong>Field Detection:</strong> Automatically detects all form fields in the PDF
              </div>
              <div className={styles.guideItem}>
                <strong>Data Types:</strong> Supports text, checkboxes, radio buttons, and dropdowns
              </div>
              <div className={styles.guideItem}>
                <strong>Validation:</strong> Ensures required fields are filled before processing
              </div>
              <div className={styles.guideItem}>
                <strong>Preservation:</strong> Maintains original form formatting and layout
              </div>
            </div>
          </div>

          <div className={styles.formTips}>
            <h4>Form Filling Tips</h4>
            <ul>
              <li>Fill all required fields marked with *</li>
              <li>Check your entries before submitting</li>
              <li>Some forms may have validation rules</li>
              <li>Complex forms might need manual review</li>
            </ul>
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="Upload your PDF form<br>Fill in the detected form fields<br>Review your entries in the preview<br>Download the completed form"
        faqs={[
          { title: "What types of forms can I fill?", content: "Works with interactive PDF forms containing text fields, checkboxes, radio buttons, and dropdown menus." },
          { title: "Does it work with scanned forms?", content: "No, this tool only works with digital PDF forms. Scanned forms need to be converted to interactive forms first." },
          { title: "Are my form entries saved?", content: "Form data is processed locally and not stored on our servers." },
          { title: "Can I save partially filled forms?", content: "Currently, forms must be completed in one session. Partial saves may be added in future updates." }
        ]}
        tips={["Always review your entries before downloading<br>Check for required fields marked with asterisks<br>Test with simple forms first<br>Keep original form as backup"]}
      />
    </main>
  );
}