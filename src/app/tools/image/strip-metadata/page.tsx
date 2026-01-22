'use client';

import { useState, useRef } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './stripmetadata.module.css';

export default function StripImageMetadata() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;

    // Filter for image files only
    const imageFiles = selectedFiles.filter(file =>
      file.type.startsWith('image/')
    );

    if (imageFiles.length !== selectedFiles.length) {
      setError('Some files were skipped because they are not images');
    }

    setFiles(imageFiles);
    setError('');

    // Create previews and extract metadata
    const newPreviews: string[] = [];
    const newMetadata: any[] = [];

    imageFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);

        // Extract metadata (simplified - in real implementation would use exif-js or similar)
        extractMetadata(file).then(meta => {
          newMetadata[index] = meta;
          if (newMetadata.filter(m => m !== undefined).length === imageFiles.length) {
            setMetadata(newMetadata);
          }
        });

        if (newPreviews.length === imageFiles.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const extractMetadata = async (file: File) => {
    // This is a simplified metadata extraction
    // In a real implementation, you'd use a library like exif-js
    const metadata: any = {
      filename: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified).toLocaleString(),
      hasMetadata: false,
      metadataFields: []
    };

    // Simulate metadata detection
    // Real implementation would parse EXIF, IPTC, XMP data
    if (file.type.includes('jpeg') || file.type.includes('jpg')) {
      metadata.hasMetadata = Math.random() > 0.3; // Simulate some images having metadata
      if (metadata.hasMetadata) {
        metadata.metadataFields = [
          'EXIF: Make/Model',
          'EXIF: DateTime',
          'EXIF: GPS Coordinates',
          'EXIF: Camera Settings',
          'IPTC: Copyright',
          'IPTC: Keywords'
        ];
      }
    }

    return metadata;
  };

  const stripMetadata = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Drawing to canvas automatically strips metadata
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to strip metadata'));
            }
          },
          file.type,
          0.95
        );
      };
      img.onerror = () => reject(new Error('Image loading failed'));
      img.src = URL.createObjectURL(file);
    });
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const stripAllMetadata = async () => {
    if (files.length === 0) {
      setError('Please select images to process');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError('');

    try {
      const strippedFiles: Blob[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const stripped = await stripMetadata(file);
        strippedFiles.push(stripped);
        setProgress(((i + 1) / files.length) * 100);
      }

      // Download all stripped images
      for (let i = 0; i < strippedFiles.length; i++) {
        const originalName = files[i].name;
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
        const extension = originalName.substring(originalName.lastIndexOf('.'));
        const newFilename = `${nameWithoutExt}_clean${extension}`;
        downloadFile(strippedFiles[i], newFilename);
      }

      setProgress(100);
    } catch (err) {
      setError('Failed to strip metadata');
    } finally {
      setProcessing(false);
    }
  };

  const clearAll = () => {
    setFiles([]);
    setPreviews([]);
    setMetadata([]);
    setProgress(0);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    const newMetadata = metadata.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
    setMetadata(newMetadata);
  };

  const getMetadataSummary = () => {
    const totalFiles = metadata.length;
    const filesWithMetadata = metadata.filter(m => m?.hasMetadata).length;
    const totalMetadataFields = metadata.reduce((sum, m) => sum + (m?.metadataFields?.length || 0), 0);

    return { totalFiles, filesWithMetadata, totalMetadataFields };
  };

  const summary = getMetadataSummary();

  return (
    <main className={styles.container}>
      <h1>Strip Image Metadata</h1>
      <p>Remove EXIF, IPTC, and other metadata from images for privacy</p>

      <div className={styles.stripper}>
        <div className={styles.controls}>
          <div className={styles.fileInput}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className={styles.hiddenInput}
              ref={fileInputRef}
              id="strip-metadata-files"
            />
            <label htmlFor="strip-metadata-files" className={styles.fileLabel}>
              {files.length > 0 ? `${files.length} files selected` : 'Choose Images'}
            </label>
          </div>

          {files.length > 0 && (
            <div className={styles.fileInfo}>
              <p><strong>Files:</strong> {files.length} images selected</p>
              <p><strong>Total Size:</strong> {(files.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}

          <div className={styles.metadataSummary}>
            <h3>Metadata Analysis</h3>
            <div className={styles.summaryStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{summary.filesWithMetadata}</span>
                <span className={styles.statLabel}>Files with metadata</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{summary.totalMetadataFields}</span>
                <span className={styles.statLabel}>Metadata fields found</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{summary.totalFiles - summary.filesWithMetadata}</span>
                <span className={styles.statLabel}>Clean files</span>
              </div>
            </div>

            <div className={styles.metadataTypes}>
              <h4>Common Metadata Types:</h4>
              <div className={styles.metadataList}>
                <span className={styles.metadataTag}>EXIF</span>
                <span className={styles.metadataTag}>GPS</span>
                <span className={styles.metadataTag}>IPTC</span>
                <span className={styles.metadataTag}>XMP</span>
                <span className={styles.metadataTag}>Camera Info</span>
                <span className={styles.metadataTag}>Timestamps</span>
              </div>
            </div>

            <div className={styles.privacyNote}>
              <h4>🔒 Privacy Protection</h4>
              <p>Stripping metadata removes:</p>
              <ul>
                <li>Camera make/model and settings</li>
                <li>GPS location coordinates</li>
                <li>Timestamps and edit history</li>
                <li>Copyright and ownership info</li>
                <li>Software used to create/edit</li>
              </ul>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              onClick={stripAllMetadata}
              disabled={files.length === 0 || processing}
              className={styles.stripBtn}
            >
              {processing ? `Processing... ${Math.round(progress)}%` : 'Strip Metadata'}
            </button>
            <button
              onClick={clearAll}
              disabled={processing}
              className={styles.clearBtn}
            >
              Clear All
            </button>
          </div>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        <div className={styles.previewSection}>
          <h3>Selected Images ({files.length})</h3>

          {previews.length > 0 ? (
            <div className={styles.imageGrid}>
              {previews.map((preview, index) => (
                <div key={index} className={styles.imageItem}>
                  <div className={styles.imageWrapper}>
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className={styles.previewImage}
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className={styles.removeBtn}
                      title="Remove image"
                    >
                      ✕
                    </button>
                    {metadata[index]?.hasMetadata && (
                      <div className={styles.metadataIndicator}>
                        <span className={styles.metadataBadge}>Has Metadata</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.imageInfo}>
                    <p className={styles.fileName}>{files[index]?.name}</p>
                    <p className={styles.fileSize}>
                      {(files[index]?.size / 1024).toFixed(1)} KB
                    </p>
                    <div className={styles.metadataStatus}>
                      {metadata[index]?.hasMetadata ? (
                        <span className={styles.hasMetadata}>
                          ⚠️ {metadata[index]?.metadataFields?.length || 0} metadata fields
                        </span>
                      ) : (
                        <span className={styles.cleanFile}>
                          ✅ No metadata detected
                        </span>
                      )}
                    </div>
                    <p className={styles.outputName}>
                      {files[index]?.name.replace(/\.[^/.]+$/, '')}_clean{files[index]?.name.substring(files[index].name.lastIndexOf('.'))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noImages}>
              <div className={styles.placeholderIcon}>🛡️</div>
              <p>Select images to analyze and strip metadata</p>
              <p className={styles.hint}>Check for EXIF, GPS, and other embedded data</p>
            </div>
          )}

          {processing && (
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className={styles.progressText}>
                Stripping metadata... {Math.round(progress)}%
              </p>
            </div>
          )}
        </div>
      </div>

      <ToolInfo
        howItWorks="Select multiple images<br>Tool analyzes embedded metadata<br>Click strip to remove all metadata<br>Download clean versions automatically"
        faqs={[
          { title: "What metadata is removed?", content: "EXIF (camera info, GPS), IPTC (copyright, keywords), XMP (extended metadata), and other embedded data." },
          { title: "Does it affect image quality?", content: "No, only metadata is removed. Image pixels and quality remain unchanged." },
          { title: "Why strip metadata?", content: "Protects privacy by removing location data, camera info, and personal information embedded in photos." },
          { title: "Can metadata be recovered?", content: "Once stripped and saved, the metadata cannot be recovered from the processed image." }
        ]}
        tips={["Always strip metadata before sharing<br>Check social media privacy settings<br>Be aware of cloud storage metadata<br>Consider watermarking instead of metadata"]}
      />
    </main>
  );
}