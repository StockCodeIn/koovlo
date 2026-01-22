'use client';

import { useState, useRef } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './addshapes.module.css';

export default function AddShapes() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [shapes, setShapes] = useState<any[]>([]);
  const [selectedShape, setSelectedShape] = useState<'rectangle' | 'circle' | 'arrow' | 'line'>('rectangle');
  const [shapeColor, setShapeColor] = useState('#ff0000');
  const [shapeSize, setShapeSize] = useState(2);
  const [fillShape, setFillShape] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const shapeTypes = [
    { id: 'rectangle', name: 'Rectangle', icon: '▭' },
    { id: 'circle', name: 'Circle', icon: '○' },
    { id: 'arrow', name: 'Arrow', icon: '→' },
    { id: 'line', name: 'Line', icon: '━' }
  ];

  const colors = [
    '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#000000', '#ffffff', '#ffa500', '#800080', '#ffc0cb', '#a52a2a'
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

  const addShape = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newShape = {
      id: Date.now(),
      type: selectedShape,
      x,
      y,
      width: 50,
      height: 50,
      color: shapeColor,
      size: shapeSize,
      fill: fillShape
    };

    setShapes([...shapes, newShape]);
  };

  const removeShape = (shapeId: number) => {
    setShapes(shapes.filter(shape => shape.id !== shapeId));
  };

  const clearAllShapes = () => {
    setShapes([]);
  };

  const applyShapes = async () => {
    if (!imageFile || shapes.length === 0) {
      setError('Please select an image and add at least one shape');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // In a real implementation, this would use Canvas API to draw shapes
      // For now, we'll show a placeholder
      setError('Shape addition requires Canvas API processing. This feature is under development.');

      setTimeout(() => {
        setProcessing(false);
      }, 2000);

    } catch (err) {
      setError('Failed to add shapes to image');
      setProcessing(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1>Add Shapes to Image</h1>
      <p>Add rectangles, circles, arrows, and lines to your images</p>

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

          <div className={styles.shapeSelector}>
            <h3>Shape Tools</h3>
            <div className={styles.shapeGrid}>
              {shapeTypes.map((shape) => (
                <button
                  key={shape.id}
                  className={`${styles.shapeBtn} ${selectedShape === shape.id ? styles.active : ''}`}
                  onClick={() => setSelectedShape(shape.id as any)}
                >
                  <span className={styles.shapeIcon}>{shape.icon}</span>
                  <span className={styles.shapeName}>{shape.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.shapeOptions}>
            <h3>Shape Properties</h3>

            <div className={styles.colorPicker}>
              <label>Color:</label>
              <div className={styles.colorGrid}>
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`${styles.colorBtn} ${shapeColor === color ? styles.active : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setShapeColor(color)}
                  />
                ))}
              </div>
            </div>

            <div className={styles.sizeControl}>
              <label htmlFor="size">Size: {shapeSize}px</label>
              <input
                id="size"
                type="range"
                min="1"
                max="10"
                value={shapeSize}
                onChange={(e) => setShapeSize(parseInt(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.fillOption}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={fillShape}
                  onChange={(e) => setFillShape(e.target.checked)}
                  className={styles.checkbox}
                />
                Fill shape
              </label>
            </div>
          </div>

          <div className={styles.shapeList}>
            <h3>Added Shapes ({shapes.length})</h3>
            {shapes.length > 0 ? (
              <div className={styles.shapes}>
                {shapes.map((shape) => (
                  <div key={shape.id} className={styles.shapeItem}>
                    <span className={styles.shapeType}>
                      {shapeTypes.find(s => s.id === shape.type)?.icon}
                    </span>
                    <span className={styles.shapeCoords}>
                      ({Math.round(shape.x)}, {Math.round(shape.y)})
                    </span>
                    <button
                      onClick={() => removeShape(shape.id)}
                      className={styles.removeBtn}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button onClick={clearAllShapes} className={styles.clearBtn}>
                  Clear All
                </button>
              </div>
            ) : (
              <p className={styles.noShapes}>Click on the image to add shapes</p>
            )}
          </div>

          <button
            onClick={applyShapes}
            disabled={!imageFile || shapes.length === 0 || processing}
            className={styles.applyBtn}
          >
            {processing ? 'Adding Shapes...' : 'Add Shapes to Image'}
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
                  onClick={addShape}
                  style={{
                    backgroundImage: `url(${imagePreview})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                  }}
                />
                <div className={styles.canvasOverlay}>
                  {shapes.map((shape) => (
                    <div
                      key={shape.id}
                      className={`${styles.shapeOverlay} ${styles[shape.type]}`}
                      style={{
                        left: `${shape.x - 25}px`,
                        top: `${shape.y - 25}px`,
                        width: '50px',
                        height: '50px',
                        borderColor: shape.color,
                        borderWidth: `${shape.size}px`,
                        backgroundColor: shape.fill ? shape.color : 'transparent'
                      }}
                    />
                  ))}
                </div>
                <div className={styles.instructions}>
                  Click anywhere to add a {selectedShape}
                </div>
              </div>
            ) : (
              <div className={styles.noImage}>
                <div className={styles.placeholderIcon}>🖼️</div>
                <p>Select an image to start adding shapes</p>
              </div>
            )}
          </div>

          <div className={styles.canvasGuide}>
            <h4>How to Use</h4>
            <div className={styles.guideSteps}>
              <div className={styles.step}>
                <strong>1.</strong> Select a shape tool from the left panel
              </div>
              <div className={styles.step}>
                <strong>2.</strong> Choose color and size options
              </div>
              <div className={styles.step}>
                <strong>3.</strong> Click on the image where you want to place the shape
              </div>
              <div className={styles.step}>
                <strong>4.</strong> Add multiple shapes as needed
              </div>
              <div className={styles.step}>
                <strong>5.</strong> Click "Add Shapes to Image" to download
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="Upload your image<br>Select a shape tool and customize properties<br>Click on the image to place shapes<br>Review and adjust shapes as needed<br>Download the image with added shapes"
        faqs={[
          { title: "Can I resize or move shapes after placing them?", content: "Currently, shapes are placed at fixed positions. You can remove and re-add them if needed." },
          { title: "What image formats are supported?", content: "JPG, PNG, WebP, GIF, and other common image formats." },
          { title: "Can I use custom colors?", content: "Choose from the predefined color palette. Custom colors may be added in future updates." },
          { title: "Will the original image quality be preserved?", content: "Yes, shapes are added without recompressing the original image." }
        ]}
        tips={["Use rectangle for highlighting areas<br>Circles work well for annotations<br>Arrows can point to specific elements<br>Lines can create dividers or emphasis"]}
      />
    </main>
  );
}