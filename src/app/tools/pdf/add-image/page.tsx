'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './addimage.module.css';

export default function AddImageToPDF() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [x, setX] = useState(100);
  const [y, setY] = useState(100);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [page, setPage] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const handlePdfSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setImageFile(selectedFile);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const addImageToPDF = async () => {
    if (!pdfFile || !imageFile) {
      setError('Please select both PDF and image files');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // In a real implementation, this would use pdf-lib
      // For now, we'll show a placeholder
      setError('PDF image addition requires pdf-lib. This feature is under development.');

      setTimeout(() => {
        setProcessing(false);
      }, 2000);

    } catch (err) {
      setError('Failed to add image to PDF');
      setProcessing(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1>Add Image to PDF</h1>
      <p>Add images to any page of your PDF document</p>

      <div className={styles.converter}>
        <div className={styles.inputSection}>
          <div className={styles.fileInputs}>
            <div className={styles.fileInput}>
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfSelect}
                className={styles.hiddenInput}
                id="pdf-file"
              />
              <label htmlFor="pdf-file" className={styles.fileLabel}>
                {pdfFile ? pdfFile.name : 'Choose PDF File'}
              </label>
            </div>

            <div className={styles.fileInput}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className={styles.hiddenInput}
                id="image-file"
              />
              <label htmlFor="image-file" className={styles.fileLabel}>
                {imageFile ? imageFile.name : 'Choose Image File'}
              </label>
            </div>
          </div>

          {(pdfFile || imageFile) && (
            <div className={styles.fileInfo}>
              {pdfFile && <p><strong>PDF:</strong> {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)</p>}
              {imageFile && <p><strong>Image:</strong> {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)</p>}
            </div>
          )}

          <div className={styles.options}>
            <div className={styles.optionGroup}>
              <label htmlFor="page">Page Number:</label>
              <input
                id="page"
                type="number"
                min="1"
                value={page}
                onChange={(e) => setPage(parseInt(e.target.value) || 1)}
                className={styles.numberInput}
              />
            </div>

            <div className={styles.optionGroup}>
              <label htmlFor="x">X Position:</label>
              <input
                id="x"
                type="number"
                min="0"
                value={x}
                onChange={(e) => setX(parseInt(e.target.value) || 0)}
                className={styles.numberInput}
              />
            </div>

            <div className={styles.optionGroup}>
              <label htmlFor="y">Y Position:</label>
              <input
                id="y"
                type="number"
                min="0"
                value={y}
                onChange={(e) => setY(parseInt(e.target.value) || 0)}
                className={styles.numberInput}
              />
            </div>

            <div className={styles.optionGroup}>
              <label htmlFor="width">Width:</label>
              <input
                id="width"
                type="number"
                min="10"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value) || 100)}
                className={styles.numberInput}
              />
            </div>

            <div className={styles.optionGroup}>
              <label htmlFor="height">Height:</label>
              <input
                id="height"
                type="number"
                min="10"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value) || 100)}
                className={styles.numberInput}
              />
            </div>
          </div>

          <button
            onClick={addImageToPDF}
            disabled={!pdfFile || !imageFile || processing}
            className={styles.convertBtn}
          >
            {processing ? 'Adding Image...' : 'Add Image to PDF'}
          </button>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        <div className={styles.previewSection}>
          <h3>Image Preview & Position</h3>

          <div className={styles.imagePreview}>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className={styles.previewImage} />
            ) : (
              <div className={styles.noImage}>
                <p>🖼️ Select an image to see preview</p>
              </div>
            )}
          </div>

          <div className={styles.positionPreview}>
            <h4>PDF Page Preview</h4>
            <div className={styles.pagePreview}>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Position preview"
                  className={styles.positionedImage}
                  style={{
                    left: `${Math.min(x, 300)}px`,
                    top: `${Math.min(y, 400)}px`,
                    width: `${Math.min(width, 200)}px`,
                    height: `${Math.min(height, 200)}px`
                  }}
                />
              )}
            </div>
          </div>

          <div className={styles.positionGuide}>
            <h4>Position Guide</h4>
            <p><strong>X, Y Position:</strong> Coordinates from bottom-left corner (points)</p>
            <p><strong>Width, Height:</strong> Image dimensions in points</p>
            <p><strong>Page:</strong> Page number where image will be added</p>
            <p><strong>A4 Size:</strong> 595 × 842 points</p>
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="Upload your PDF file and image<br>Set position (X, Y) and size (width, height)<br>Specify page number<br>Click 'Add Image to PDF' to download"
        faqs={[
          { title: "What image formats are supported?", content: "JPG, PNG, GIF, WebP, BMP, and other common image formats." },
          { title: "Can I add multiple images?", content: "Currently supports one image at a time. Use multiple times for different images." },
          { title: "What coordinate system is used?", content: "Points (72 points = 1 inch). Origin (0,0) is bottom-left corner." },
          { title: "Will image quality be preserved?", content: "Yes, images are embedded without recompression." }
        ]}
        tips={["Use the preview to position your image accurately<br>Consider PDF page size when setting dimensions<br>Test with smaller images first<br>Images are placed on top of existing content"]}
      />
    </main>
  );
}