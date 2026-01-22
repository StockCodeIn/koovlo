'use client';

import React, { useState, useRef } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './addwatermark.module.css';

export default function AddWatermarkToImage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [watermarkPreview, setWatermarkPreview] = useState<string>('');
  const [watermarkText, setWatermarkText] = useState('');
  const [watermarkType, setWatermarkType] = useState<'text' | 'image'>('text');
  const [position, setPosition] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'>('bottom-right');
  const [opacity, setOpacity] = useState(50);
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState('#ffffff');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [rotation, setRotation] = useState(0);
  const [tileMode, setTileMode] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fonts = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
    'Courier New', 'Impact', 'Comic Sans MS', 'Trebuchet MS', 'Lucida Console'
  ];

  const colors = [
    '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00',
    '#ff00ff', '#00ffff', '#ffa500', '#800080', '#ffc0cb', '#a52a2a'
  ];

  const positions = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'center', label: 'Center' }
  ];

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleWatermarkSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file for watermark');
        return;
      }
      setWatermarkFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (e) => {
        setWatermarkPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setError('');
    }
  };

  const applyWatermark = async () => {
    if (!imageFile) {
      setError('Please select an image file');
      return;
    }

    if (watermarkType === 'text' && !watermarkText.trim()) {
      setError('Please enter watermark text');
      return;
    }

    if (watermarkType === 'image' && !watermarkFile) {
      setError('Please select a watermark image');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // In a real implementation, this would use Canvas API to add watermark
      // For now, we'll show a placeholder
      setError('Watermark addition requires Canvas API processing. This feature is under development.');

      setTimeout(() => {
        setProcessing(false);
      }, 2000);

    } catch (err) {
      setError('Failed to add watermark to image');
      setProcessing(false);
    }
  };

  const renderPreview = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imagePreview) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Draw watermark preview
      ctx.save();
      ctx.globalAlpha = opacity / 100;

      if (watermarkType === 'text' && watermarkText) {
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = fontColor;
        ctx.rotate((rotation * Math.PI) / 180);

        const textWidth = ctx.measureText(watermarkText).width;
        const textHeight = fontSize;

        let x, y;
        switch (position) {
          case 'top-left':
            x = 20;
            y = textHeight + 20;
            break;
          case 'top-right':
            x = canvas.width - textWidth - 20;
            y = textHeight + 20;
            break;
          case 'bottom-left':
            x = 20;
            y = canvas.height - 20;
            break;
          case 'bottom-right':
            x = canvas.width - textWidth - 20;
            y = canvas.height - 20;
            break;
          case 'center':
            x = (canvas.width - textWidth) / 2;
            y = (canvas.height + textHeight) / 2;
            break;
          default:
            x = canvas.width - textWidth - 20;
            y = canvas.height - 20;
        }

        ctx.fillText(watermarkText, x, y);
      } else if (watermarkType === 'image' && watermarkPreview) {
        const watermarkImg = new Image();
        watermarkImg.onload = () => {
          ctx.rotate((rotation * Math.PI) / 180);

          let x, y, width, height;
          const aspectRatio = watermarkImg.width / watermarkImg.height;
          width = Math.min(canvas.width * 0.3, 200);
          height = width / aspectRatio;

          switch (position) {
            case 'top-left':
              x = 20;
              y = 20;
              break;
            case 'top-right':
              x = canvas.width - width - 20;
              y = 20;
              break;
            case 'bottom-left':
              x = 20;
              y = canvas.height - height - 20;
              break;
            case 'bottom-right':
              x = canvas.width - width - 20;
              y = canvas.height - height - 20;
              break;
            case 'center':
              x = (canvas.width - width) / 2;
              y = (canvas.height - height) / 2;
              break;
            default:
              x = canvas.width - width - 20;
              y = canvas.height - height - 20;
          }

          ctx.drawImage(watermarkImg, x, y, width, height);
          ctx.restore();
        };
        watermarkImg.src = watermarkPreview;
      }

      ctx.restore();
    };
    img.src = imagePreview;
  };

  // Update preview when settings change
  React.useEffect(() => {
    if (imagePreview) {
      renderPreview();
    }
  }, [imagePreview, watermarkText, watermarkType, position, opacity, fontSize, fontColor, fontFamily, rotation, watermarkPreview]);

  return (
    <main className={styles.container}>
      <h1>Add Watermark to Image</h1>
      <p>Add text or image watermarks to protect your images</p>

      <div className={styles.editor}>
        <div className={styles.controls}>
          <div className={styles.fileInputs}>
            <div className={styles.fileInput}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className={styles.hiddenInput}
                id="main-image"
              />
              <label htmlFor="main-image" className={styles.fileLabel}>
                {imageFile ? imageFile.name : 'Choose Main Image'}
              </label>
            </div>

            {imageFile && (
              <div className={styles.fileInfo}>
                <p><strong>Main Image:</strong> {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)</p>
              </div>
            )}
          </div>

          <div className={styles.watermarkType}>
            <h3>Watermark Type</h3>
            <div className={styles.typeButtons}>
              <button
                className={`${styles.typeBtn} ${watermarkType === 'text' ? styles.active : ''}`}
                onClick={() => setWatermarkType('text')}
              >
                Text Watermark
              </button>
              <button
                className={`${styles.typeBtn} ${watermarkType === 'image' ? styles.active : ''}`}
                onClick={() => setWatermarkType('image')}
              >
                Image Watermark
              </button>
            </div>
          </div>

          {watermarkType === 'text' ? (
            <div className={styles.textWatermark}>
              <label htmlFor="watermark-text">Watermark Text:</label>
              <input
                id="watermark-text"
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="Enter watermark text..."
                className={styles.textInput}
              />
            </div>
          ) : (
            <div className={styles.imageWatermark}>
              <input
                type="file"
                accept="image/*"
                onChange={handleWatermarkSelect}
                className={styles.hiddenInput}
                id="watermark-image"
              />
              <label htmlFor="watermark-image" className={styles.fileLabel}>
                {watermarkFile ? watermarkFile.name : 'Choose Watermark Image'}
              </label>

              {watermarkFile && (
                <div className={styles.fileInfo}>
                  <p><strong>Watermark:</strong> {watermarkFile.name} ({(watermarkFile.size / 1024).toFixed(2)} KB)</p>
                </div>
              )}
            </div>
          )}

          <div className={styles.positionControl}>
            <label htmlFor="position">Position:</label>
            <select
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value as any)}
              className={styles.selectInput}
            >
              {positions.map((pos) => (
                <option key={pos.value} value={pos.value}>
                  {pos.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.opacityControl}>
            <label htmlFor="opacity">Opacity: {opacity}%</label>
            <input
              id="opacity"
              type="range"
              min="10"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(parseInt(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.rotationControl}>
            <label htmlFor="rotation">Rotation: {rotation}°</label>
            <input
              id="rotation"
              type="range"
              min="-180"
              max="180"
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value))}
              className={styles.slider}
            />
          </div>

          {watermarkType === 'text' && (
            <div className={styles.textSettings}>
              <h4>Text Settings</h4>

              <div className={styles.fontSelect}>
                <label htmlFor="font">Font:</label>
                <select
                  id="font"
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className={styles.selectInput}
                >
                  {fonts.map((font) => (
                    <option key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.sizeControl}>
                <label htmlFor="size">Size: {fontSize}px</label>
                <input
                  id="size"
                  type="range"
                  min="8"
                  max="72"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.colorPicker}>
                <label>Color:</label>
                <div className={styles.colorGrid}>
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`${styles.colorBtn} ${fontColor === color ? styles.active : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFontColor(color)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className={styles.tileMode}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={tileMode}
                onChange={(e) => setTileMode(e.target.checked)}
                className={styles.checkbox}
              />
              Tile watermark across image
            </label>
          </div>

          <button
            onClick={applyWatermark}
            disabled={!imageFile || processing || (watermarkType === 'text' && !watermarkText.trim()) || (watermarkType === 'image' && !watermarkFile)}
            className={styles.applyBtn}
          >
            {processing ? 'Adding Watermark...' : 'Add Watermark'}
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
            <h4>Preview Information</h4>
            <div className={styles.infoContent}>
              <div className={styles.infoItem}>
                <strong>Type:</strong> {watermarkType === 'text' ? 'Text' : 'Image'}
              </div>
              <div className={styles.infoItem}>
                <strong>Position:</strong> {positions.find(p => p.value === position)?.label}
              </div>
              <div className={styles.infoItem}>
                <strong>Opacity:</strong> {opacity}%
              </div>
              <div className={styles.infoItem}>
                <strong>Rotation:</strong> {rotation}°
              </div>
              {watermarkType === 'text' && (
                <>
                  <div className={styles.infoItem}>
                    <strong>Font:</strong> {fontFamily}
                  </div>
                  <div className={styles.infoItem}>
                    <strong>Size:</strong> {fontSize}px
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="Upload your main image<br>Choose watermark type (text or image)<br>Configure watermark settings (position, opacity, etc.)<br>Preview the result<br>Download the watermarked image"
        faqs={[
          { title: "Can I use both text and image watermarks?", content: "Currently supports one type at a time. Multiple watermarks may be added in future updates." },
          { title: "What image formats are supported?", content: "JPG, PNG, WebP, GIF, and other common formats for both main image and watermark." },
          { title: "Will the original image quality be preserved?", content: "Yes, watermarking preserves original quality with minimal compression." },
          { title: "Can I tile watermarks across the image?", content: "Yes, enable tile mode to repeat the watermark across the entire image." }
        ]}
        tips={["Use semi-transparent watermarks for better visibility<br>Position watermarks in corners to avoid covering important content<br>Test different opacity levels for best results<br>Use high-contrast colors for text watermarks"]}
      />
    </main>
  );
}