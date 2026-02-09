import { Metadata } from 'next';

interface ToolMetadataConfig {
  title: string;
  description: string;
  keywords: string[];
  icon: string;
}

const toolsMetadata: Record<string, ToolMetadataConfig> = {
  // PDF Tools
  'pdf-merge': {
    title: 'PDF Merge – Combine Multiple PDFs Online Free',
    description: 'Merge multiple PDF files into one document instantly. Free, fast, and secure PDF merger with no file size limits.',
    keywords: ['merge PDF', 'combine PDF', 'pdf merger', 'merge files online'],
    icon: '📎',
  },
  'pdf-compress': {
    title: 'Compress PDF Online – Reduce File Size Free',
    description: 'Compress PDF files online without losing quality. Choose compression level and reduce PDF size instantly.',
    keywords: ['compress PDF', 'reduce PDF size', 'pdf compression', 'pdf optimizer'],
    icon: '🗜️',
  },
  'pdf-extract-pages': {
    title: 'Extract PDF Pages – Extract Specific Pages Free',
    description: 'Extract specific pages from PDF by page number. Create new PDFs from selected pages instantly.',
    keywords: ['extract PDF pages', 'extract PDF', 'split pages'],
    icon: '✂️',
  },
  'pdf-to-word': {
    title: 'PDF to Word – Convert PDF to DOCX Free Online',
    description: 'Convert PDF to editable Word (DOCX) documents instantly. No signup required, fast and secure.',
    keywords: ['PDF to Word', 'convert PDF to Word', 'PDF to DOCX', 'pdf converter'],
    icon: '📝',
  },
  'pdf-to-image': {
    title: 'PDF to Image – Convert PDF Pages to PNG/JPG',
    description: 'Convert PDF pages to PNG or JPG images. Extract all pages or select specific pages.',
    keywords: ['PDF to image', 'PDF to PNG', 'PDF to JPG', 'convert PDF'],
    icon: '🖼️',
  },
  'pdf-watermark': {
    title: 'Add Watermark to PDF – Text & Image Watermarks',
    description: 'Add text or image watermarks to PDFs instantly. Customize position, opacity, and appearance.',
    keywords: ['PDF watermark', 'add watermark', 'watermark PDF', 'protect PDF'],
    icon: '💧',
  },
  'pdf-unlock': {
    title: 'Unlock PDF – Remove PDF Password Protection',
    description: 'Remove password protection from PDF files instantly. Unlock encrypted PDFs securely.',
    keywords: ['unlock PDF', 'remove PDF password', 'remove protection'],
    icon: '🔓',
  },

  // Image Tools
  'image-compress': {
    title: 'Compress Image – Reduce Image Size Online Free',
    description: 'Compress images (PNG, JPG, WebP) without losing quality. Batch compress multiple images.',
    keywords: ['compress image', 'image compressor', 'reduce image size', 'online image compression'],
    icon: '📦',
  },
  'image-resize': {
    title: 'Resize Image – Change Image Dimensions Free',
    description: 'Resize images with presets or custom dimensions. Maintain aspect ratio. Support PNG, JPG, WebP.',
    keywords: ['resize image', 'image resizer', 'change image size', 'crop image'],
    icon: '📏',
  },
  'image-convert': {
    title: 'Convert Image Format – PNG, JPG, WebP Converter',
    description: 'Convert images between PNG, JPG, and WebP formats instantly. No quality loss.',
    keywords: ['convert image', 'image converter', 'PNG to JPG', 'convert PNG to JPG'],
    icon: '🔄',
  },
  'image-watermark': {
    title: 'Add Watermark to Image – Text & Logo Watermarks',
    description: 'Add text or image watermarks to photos. Protect your images with custom watermarks.',
    keywords: ['watermark image', 'add watermark', 'image watermark', 'protect photos'],
    icon: '💧',
  },

  // Education Tools
  'gpa-calculator': {
    title: 'GPA Calculator – Calculate Your GPA Online',
    description: 'Calculate GPA instantly with credits and multiple grade scales. Track academic performance.',
    keywords: ['GPA calculator', 'calculate GPA', 'college GPA', 'grade calculator'],
    icon: '📊',
  },
  'cgpa-calculator': {
    title: 'CGPA Calculator – Calculate Cumulative GPA',
    description: 'Calculate CGPA across multiple semesters. Cumulative GPA calculator with semester tracking.',
    keywords: ['CGPA calculator', 'cumulative GPA', 'semester GPA'],
    icon: '📈',
  },
  'percentage-calculator': {
    title: 'Percentage Calculator – Calculate Percentage & CGPA',
    description: 'Calculate percentages from marks instantly. Convert GPA to percentage, CGPA conversions.',
    keywords: ['percentage calculator', 'calculate percentage', 'percentage to GPA'],
    icon: '🔢',
  },
  'attendance-tracker': {
    title: 'Attendance Tracker – Calculate Attendance Percentage',
    description: 'Track and calculate attendance percentage daily. Student and teacher attendance calculator.',
    keywords: ['attendance tracker', 'attendance calculator', 'attendance percentage'],
    icon: '📅',
  },

  // Document Tools
  'resume-builder': {
    title: 'Resume Builder – Create Professional Resume Free',
    description: 'Create ATS-friendly resumes with templates. Export to PDF. No signup required.',
    keywords: ['resume builder', 'resume maker', 'CV builder', 'create resume online'],
    icon: '📄',
  },
  'invoice-generator': {
    title: 'Invoice Generator – Create Professional Invoices',
    description: 'Create and download professional invoices instantly. Free invoice template with PDF export.',
    keywords: ['invoice generator', 'invoice maker', 'create invoice', 'invoice template'],
    icon: '🧾',
  },

  // Text/Web Tools
  'word-counter': {
    title: 'Word Counter – Count Words & Characters Online',
    description: 'Count words, characters, paragraphs, and reading time. Analyze text statistics instantly.',
    keywords: ['word counter', 'character counter', 'word count tool'],
    icon: '📊',
  },
  'json-formatter': {
    title: 'JSON Formatter – Format & Validate JSON Online',
    description: 'Format, validate, and minify JSON instantly. Pretty print JSON with syntax highlighting.',
    keywords: ['JSON formatter', 'JSON validator', 'format JSON', 'minify JSON'],
    icon: '{ }',
  },
  'base64-encoder': {
    title: 'Base64 Encoder/Decoder – Encode & Decode Online',
    description: 'Encode and decode Base64 strings instantly. Online Base64 conversion tool.',
    keywords: ['base64 encoder', 'base64 decoder', 'encode base64', 'decode base64'],
    icon: '🔐',
  },
  'case-converter': {
    title: 'Case Converter – Convert Text Case Online',
    description: 'Convert text to uppercase, lowercase, camelCase, snake_case, and more.',
    keywords: ['case converter', 'text converter', 'uppercase', 'lowercase', 'camelcase'],
    icon: '🔤',
  },
  'text-to-speech': {
    title: 'Text to Speech – Convert Text to Audio Online',
    description: 'Convert text to audio with natural voice. Multiple language and voice options.',
    keywords: ['text to speech', 'text to audio', 'TTS converter', 'speech synthesis'],
    icon: '🔊',
  },
};

export function generateToolMetadata(toolKey: string, baseUrl = 'https://www.koovlo.com'): Metadata {
  const config = toolsMetadata[toolKey];
  
  if (!config) {
    return {};
  }

  const url = `${baseUrl}/tools/${toolKey}`;

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    openGraph: {
      title: config.title,
      description: config.description,
      url,
      type: 'website',
      siteName: 'Koovlo',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export function getToolSchemaMarkup(toolKey: string, baseUrl = 'https://www.koovlo.com') {
  const config = toolsMetadata[toolKey];
  
  if (!config) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': config.title,
    'description': config.description,
    'url': `${baseUrl}/tools/${toolKey}`,
    'applicationCategory': 'Utility',
    'operatingSystem': 'Web',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
    },
  };
}
