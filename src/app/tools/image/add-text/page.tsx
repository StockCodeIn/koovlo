'use client';

import { useState, useRef } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './addtext.module.css';

export default function AddTextToImage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [textElements, setTextElements] = useState<any[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fonts = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
    'Courier New', 'Impact', 'Comic Sans MS', 'Trebuchet MS', 'Lucida Console'
  ];

  const colors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00',
    '#ff00ff', '#00ffff', '#ffa500', '#800080', '#ffc0cb', '#a52a2a'
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setError('');
    }
  };

  const addText = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!currentText.trim()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newTextElement = {
      id: Date.now(),
      text: currentText,
      x,
      y,
      fontSize,
      fontColor,
      fontFamily,
      isBold,
      isItalic,
      textAlign
    };

    setTextElements([...textElements, newTextElement]);
    setCurrentText('');
  };

  const removeText = (textId: number) => {
    setTextElements(textElements.filter(text => text.id !== textId));
  };

  const clearAllText = () => {
    setTextElements([]);
  };

  const applyText = async () => {
    if (!imageFile || textElements.length === 0) {
      setError('Please select an image and add at least one text element');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // In a real implementation, this would use Canvas API to draw text
      // For now, we'll show a placeholder
      setError('Text addition requires Canvas API processing. This feature is under development.');

      setTimeout(() => {
        setProcessing(false);
      }, 2000);

    } catch (err) {
      setError('Failed to add text to image');
      setProcessing(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1>Add Text to Image</h1>
      <p>Add customizable text overlays to your images</p>

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

          <div className={styles.textInput}>
            <label htmlFor="text">Text to Add:</label>
            <textarea
              id="text"
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              placeholder="Enter text to add to image..."
              className={styles.textTextarea}
              rows={3}
            />
            <div className={styles.textHint}>
              Click on the image to place this text
            </div>
          </div>

          <div className={styles.fontControls}>
            <h3>Font Settings</h3>

            <div className={styles.fontSelect}>
              <label htmlFor="font">Font Family:</label>
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
              <label htmlFor="size">Font Size: {fontSize}px</label>
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
              <label>Text Color:</label>
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

            <div className={styles.styleControls}>
              <div className={styles.styleGroup}>
                <button
                  className={`${styles.styleBtn} ${isBold ? styles.active : ''}`}
                  onClick={() => setIsBold(!isBold)}
                >
                  <strong>B</strong>
                </button>
                <button
                  className={`${styles.styleBtn} ${isItalic ? styles.active : ''}`}
                  onClick={() => setIsItalic(!isItalic)}
                >
                  <em>I</em>
                </button>
              </div>

              <div className={styles.alignGroup}>
                <button
                  className={`${styles.alignBtn} ${textAlign === 'left' ? styles.active : ''}`}
                  onClick={() => setTextAlign('left')}
                >
                  ⬅️
                </button>
                <button
                  className={`${styles.alignBtn} ${textAlign === 'center' ? styles.active : ''}`}
                  onClick={() => setTextAlign('center')}
                >
                  ⬌
                </button>
                <button
                  className={`${styles.alignBtn} ${textAlign === 'right' ? styles.active : ''}`}
                  onClick={() => setTextAlign('right')}
                >
                  ➡️
                </button>
              </div>
            </div>
          </div>

          <div className={styles.textList}>
            <h3>Added Text ({textElements.length})</h3>
            {textElements.length > 0 ? (
              <div className={styles.texts}>
                {textElements.map((text) => (
                  <div key={text.id} className={styles.textItem}>
                    <div className={styles.textPreview}>
                      <span
                        style={{
                          fontFamily: text.fontFamily,
                          fontSize: '14px',
                          fontWeight: text.isBold ? 'bold' : 'normal',
                          fontStyle: text.isItalic ? 'italic' : 'normal',
                          color: text.fontColor
                        }}
                      >
                        {text.text.length > 20 ? text.text.substring(0, 20) + '...' : text.text}
                      </span>
                    </div>
                    <button
                      onClick={() => removeText(text.id)}
                      className={styles.removeBtn}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button onClick={clearAllText} className={styles.clearBtn}>
                  Clear All
                </button>
              </div>
            ) : (
              <p className={styles.noText}>No text added yet</p>
            )}
          </div>

          <button
            onClick={applyText}
            disabled={!imageFile || textElements.length === 0 || processing}
            className={styles.applyBtn}
          >
            {processing ? 'Adding Text...' : 'Add Text to Image'}
          </button>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        <div className={styles.canvasSection}>
          <h3>Image Canvas</h3>

          <div className={styles.canvasContainer}>
            {imagePreview ? (
              <div className={styles.canvasWrapper}>
                <canvas
                  ref={canvasRef}
                  className={styles.canvas}
                  onClick={addText}
                  style={{
                    backgroundImage: `url(${imagePreview})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                  }}
                />
                <div className={styles.textOverlay}>
                  {textElements.map((text) => (
                    <div
                      key={text.id}
                      className={styles.textElement}
                      style={{
                        left: `${text.x}px`,
                        top: `${text.y}px`,
                        fontFamily: text.fontFamily,
                        fontSize: `${text.fontSize}px`,
                        color: text.fontColor,
                        fontWeight: text.isBold ? 'bold' : 'normal',
                        fontStyle: text.isItalic ? 'italic' : 'normal',
                        textAlign: text.textAlign
                      }}
                    >
                      {text.text}
                    </div>
                  ))}
                </div>
                <div className={styles.instructions}>
                  {currentText.trim() ? 'Click to place text' : 'Enter text above and click to place'}
                </div>
              </div>
            ) : (
              <div className={styles.noImage}>
                <div className={styles.placeholderIcon}>🖼️</div>
                <p>Select an image to start adding text</p>
              </div>
            )}
          </div>

          <div className={styles.previewGuide}>
            <h4>Text Preview Guide</h4>
            <div className={styles.guideContent}>
              <div className={styles.guideItem}>
                <strong>Live Preview:</strong> See how your text will look before applying
              </div>
              <div className={styles.guideItem}>
                <strong>Font Preview:</strong> Text list shows font and color samples
              </div>
              <div className={styles.guideItem}>
                <strong>Positioning:</strong> Click anywhere on the image to place text
              </div>
              <div className={styles.guideItem}>
                <strong>Multiple Texts:</strong> Add multiple text elements with different styles
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="Upload your image<br>Enter text and customize font settings<br>Click on the image to position the text<br>Add multiple text elements as needed<br>Download the image with added text"
        faqs={[
          { title: "Can I use custom fonts?", content: "Currently supports system fonts. Web fonts may be added in future updates." },
          { title: "Can I edit text after placing it?", content: "Currently, you can remove and re-add text. Direct editing may be added later." },
          { title: "What image formats are supported?", content: "JPG, PNG, WebP, GIF, and other common image formats." },
          { title: "Will the original image quality be preserved?", content: "Yes, text is added without recompressing the original image." }
        ]}
        tips={["Use larger font sizes for better visibility<br>Choose colors that contrast with your image<br>Position text carefully for best results<br>Preview before downloading"]}
      />
    </main>
  );
}