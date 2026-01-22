'use client';

import { useState, useRef } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './sizecalculator.module.css';

export default function ImageSizeCalculator() {
  const [files, setFiles] = useState<File[]>([]);
  const [imageData, setImageData] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);
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
    setImageData([]);

    // Process images to get dimensions and calculate sizes
    processImages(imageFiles);
  };

  const processImages = async (imageFiles: File[]) => {
    setProcessing(true);
    const processedData: any[] = [];

    for (const file of imageFiles) {
      try {
        const data = await getImageData(file);
        processedData.push(data);
      } catch (err) {
        processedData.push({
          filename: file.name,
          error: 'Failed to process image'
        });
      }
    }

    setImageData(processedData);
    setProcessing(false);
  };

  const getImageData = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Calculate file size in different units
        const fileSizeBytes = file.size;
        const fileSizeKB = fileSizeBytes / 1024;
        const fileSizeMB = fileSizeKB / 1024;

        // Calculate pixel count
        const pixelCount = img.width * img.height;

        // Calculate megapixels
        const megapixels = pixelCount / 1000000;

        // Calculate aspect ratio
        const aspectRatio = img.width / img.height;
        const aspectRatioText = aspectRatio > 1
          ? `${aspectRatio.toFixed(2)}:1 (Landscape)`
          : `${(1/aspectRatio).toFixed(2)}:1 (Portrait)`;

        // Calculate DPI estimates (assuming standard sizes)
        const dpiEstimates = calculateDPIEstimates(img.width, img.height);

        // Calculate compression ratio (rough estimate)
        const uncompressedSize = pixelCount * 3; // RGB
        const compressionRatio = uncompressedSize / fileSizeBytes;

        resolve({
          filename: file.name,
          dimensions: { width: img.width, height: img.height },
          fileSize: {
            bytes: fileSizeBytes,
            kb: fileSizeKB.toFixed(1),
            mb: fileSizeMB.toFixed(2)
          },
          pixelCount,
          megapixels: megapixels.toFixed(2),
          aspectRatio: aspectRatioText,
          dpiEstimates,
          compressionRatio: compressionRatio.toFixed(1),
          format: file.type.split('/')[1].toUpperCase(),
          lastModified: new Date(file.lastModified).toLocaleString()
        });
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const calculateDPIEstimates = (width: number, height: number) => {
    const standardSizes = [
      { name: 'Web Banner (728x90)', width: 728, height: 90, dpi: 72 },
      { name: 'Facebook Post (1200x630)', width: 1200, height: 630, dpi: 72 },
      { name: 'Instagram Post (1080x1080)', width: 1080, height: 1080, dpi: 72 },
      { name: 'Print A4 (8.3x11.7")', width: 2480, height: 3508, dpi: 300 },
      { name: 'Print Letter (8.5x11")', width: 2550, height: 3300, dpi: 300 }
    ];

    return standardSizes.map(size => {
      const scaleX = width / size.width;
      const scaleY = height / size.height;
      const scale = Math.min(scaleX, scaleY);
      const estimatedDPI = size.dpi * scale;

      return {
        name: size.name,
        estimatedDPI: estimatedDPI.toFixed(0),
        fit: scale >= 1 ? 'Fits' : 'Too small'
      };
    });
  };

  const clearAll = () => {
    setFiles([]);
    setImageData([]);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const exportData = () => {
    if (imageData.length === 0) return;

    const csvContent = [
      ['Filename', 'Width', 'Height', 'File Size (KB)', 'Pixels', 'Megapixels', 'Aspect Ratio', 'Format'].join(','),
      ...imageData.map(img => [
        img.filename,
        img.dimensions?.width || 'N/A',
        img.dimensions?.height || 'N/A',
        img.fileSize?.kb || 'N/A',
        img.pixelCount || 'N/A',
        img.megapixels || 'N/A',
        img.aspectRatio || 'N/A',
        img.format || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'image-size-analysis.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTotalStats = () => {
    if (imageData.length === 0) return null;

    const totalSize = imageData.reduce((sum, img) => sum + (parseFloat(img.fileSize?.kb) || 0), 0);
    const totalPixels = imageData.reduce((sum, img) => sum + (img.pixelCount || 0), 0);
    const avgMegapixels = imageData.reduce((sum, img) => sum + (parseFloat(img.megapixels) || 0), 0) / imageData.length;

    return {
      totalFiles: imageData.length,
      totalSize: totalSize.toFixed(1),
      totalPixels: totalPixels.toLocaleString(),
      avgMegapixels: avgMegapixels.toFixed(2)
    };
  };

  const stats = getTotalStats();

  return (
    <main className={styles.container}>
      <h1>Image Size Calculator</h1>
      <p>Analyze image dimensions, file sizes, and technical specifications</p>

      <div className={styles.calculator}>
        <div className={styles.controls}>
          <div className={styles.fileInput}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className={styles.hiddenInput}
              ref={fileInputRef}
              id="size-calculator-files"
            />
            <label htmlFor="size-calculator-files" className={styles.fileLabel}>
              {files.length > 0 ? `${files.length} files selected` : 'Choose Images to Analyze'}
            </label>
          </div>

          {files.length > 0 && (
            <div className={styles.fileInfo}>
              <p><strong>Files:</strong> {files.length} images selected</p>
              <p><strong>Total Size:</strong> {(files.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}

          <div className={styles.actions}>
            <button
              onClick={exportData}
              disabled={imageData.length === 0}
              className={styles.exportBtn}
            >
              Export CSV
            </button>
            <button
              onClick={clearAll}
              className={styles.clearBtn}
            >
              Clear All
            </button>
          </div>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        {stats && (
          <div className={styles.summary}>
            <h3>Summary Statistics</h3>
            <div className={styles.statsGrid}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.totalFiles}</span>
                <span className={styles.statLabel}>Total Images</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.totalSize} KB</span>
                <span className={styles.statLabel}>Total Size</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.totalPixels}</span>
                <span className={styles.statLabel}>Total Pixels</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.avgMegapixels} MP</span>
                <span className={styles.statLabel}>Avg Megapixels</span>
              </div>
            </div>
          </div>
        )}

        <div className={styles.results}>
          <h3>Image Analysis Results</h3>

          {processing ? (
            <div className={styles.processing}>
              <div className={styles.spinner}></div>
              <p>Analyzing images...</p>
            </div>
          ) : imageData.length > 0 ? (
            <div className={styles.imageGrid}>
              {imageData.map((img, index) => (
                <div key={index} className={styles.imageCard}>
                  <div className={styles.cardHeader}>
                    <h4 className={styles.filename}>{img.filename}</h4>
                    {img.error && <span className={styles.errorBadge}>Error</span>}
                  </div>

                  {img.error ? (
                    <div className={styles.errorMessage}>{img.error}</div>
                  ) : (
                    <div className={styles.imageStats}>
                      <div className={styles.statRow}>
                        <span className={styles.label}>Dimensions:</span>
                        <span className={styles.value}>
                          {img.dimensions.width} × {img.dimensions.height} px
                        </span>
                      </div>

                      <div className={styles.statRow}>
                        <span className={styles.label}>File Size:</span>
                        <span className={styles.value}>
                          {img.fileSize.kb} KB ({img.fileSize.mb} MB)
                        </span>
                      </div>

                      <div className={styles.statRow}>
                        <span className={styles.label}>Pixels:</span>
                        <span className={styles.value}>
                          {img.pixelCount.toLocaleString()} ({img.megapixels} MP)
                        </span>
                      </div>

                      <div className={styles.statRow}>
                        <span className={styles.label}>Aspect Ratio:</span>
                        <span className={styles.value}>{img.aspectRatio}</span>
                      </div>

                      <div className={styles.statRow}>
                        <span className={styles.label}>Format:</span>
                        <span className={styles.value}>{img.format}</span>
                      </div>

                      <div className={styles.statRow}>
                        <span className={styles.label}>Compression:</span>
                        <span className={styles.value}>{img.compressionRatio}x</span>
                      </div>

                      <div className={styles.dpiSection}>
                        <h5>DPI Estimates:</h5>
                        <div className={styles.dpiGrid}>
                          {img.dpiEstimates.map((dpi: any, dpiIndex: number) => (
                            <div key={dpiIndex} className={styles.dpiItem}>
                              <span className={styles.dpiName}>{dpi.name}:</span>
                              <span className={styles.dpiValue}>
                                {dpi.estimatedDPI} DPI ({dpi.fit})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noImages}>
              <div className={styles.placeholderIcon}>📊</div>
              <p>Select images to analyze their sizes and specifications</p>
              <p className={styles.hint}>Get detailed information about dimensions, file sizes, and DPI</p>
            </div>
          )}
        </div>
      </div>

      <ToolInfo
        howItWorks="Select multiple images<br>Tool analyzes dimensions, file sizes, and metadata<br>View detailed specifications for each image<br>Export results to CSV for further analysis"
        faqs={[
          { title: "What information does it provide?", content: "Dimensions, file size, pixel count, aspect ratio, format, compression ratio, and DPI estimates for different use cases." },
          { title: "What are megapixels?", content: "Total number of pixels divided by 1 million. Higher megapixels generally mean better image quality." },
          { title: "What does compression ratio mean?", content: "How much the image data is compressed. Higher ratios mean better compression." },
          { title: "Why are DPI estimates important?", content: "DPI (dots per inch) determines print quality. Higher DPI means sharper prints." }
        ]}
        tips={["Use for batch analysis of photo collections<br>Check if images meet website requirements<br>Estimate print quality before printing<br>Compare compression efficiency across formats"]}
      />
    </main>
  );
}