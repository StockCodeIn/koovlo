'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './flattenform.module.css';

export default function FlattenForm() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [flattenOptions, setFlattenOptions] = useState({
    removeFormFields: true,
    preserveAppearance: true,
    optimizeSize: false
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file');
        return;
      }
      setPdfFile(selectedFile);
      setError('');
    }
  };

  const flattenForm = async () => {
    if (!pdfFile) {
      setError('Please select a PDF file');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // In a real implementation, this would use pdf-lib to flatten form fields
      setError('PDF form flattening requires advanced PDF processing libraries. This feature is under development.');

      setTimeout(() => {
        setProcessing(false);
      }, 2000);

    } catch (err) {
      setError('Failed to flatten PDF form');
      setProcessing(false);
    }
  };

  const updateOption = (option: keyof typeof flattenOptions, value: boolean) => {
    setFlattenOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  return (
    <main className={styles.container}>
      <h1>Flatten PDF Form</h1>
      <p>Convert interactive PDF forms to static, non-editable documents</p>

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
              <p><strong>Type:</strong> Interactive Form</p>
            </div>
          )}

          <div className={styles.flattenOptions}>
            <h3>Flattening Options</h3>

            <div className={styles.optionGroup}>
              <div className={styles.option}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={flattenOptions.removeFormFields}
                    onChange={(e) => updateOption('removeFormFields', e.target.checked)}
                    className={styles.checkbox}
                  />
                  <div className={styles.optionContent}>
                    <strong>Remove Form Fields</strong>
                    <p>Completely remove interactive form elements after flattening</p>
                  </div>
                </label>
              </div>

              <div className={styles.option}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={flattenOptions.preserveAppearance}
                    onChange={(e) => updateOption('preserveAppearance', e.target.checked)}
                    className={styles.checkbox}
                  />
                  <div className={styles.optionContent}>
                    <strong>Preserve Visual Appearance</strong>
                    <p>Maintain the exact look of filled form fields</p>
                  </div>
                </label>
              </div>

              <div className={styles.option}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={flattenOptions.optimizeSize}
                    onChange={(e) => updateOption('optimizeSize', e.target.checked)}
                    className={styles.checkbox}
                  />
                  <div className={styles.optionContent}>
                    <strong>Optimize File Size</strong>
                    <p>Compress the PDF to reduce file size (may affect quality)</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={flattenForm}
            disabled={!pdfFile || processing}
            className={styles.flattenBtn}
          >
            {processing ? 'Flattening Form...' : 'Flatten Form & Download'}
          </button>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        <div className={styles.previewSection}>
          <h3>Flattening Preview</h3>

          <div className={styles.previewBox}>
            {!pdfFile ? (
              <div className={styles.emptyPreview}>
                <div className={styles.previewIcon}>📄</div>
                <p>Upload a PDF form to see the flattening preview</p>
              </div>
            ) : (
              <div className={styles.formComparison}>
                <div className={styles.beforeAfter}>
                  <div className={styles.before}>
                    <h4>Before Flattening</h4>
                    <div className={styles.mockForm}>
                      <div className={styles.formField}>
                        <label>Name:</label>
                        <div className={styles.interactiveField}>[Interactive Field]</div>
                      </div>
                      <div className={styles.formField}>
                        <label>Email:</label>
                        <div className={styles.interactiveField}>[Interactive Field]</div>
                      </div>
                      <div className={styles.formField}>
                        <label>☐ Agree to terms</label>
                      </div>
                      <div className={styles.formField}>
                        <label>○ Male ○ Female</label>
                      </div>
                    </div>
                    <div className={styles.formStatus}>
                      <span className={styles.statusBadge}>Interactive</span>
                    </div>
                  </div>

                  <div className={styles.arrow}>→</div>

                  <div className={styles.after}>
                    <h4>After Flattening</h4>
                    <div className={styles.mockForm}>
                      <div className={styles.formField}>
                        <label>Name:</label>
                        <div className={styles.staticField}>John Doe</div>
                      </div>
                      <div className={styles.formField}>
                        <label>Email:</label>
                        <div className={styles.staticField}>john@example.com</div>
                      </div>
                      <div className={styles.formField}>
                        <label>✓ Agree to terms</label>
                      </div>
                      <div className={styles.formField}>
                        <label>• Male</label>
                      </div>
                    </div>
                    <div className={styles.formStatus}>
                      <span className={styles.statusBadge}>Static</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.flattenGuide}>
            <h4>What Happens During Flattening</h4>
            <div className={styles.guideContent}>
              <div className={styles.guideItem}>
                <strong>Interactive → Static:</strong> Converts fillable fields to permanent text/images
              </div>
              <div className={styles.guideItem}>
                <strong>Data Preservation:</strong> All entered data becomes part of the document
              </div>
              <div className={styles.guideItem}>
                <strong>Security:</strong> Prevents further editing of form contents
              </div>
              <div className={styles.guideItem}>
                <strong>Compatibility:</strong> Works with all PDF viewers and printers
              </div>
            </div>
          </div>

          <div className={styles.flattenTips}>
            <h4>When to Use Form Flattening</h4>
            <ul>
              <li>Before sending completed forms to recipients</li>
              <li>When you want to prevent further editing</li>
              <li>For archival purposes</li>
              <li>To ensure consistent display across devices</li>
              <li>Before printing or sharing sensitive forms</li>
            </ul>
          </div>

          <div className={styles.warning}>
            <div className={styles.warningIcon}>⚠️</div>
            <div className={styles.warningContent}>
              <strong>Important:</strong> Flattening is irreversible. Make sure all form data is correct before flattening, as fields can no longer be edited.
            </div>
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="Upload your filled PDF form<br>Choose flattening options<br>Click 'Flatten Form' to convert<br>Download the static PDF"
        faqs={[
          { title: "Can I still edit a flattened form?", content: "No, flattening converts interactive fields to static content. The form becomes non-editable." },
          { title: "Does flattening change the appearance?", content: "With 'Preserve Appearance' enabled, the visual look remains the same, but fields become uneditable." },
          { title: "Will file size change?", content: "File size may decrease slightly if form fields are removed, or you can choose to optimize further." },
          { title: "Can I flatten partially filled forms?", content: "Yes, but empty fields will appear as blank spaces in the final document." }
        ]}
        tips={["Always backup your original interactive form<br>Review all entries before flattening<br>Use for final versions only<br>Consider printing as additional backup"]}
      />
    </main>
  );
}