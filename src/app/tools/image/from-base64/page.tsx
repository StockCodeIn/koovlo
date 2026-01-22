'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './frombase64.module.css';

export default function FromBase64Images() {
  const [base64Inputs, setBase64Inputs] = useState<string[]>(['']);
  const [fileNames, setFileNames] = useState<string[]>(['image.png']);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  const addInput = () => {
    setBase64Inputs([...base64Inputs, '']);
    setFileNames([...fileNames, `image${base64Inputs.length + 1}.png`]);
    setPreviews([...previews, '']);
    setErrors([...errors, '']);
  };

  const removeInput = (index: number) => {
    const newInputs = base64Inputs.filter((_, i) => i !== index);
    const newFileNames = fileNames.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    const newErrors = errors.filter((_, i) => i !== index);

    setBase64Inputs(newInputs);
    setFileNames(newFileNames);
    setPreviews(newPreviews);
    setErrors(newErrors);
  };

  const updateInput = (index: number, value: string) => {
    const newInputs = [...base64Inputs];
    newInputs[index] = value;
    setBase64Inputs(newInputs);

    // Clear error and preview when input changes
    const newErrors = [...errors];
    newErrors[index] = '';
    setErrors(newErrors);

    const newPreviews = [...previews];
    newPreviews[index] = '';
    setPreviews(newPreviews);

    // Try to validate and preview
    if (value.trim()) {
      validateAndPreview(value, index);
    }
  };

  const updateFileName = (index: number, name: string) => {
    const newFileNames = [...fileNames];
    newFileNames[index] = name;
    setFileNames(newFileNames);
  };

  const validateAndPreview = (base64String: string, index: number) => {
    try {
      // Remove data URL prefix if present
      let cleanBase64 = base64String.trim();

      if (cleanBase64.includes(',')) {
        cleanBase64 = cleanBase64.split(',')[1];
      }

      // Try to decode
      const binaryString = atob(cleanBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create blob and preview
      const blob = new Blob([bytes], { type: 'image/png' });
      const url = URL.createObjectURL(blob);

      const newPreviews = [...previews];
      newPreviews[index] = url;
      setPreviews(newPreviews);

      const newErrors = [...errors];
      newErrors[index] = '';
      setErrors(newErrors);

      return true;
    } catch (error) {
      const newErrors = [...errors];
      newErrors[index] = 'Invalid base64 string';
      setErrors(newErrors);

      const newPreviews = [...previews];
      newPreviews[index] = '';
      setPreviews(newPreviews);

      return false;
    }
  };

  const downloadImage = (base64String: string, fileName: string) => {
    try {
      let cleanBase64 = base64String.trim();

      if (cleanBase64.includes(',')) {
        cleanBase64 = cleanBase64.split(',')[1];
      }

      const binaryString = atob(cleanBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: 'image/png' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download image');
    }
  };

  const downloadAllValid = () => {
    const validInputs = base64Inputs
      .map((input, index) => ({ input, fileName: fileNames[index], index }))
      .filter(({ input, index }) => input.trim() && !errors[index]);

    if (validInputs.length === 0) {
      alert('No valid base64 strings to convert');
      return;
    }

    validInputs.forEach(({ input, fileName }) => {
      downloadImage(input, fileName);
    });
  };

  const clearAll = () => {
    setBase64Inputs(['']);
    setFileNames(['image.png']);
    setPreviews(['']);
    setErrors(['']);
  };

  const pasteFromClipboard = async (index: number) => {
    try {
      const text = await navigator.clipboard.readText();
      updateInput(index, text);
    } catch (error) {
      alert('Failed to read from clipboard');
    }
  };

  const getImageInfo = (base64String: string) => {
    try {
      let cleanBase64 = base64String.trim();
      let mimeType = 'image/png'; // default

      if (cleanBase64.includes(',')) {
        const parts = cleanBase64.split(',');
        const header = parts[0];
        cleanBase64 = parts[1];

        const mimeMatch = header.match(/data:([^;]+)/);
        if (mimeMatch) {
          mimeType = mimeMatch[1];
        }
      }

      const binaryString = atob(cleanBase64);
      const size = binaryString.length;

      return {
        mimeType,
        size: (size / 1024).toFixed(1) + ' KB',
        valid: true
      };
    } catch (error) {
      return { mimeType: 'unknown', size: '0 KB', valid: false };
    }
  };

  const validCount = base64Inputs.filter((input, index) => input.trim() && !errors[index]).length;
  const totalCount = base64Inputs.length;

  return (
    <main className={styles.container}>
      <h1>Base64 to Image Converter</h1>
      <p>Convert base64 strings to image files</p>

      <div className={styles.converter}>
        <div className={styles.controls}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{validCount}</span>
              <span className={styles.statLabel}>Valid</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{totalCount}</span>
              <span className={styles.statLabel}>Total</span>
            </div>
          </div>

          <div className={styles.actions}>
            <button onClick={addInput} className={styles.addBtn}>
              Add Another Image
            </button>
            <button
              onClick={downloadAllValid}
              disabled={validCount === 0}
              className={styles.downloadAllBtn}
            >
              Download All Valid ({validCount})
            </button>
            <button onClick={clearAll} className={styles.clearBtn}>
              Clear All
            </button>
          </div>

          <div className={styles.instructions}>
            <h3>How to use:</h3>
            <ul>
              <li>Paste your base64 string in the input field</li>
              <li>Set a filename for the output image</li>
              <li>Preview will appear automatically if valid</li>
              <li>Click download to save the image</li>
            </ul>
          </div>
        </div>

        <div className={styles.inputsSection}>
          <h3>Base64 Inputs</h3>

          <div className={styles.inputsList}>
            {base64Inputs.map((input, index) => (
              <div key={index} className={styles.inputItem}>
                <div className={styles.inputHeader}>
                  <span className={styles.inputNumber}>Image {index + 1}</span>
                  {base64Inputs.length > 1 && (
                    <button
                      onClick={() => removeInput(index)}
                      className={styles.removeBtn}
                      title="Remove this input"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor={`filename-${index}`}>Filename:</label>
                  <input
                    id={`filename-${index}`}
                    type="text"
                    value={fileNames[index]}
                    onChange={(e) => updateFileName(index, e.target.value)}
                    className={styles.filenameInput}
                    placeholder="image.png"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <div className={styles.inputLabelRow}>
                    <label htmlFor={`base64-${index}`}>Base64 String:</label>
                    <button
                      onClick={() => pasteFromClipboard(index)}
                      className={styles.pasteBtn}
                      title="Paste from clipboard"
                    >
                      📋 Paste
                    </button>
                  </div>
                  <textarea
                    id={`base64-${index}`}
                    value={input}
                    onChange={(e) => updateInput(index, e.target.value)}
                    className={`${styles.base64Input} ${errors[index] ? styles.error : ''}`}
                    placeholder="Paste your base64 string here..."
                    rows={4}
                  />
                  {errors[index] && <div className={styles.errorText}>{errors[index]}</div>}
                </div>

                {previews[index] && (
                  <div className={styles.preview}>
                    <h4>Preview:</h4>
                    <div className={styles.previewContent}>
                      <img
                        src={previews[index]}
                        alt={`Preview ${index + 1}`}
                        className={styles.previewImage}
                      />
                      <div className={styles.imageInfo}>
                        <div className={styles.infoItem}>
                          <strong>Type:</strong> {getImageInfo(input).mimeType}
                        </div>
                        <div className={styles.infoItem}>
                          <strong>Size:</strong> {getImageInfo(input).size}
                        </div>
                        <button
                          onClick={() => downloadImage(input, fileNames[index])}
                          className={styles.downloadBtn}
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="Paste base64 strings in input fields<br>Set filenames for output images<br>Previews appear for valid strings<br>Download individual or all valid images"
        faqs={[
          { title: "What is base64?", content: "Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format." },
          { title: "Can I include data URLs?", content: "Yes, the tool automatically handles data URLs (data:image/png;base64,...)." },
          { title: "What image formats are supported?", content: "Any image format that can be encoded as base64, including PNG, JPEG, GIF, WebP, etc." },
          { title: "Why is my base64 invalid?", content: "Check for missing padding (=), incorrect characters, or corrupted data." }
        ]}
        tips={["Use clipboard paste for convenience<br>Check previews before downloading<br>Valid base64 strings show green previews<br>Filename determines output format"]}
      />
    </main>
  );
}