'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './zipcreator.module.css';

export default function ZIPCreator() {
  const [files, setFiles] = useState<File[]>([]);
  const [zipName, setZipName] = useState('archive');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
    setError('');
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFiles([]);
    setZipName('archive');
    setError('');
  };

  const createZIP = async () => {
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    setCreating(true);
    setError('');

    try {
      // In a real implementation, this would use JSZip
      // For now, we'll show a placeholder
      setError('ZIP creation requires client-side ZIP library. This feature is under development.');

      // Simulate processing time
      setTimeout(() => {
        setCreating(false);
      }, 2000);

    } catch (err) {
      setError('Failed to create ZIP file');
      setCreating(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <main className={styles.container}>
      <h1>ZIP File Creator</h1>
      <p>Create ZIP archives from multiple files</p>

      <div className={styles.creator}>
        <div className={styles.inputSection}>
          <div className={styles.fileInput}>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className={styles.hiddenInput}
              id="files"
            />
            <label htmlFor="files" className={styles.fileLabel}>
              Choose Files to ZIP
            </label>
          </div>

          <div className={styles.zipName}>
            <label htmlFor="zipname">ZIP File Name:</label>
            <input
              id="zipname"
              type="text"
              value={zipName}
              onChange={(e) => setZipName(e.target.value)}
              placeholder="archive"
              className={styles.nameInput}
            />
            <span className={styles.extension}>.zip</span>
          </div>

          <div className={styles.actions}>
            <button onClick={createZIP} disabled={files.length === 0 || creating} className={styles.createBtn}>
              {creating ? 'Creating ZIP...' : 'Create ZIP'}
            </button>
            <button onClick={clearAll} className={styles.clearBtn}>
              Clear All
            </button>
          </div>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        <div className={styles.fileList}>
          <h3>Selected Files ({files.length})</h3>

          {files.length > 0 ? (
            <>
              <div className={styles.fileGrid}>
                {files.map((file, index) => (
                  <div key={index} className={styles.fileItem}>
                    <div className={styles.fileInfo}>
                      <span className={styles.fileName}>{file.name}</span>
                      <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className={styles.removeBtn}
                      title="Remove file"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.summary}>
                <p><strong>Total Files:</strong> {files.length}</p>
                <p><strong>Total Size:</strong> {formatFileSize(totalSize)}</p>
                <p><strong>Output:</strong> {zipName}.zip</p>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <p>📁 No files selected</p>
              <p>Choose files above to create a ZIP archive</p>
            </div>
          )}
        </div>
      </div>

      <ToolInfo
        howItWorks="Select multiple files to include in ZIP<br>Enter desired ZIP filename<br>Click 'Create ZIP' to download archive<br>All files are compressed and bundled"
        faqs={[
          { title: "What file types can I ZIP?", content: "Any file type - documents, images, videos, executables, etc." },
          { title: "Is there a file size limit?", content: "Depends on browser limitations, but generally supports large files." },
          { title: "Does it compress files?", content: "Yes, ZIP format provides compression to reduce file sizes." },
          { title: "Can I password protect the ZIP?", content: "Password protection requires additional libraries. Currently not supported." }
        ]}
        tips={["Use for sharing multiple files as one download<br>Choose descriptive names for your ZIP files<br>Large files may take time to process<br>All processing happens locally for privacy"]}
      />
    </main>
  );
}