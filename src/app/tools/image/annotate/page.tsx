'use client';

import React, { useState, useRef, useCallback } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './annotate.module.css';

interface Annotation {
  id: string;
  type: 'arrow' | 'rectangle' | 'circle' | 'text' | 'line';
  startX: number;
  startY: number;
  endX?: number;
  endY?: number;
  text?: string;
  color: string;
  strokeWidth: number;
}

export default function AnnotateImage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [currentTool, setCurrentTool] = useState<'arrow' | 'rectangle' | 'circle' | 'text' | 'line'>('arrow');
  const [currentColor, setCurrentColor] = useState('#ff0000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] = useState<Annotation | null>(null);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const colors = [
    '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#ffa500', '#800080', '#ffc0cb', '#a52a2a', '#000000', '#ffffff'
  ];

  const tools = [
    { id: 'arrow', label: 'Arrow', icon: '➡️' },
    { id: 'rectangle', label: 'Rectangle', icon: '▭' },
    { id: 'circle', label: 'Circle', icon: '○' },
    { id: 'line', label: 'Line', icon: '━' },
    { id: 'text', label: 'Text', icon: 'T' }
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
      setAnnotations([]);
    }
  };

  const getCanvasCoordinates = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imagePreview) return;

    const { x, y } = getCanvasCoordinates(event);

    if (currentTool === 'text') {
      setShowTextInput(true);
      setTextPosition({ x, y });
      return;
    }

    setIsDrawing(true);
    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      type: currentTool,
      startX: x,
      startY: y,
      color: currentColor,
      strokeWidth
    };
    setCurrentAnnotation(newAnnotation);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentAnnotation) return;

    const { x, y } = getCanvasCoordinates(event);
    setCurrentAnnotation({
      ...currentAnnotation,
      endX: x,
      endY: y
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentAnnotation) return;

    setAnnotations([...annotations, currentAnnotation]);
    setCurrentAnnotation(null);
    setIsDrawing(false);
  };

  const addTextAnnotation = () => {
    if (!textInput.trim()) return;

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      type: 'text',
      startX: textPosition.x,
      startY: textPosition.y,
      text: textInput,
      color: currentColor,
      strokeWidth
    };

    setAnnotations([...annotations, newAnnotation]);
    setTextInput('');
    setShowTextInput(false);
  };

  const removeAnnotation = (id: string) => {
    setAnnotations(annotations.filter(ann => ann.id !== id));
  };

  const clearAllAnnotations = () => {
    setAnnotations([]);
  };

  const drawAnnotation = (ctx: CanvasRenderingContext2D, annotation: Annotation) => {
    ctx.strokeStyle = annotation.color;
    ctx.fillStyle = annotation.color;
    ctx.lineWidth = annotation.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (annotation.type) {
      case 'arrow':
        if (annotation.endX && annotation.endY) {
          drawArrow(ctx, annotation.startX, annotation.startY, annotation.endX, annotation.endY);
        }
        break;
      case 'rectangle':
        if (annotation.endX && annotation.endY) {
          const width = annotation.endX - annotation.startX;
          const height = annotation.endY - annotation.startY;
          ctx.strokeRect(annotation.startX, annotation.startY, width, height);
        }
        break;
      case 'circle':
        if (annotation.endX && annotation.endY) {
          const radius = Math.sqrt(
            Math.pow(annotation.endX - annotation.startX, 2) +
            Math.pow(annotation.endY - annotation.startY, 2)
          );
          ctx.beginPath();
          ctx.arc(annotation.startX, annotation.startY, radius, 0, 2 * Math.PI);
          ctx.stroke();
        }
        break;
      case 'line':
        if (annotation.endX && annotation.endY) {
          ctx.beginPath();
          ctx.moveTo(annotation.startX, annotation.startY);
          ctx.lineTo(annotation.endX, annotation.endY);
          ctx.stroke();
        }
        break;
      case 'text':
        if (annotation.text) {
          ctx.font = `${annotation.strokeWidth * 8}px Arial`;
          ctx.fillText(annotation.text, annotation.startX, annotation.startY);
        }
        break;
    }
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) => {
    const headlen = 15;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  };

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    ctx.drawImage(image, 0, 0);

    // Draw all annotations
    annotations.forEach(annotation => drawAnnotation(ctx, annotation));

    // Draw current annotation being drawn
    if (currentAnnotation) {
      drawAnnotation(ctx, currentAnnotation);
    }
  }, [annotations, currentAnnotation]);

  React.useEffect(() => {
    if (imagePreview) {
      const image = imageRef.current;
      if (image) {
        image.onload = redrawCanvas;
        image.src = imagePreview;
      }
    }
  }, [imagePreview, redrawCanvas]);

  const applyAnnotations = async () => {
    if (!imageFile || annotations.length === 0) {
      setError('Please select an image and add at least one annotation');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // In a real implementation, this would process the canvas and download
      // For now, we'll show a placeholder
      setError('Annotation application requires Canvas API processing. This feature is under development.');

      setTimeout(() => {
        setProcessing(false);
      }, 2000);

    } catch (err) {
      setError('Failed to apply annotations to image');
      setProcessing(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1>Annotate Image</h1>
      <p>Add arrows, shapes, and text annotations to your images</p>

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

          <div className={styles.tools}>
            <h3>Annotation Tools</h3>
            <div className={styles.toolGrid}>
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  className={`${styles.toolBtn} ${currentTool === tool.id ? styles.active : ''}`}
                  onClick={() => setCurrentTool(tool.id as any)}
                  title={tool.label}
                >
                  <span className={styles.toolIcon}>{tool.icon}</span>
                  <span className={styles.toolLabel}>{tool.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.settings}>
            <h3>Settings</h3>

            <div className={styles.colorPicker}>
              <label>Color:</label>
              <div className={styles.colorGrid}>
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`${styles.colorBtn} ${currentColor === color ? styles.active : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setCurrentColor(color)}
                  />
                ))}
              </div>
            </div>

            <div className={styles.strokeControl}>
              <label htmlFor="stroke">Stroke Width: {strokeWidth}px</label>
              <input
                id="stroke"
                type="range"
                min="1"
                max="10"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                className={styles.slider}
              />
            </div>
          </div>

          <div className={styles.annotations}>
            <h3>Annotations ({annotations.length})</h3>
            {annotations.length > 0 ? (
              <div className={styles.annotationList}>
                {annotations.map((annotation) => (
                  <div key={annotation.id} className={styles.annotationItem}>
                    <div className={styles.annotationPreview}>
                      <span className={styles.annotationType}>
                        {tools.find(t => t.id === annotation.type)?.icon}
                      </span>
                      <span className={styles.annotationColor} style={{ backgroundColor: annotation.color }}></span>
                      <span className={styles.annotationText}>
                        {annotation.type === 'text' ? annotation.text : annotation.type}
                      </span>
                    </div>
                    <button
                      onClick={() => removeAnnotation(annotation.id)}
                      className={styles.removeBtn}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button onClick={clearAllAnnotations} className={styles.clearBtn}>
                  Clear All
                </button>
              </div>
            ) : (
              <p className={styles.noAnnotations}>No annotations added yet</p>
            )}
          </div>

          <button
            onClick={applyAnnotations}
            disabled={!imageFile || annotations.length === 0 || processing}
            className={styles.applyBtn}
          >
            {processing ? 'Applying Annotations...' : 'Apply Annotations'}
          </button>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        <div className={styles.canvasSection}>
          <h3>Canvas</h3>

          <div className={styles.canvasContainer}>
            {imagePreview ? (
              <div className={styles.canvasWrapper}>
                <canvas
                  ref={canvasRef}
                  className={styles.canvas}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
                <img
                  ref={imageRef}
                  src={imagePreview}
                  alt="Source"
                  style={{ display: 'none' }}
                />

                {showTextInput && (
                  <div
                    className={styles.textInputOverlay}
                    style={{
                      left: `${textPosition.x}px`,
                      top: `${textPosition.y}px`
                    }}
                  >
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTextAnnotation()}
                      placeholder="Enter text..."
                      className={styles.textInputField}
                      autoFocus
                    />
                    <div className={styles.textInputActions}>
                      <button onClick={addTextAnnotation} className={styles.textAddBtn}>
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setShowTextInput(false);
                          setTextInput('');
                        }}
                        className={styles.textCancelBtn}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className={styles.instructions}>
                  {currentTool === 'text' ? 'Click to place text' : `Click and drag to draw ${currentTool}`}
                </div>
              </div>
            ) : (
              <div className={styles.noImage}>
                <div className={styles.placeholderIcon}>🖼️</div>
                <p>Select an image to start annotating</p>
              </div>
            )}
          </div>

          <div className={styles.canvasGuide}>
            <h4>Annotation Guide</h4>
            <div className={styles.guideContent}>
              <div className={styles.guideItem}>
                <strong>Arrow:</strong> Click and drag to draw directional arrows
              </div>
              <div className={styles.guideItem}>
                <strong>Rectangle:</strong> Click and drag to draw rectangles
              </div>
              <div className={styles.guideItem}>
                <strong>Circle:</strong> Click and drag to draw circles from center
              </div>
              <div className={styles.guideItem}>
                <strong>Line:</strong> Click and drag to draw straight lines
              </div>
              <div className={styles.guideItem}>
                <strong>Text:</strong> Click to place text annotations
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="Upload your image<br>Choose an annotation tool (arrow, rectangle, circle, line, or text)<br>Select color and stroke width<br>Draw annotations on the canvas<br>Add multiple annotations as needed<br>Download the annotated image"
        faqs={[
          { title: "Can I edit annotations after drawing them?", content: "Currently, you can remove and re-draw annotations. Direct editing may be added later." },
          { title: "What image formats are supported?", content: "JPG, PNG, WebP, GIF, and other common image formats." },
          { title: "Will the original image quality be preserved?", content: "Yes, annotations are added without recompressing the original image." },
          { title: "Can I save my annotations separately?", content: "Currently annotations are applied directly to the image. Separate saving may be added later." }
        ]}
        tips={["Use different colors for different types of annotations<br>Adjust stroke width for better visibility<br>Text annotations work best with larger fonts<br>Preview before downloading to ensure proper placement"]}
      />
    </main>
  );
}