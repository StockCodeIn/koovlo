'use client';

import React, { useState, useRef } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './border.module.css';

export default function AddBorderToImage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [borderWidth, setBorderWidth] = useState(10);
  const [borderColor, setBorderColor] = useState('#000000');
  const [borderStyle, setBorderStyle] = useState<'solid' | 'dashed' | 'dotted'>('solid');
  const [cornerRadius, setCornerRadius] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00',
    '#ff00ff', '#00ffff', '#ffa500', '#800080', '#ffc0cb', '#a52a2a'
  ];

  const borderStyles = [
    { value: 'solid', label: 'Solid' },
    { value: 'dashed', label: 'Dashed' },
    { value: 'dotted', label: 'Dotted' }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setImageFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setError('');
    }
  };

  const updatePreview = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imagePreview) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Calculate canvas size with border
      const canvasWidth = img.width + (borderWidth * 2);
      const canvasHeight = img.height + (borderWidth * 2);

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Fill background with border color
      ctx.fillStyle = borderColor;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Draw inner rectangle for image area
      if (cornerRadius > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(borderWidth, borderWidth, img.width, img.height, cornerRadius);
        ctx.clip();
      }

      ctx.drawImage(img, borderWidth, borderWidth, img.width, img.height);

      if (cornerRadius > 0) {
        ctx.restore();
      }

      // Draw border
      if (borderWidth > 0) {
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderWidth;

        switch (borderStyle) {
          case 'dashed':
            ctx.setLineDash([borderWidth * 2, borderWidth]);
            break;
          case 'dotted':
            ctx.setLineDash([borderWidth, borderWidth]);
            break;
          default:
            ctx.setLineDash([]);
        }

        ctx.beginPath();
        if (cornerRadius > 0) {
          ctx.roundRect(borderWidth / 2, borderWidth / 2, canvasWidth - borderWidth, canvasHeight - borderWidth, cornerRadius);
        } else {
          ctx.rect(borderWidth / 2, borderWidth / 2, canvasWidth - borderWidth, canvasHeight - borderWidth);
        }
        ctx.stroke();
      }
    };
    img.src = imagePreview;
  };

  React.useEffect(() => {
    updatePreview();
  }, [imagePreview, borderWidth, borderColor, borderStyle, cornerRadius]);

  const applyBorder = async () => {
    if (!imageFile) {
      setError('Please select an image file');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // In a real implementation, this would use Canvas API to add border and download
      // For now, we'll show a placeholder
      setError('Border addition requires Canvas API processing. This feature is under development.');

      setTimeout(() => {
        setProcessing(false);
      }, 2000);

    } catch (err) {
      setError('Failed to add border to image');
      setProcessing(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1>Add Border to Image</h1>
      <p>Add customizable borders to your images</p>

      <div className={styles.editor}>
        <div className={styles.controls}>
          <div className={styles.fileInput}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className={styles.hiddenInput}
              id="image-file"
            />
            <label htmlFor="image-file" className={styles.fileLabel}>
              {imageFile ? imageFile.name : 'Choose Image File'}
            </label>
          </div>

          {imageFile && (
            <div className={styles.fileInfo}>
              <p><strong>File:</strong> {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)</p>
            </div>
          )}

          <div className={styles.borderSettings}>
            <h3>Border Settings</h3>

            <div className={styles.widthControl}>
              <label htmlFor="width">Border Width: {borderWidth}px</label>
              <input
                id="width"
                type="range"
                min="1"
                max="50"
                value={borderWidth}
                onChange={(e) => setBorderWidth(parseInt(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.colorPicker}>
              <label>Border Color:</label>
              <div className={styles.colorGrid}>
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`${styles.colorBtn} ${borderColor === color ? styles.active : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setBorderColor(color)}
                  />
                ))}
              </div>
            </div>

            <div className={styles.styleControl}>
              <label htmlFor="style">Border Style:</label>
              <select
                id="style"
                value={borderStyle}
                onChange={(e) => setBorderStyle(e.target.value as any)}
                className={styles.selectInput}
              >
                {borderStyles.map((style) => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.radiusControl}>
              <label htmlFor="radius">Corner Radius: {cornerRadius}px</label>
              <input
                id="radius"
                type="range"
                min="0"
                max="50"
                value={cornerRadius}
                onChange={(e) => setCornerRadius(parseInt(e.target.value))}
                className={styles.slider}
              />
            </div>
          </div>

          <div className={styles.presets}>
            <h3>Quick Presets</h3>
            <div className={styles.presetGrid}>
              <button
                className={styles.presetBtn}
                onClick={() => {
                  setBorderWidth(5);
                  setBorderColor('#000000');
                  setBorderStyle('solid');
                  setCornerRadius(0);
                }}
              >
                Thin Black
              </button>
              <button
                className={styles.presetBtn}
                onClick={() => {
                  setBorderWidth(15);
                  setBorderColor('#ffffff');
                  setBorderStyle('solid');
                  setCornerRadius(10);
                }}
              >
                Thick White
              </button>
              <button
                className={styles.presetBtn}
                onClick={() => {
                  setBorderWidth(10);
                  setBorderColor('#ff0000');
                  setBorderStyle('dashed');
                  setCornerRadius(0);
                }}
              >
                Red Dashed
              </button>
              <button
                className={styles.presetBtn}
                onClick={() => {
                  setBorderWidth(8);
                  setBorderColor('#007bff');
                  setBorderStyle('solid');
                  setCornerRadius(20);
                }}
              >
                Blue Rounded
              </button>
            </div>
          </div>

          <button
            onClick={applyBorder}
            disabled={!imageFile || processing}
            className={styles.applyBtn}
          >
            {processing ? 'Adding Border...' : 'Add Border to Image'}
          </button>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        <div className={styles.previewSection}>
          <h3>Preview</h3>

          <div className={styles.canvasContainer}>
            {imagePreview ? (
              <canvas
                ref={canvasRef}
                className={styles.canvas}
              />
            ) : (
              <div className={styles.noImage}>
                <div className={styles.placeholderIcon}>🖼️</div>
                <p>Select an image to see preview</p>
              </div>
            )}
          </div>

          <div className={styles.previewInfo}>
            <h4>Border Preview Info</h4>
            <div className={styles.infoContent}>
              <div className={styles.infoItem}>
                <strong>Width:</strong> {borderWidth}px
              </div>
              <div className={styles.infoItem}>
                <strong>Color:</strong> <span style={{ color: borderColor }}>{borderColor}</span>
              </div>
              <div className={styles.infoItem}>
                <strong>Style:</strong> {borderStyles.find(s => s.value === borderStyle)?.label}
              </div>
              <div className={styles.infoItem}>
                <strong>Corner Radius:</strong> {cornerRadius}px
              </div>
            </div>
          </div>

          <div className={styles.borderGuide}>
            <h4>Border Style Guide</h4>
            <div className={styles.guideContent}>
              <div className={styles.guideItem}>
                <strong>Solid:</strong> Continuous border line
              </div>
              <div className={styles.guideItem}>
                <strong>Dashed:</strong> Dashed line pattern
              </div>
              <div className={styles.guideItem}>
                <strong>Dotted:</strong> Dotted line pattern
              </div>
              <div className={styles.guideItem}>
                <strong>Corner Radius:</strong> Rounds the image corners
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="Upload your image<br>Adjust border width, color, and style<br>Set corner radius for rounded corners<br>Preview the result in real-time<br>Download the bordered image"
        faqs={[
          { title: "Will the border increase the image file size?", content: "Yes, borders add to the overall image dimensions and may slightly increase file size." },
          { title: "Can I use custom colors?", content: "Currently supports predefined colors. Custom color picker may be added later." },
          { title: "What image formats are supported?", content: "JPG, PNG, WebP, GIF, and other common image formats." },
          { title: "Will the original image quality be preserved?", content: "Yes, borders are added without recompressing the original image." }
        ]}
        tips={["Use white borders for dark images and black borders for light images<br>Thin borders (1-5px) work well for most photos<br>Rounded corners give a modern, polished look<br>Preview different styles before downloading"]}
      />
    </main>
  );
}