'use client';

import { useState } from 'react';
import styles from './metagenerator.module.css';

export default function MetaGeneratorPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keywords: '',
    author: '',
    url: '',
    image: '',
    siteName: '',
    type: 'website',
    twitterCard: 'summary_large_image',
  });
  const [generatedMeta, setGeneratedMeta] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateMetaTags = () => {
    const meta = [];

    // Basic meta tags
    if (formData.title) {
      meta.push(`<title>${formData.title}</title>`);
      meta.push(`<meta name="title" content="${formData.title}">`);
    }

    if (formData.description) {
      meta.push(`<meta name="description" content="${formData.description}">`);
    }

    if (formData.keywords) {
      meta.push(`<meta name="keywords" content="${formData.keywords}">`);
    }

    if (formData.author) {
      meta.push(`<meta name="author" content="${formData.author}">`);
    }

    // Open Graph tags
    if (formData.title) {
      meta.push(`<meta property="og:title" content="${formData.title}">`);
    }

    if (formData.description) {
      meta.push(`<meta property="og:description" content="${formData.description}">`);
    }

    if (formData.url) {
      meta.push(`<meta property="og:url" content="${formData.url}">`);
    }

    if (formData.image) {
      meta.push(`<meta property="og:image" content="${formData.image}">`);
    }

    if (formData.siteName) {
      meta.push(`<meta property="og:site_name" content="${formData.siteName}">`);
    }

    meta.push(`<meta property="og:type" content="${formData.type}">`);

    // Twitter Card tags
    meta.push(`<meta name="twitter:card" content="${formData.twitterCard}">`);

    if (formData.title) {
      meta.push(`<meta name="twitter:title" content="${formData.title}">`);
    }

    if (formData.description) {
      meta.push(`<meta name="twitter:description" content="${formData.description}">`);
    }

    if (formData.image) {
      meta.push(`<meta name="twitter:image" content="${formData.image}">`);
    }

    // Additional useful meta tags
    meta.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`);
    meta.push(`<meta charset="UTF-8">`);
    meta.push(`<meta name="robots" content="index, follow">`);

    setGeneratedMeta(meta.join('\n'));
  };

  const handleClear = () => {
    setFormData({
      title: '',
      description: '',
      keywords: '',
      author: '',
      url: '',
      image: '',
      siteName: '',
      type: 'website',
      twitterCard: 'summary_large_image',
    });
    setGeneratedMeta('');
  };

  const loadSampleData = () => {
    setFormData({
      title: 'My Awesome Website - Best Tools Online',
      description: 'Discover amazing online tools for developers, designers, and content creators. Free, fast, and easy to use.',
      keywords: 'online tools, developer tools, design tools, productivity',
      author: 'John Doe',
      url: 'https://myawesomewebsite.com',
      image: 'https://myawesomewebsite.com/images/og-image.jpg',
      siteName: 'My Awesome Website',
      type: 'website',
      twitterCard: 'summary_large_image',
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedMeta);
      alert('Meta tags copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadOutput = () => {
    const blob = new Blob([generatedMeta], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meta-tags.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tool}>
        <div className={styles.formSection}>
          <div className={styles.formHeader}>
            <h3>Meta Information</h3>
            <button onClick={loadSampleData} className={styles.sampleBtn}>
              Load Sample
            </button>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label}>Page Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter page title..."
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter meta description..."
                className={styles.textarea}
                rows={3}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Keywords</label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => handleInputChange('keywords', e.target.value)}
                placeholder="keyword1, keyword2, keyword3..."
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                placeholder="Author name..."
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                placeholder="https://example.com/page"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Site Name</label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
                placeholder="Website name..."
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Content Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className={styles.select}
              >
                <option value="website">Website</option>
                <option value="article">Article</option>
                <option value="product">Product</option>
                <option value="profile">Profile</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Twitter Card Type</label>
              <select
                value={formData.twitterCard}
                onChange={(e) => handleInputChange('twitterCard', e.target.value)}
                className={styles.select}
              >
                <option value="summary">Summary</option>
                <option value="summary_large_image">Summary Large Image</option>
                <option value="app">App</option>
                <option value="player">Player</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={generateMetaTags} className={styles.generateBtn}>
            Generate Meta Tags
          </button>
          <button onClick={handleClear} className={styles.clearBtn}>
            Clear All
          </button>
        </div>

        {generatedMeta && (
          <div className={styles.outputSection}>
            <h3>Generated Meta Tags</h3>
            <textarea
              value={generatedMeta}
              readOnly
              className={styles.outputTextarea}
            />
            <div className={styles.outputActions}>
              <button onClick={copyToClipboard} className={styles.copyBtn}>
                Copy Meta Tags
              </button>
              <button onClick={downloadOutput} className={styles.downloadBtn}>
                Download as HTML
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}