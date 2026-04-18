import { Metadata } from "next";

interface ToolMetadataConfig {
  title: string;
  description: string;
  keywords: string[];
  path: string;
}

const toolsMetadata: Record<string, ToolMetadataConfig> = {
  "pdf-merge": {
    title: "PDF Merge - Combine Multiple PDF Files Online",
    description:
      "Merge multiple PDF files into one document instantly with a fast browser-based PDF merger.",
    keywords: ["merge pdf", "combine pdf", "pdf merger", "merge files online"],
    path: "/tools/pdf/merge",
  },
  "pdf-compress": {
    title: "Compress PDF Online - Reduce PDF File Size",
    description:
      "Compress PDF files online and reduce file size for email, uploads, and sharing.",
    keywords: ["compress pdf", "reduce pdf size", "pdf compression", "pdf optimizer"],
    path: "/tools/pdf/compress",
  },
  "pdf-extract-pages": {
    title: "Extract PDF Pages - Save Selected Pages Online",
    description:
      "Extract specific pages from a PDF and create a new document in seconds.",
    keywords: ["extract pdf pages", "extract pdf", "split pages"],
    path: "/tools/pdf/extract-pages",
  },
  "pdf-to-word": {
    title: "PDF to Word - Convert PDF to DOCX Online",
    description:
      "Convert PDF to editable Word DOCX documents online with a privacy-first workflow.",
    keywords: ["pdf to word", "convert pdf to word", "pdf to docx", "pdf converter"],
    path: "/tools/pdf/to-word",
  },
  "pdf-to-image": {
    title: "PDF to Image - Convert PDF Pages to PNG or JPG",
    description:
      "Convert PDF pages to PNG or JPG images online with adjustable quality settings.",
    keywords: ["pdf to image", "pdf to png", "pdf to jpg", "convert pdf"],
    path: "/tools/pdf/to-image",
  },
  "pdf-watermark": {
    title: "Add Watermark to PDF - Text and Image Watermarks",
    description:
      "Add text or image watermarks to PDF files and customize their position and opacity.",
    keywords: ["pdf watermark", "add watermark", "watermark pdf", "protect pdf"],
    path: "/tools/pdf/watermark",
  },
  "pdf-unlock": {
    title: "Unlock PDF - Remove PDF Password Protection",
    description:
      "Unlock password-protected PDF files you are authorized to edit in your browser.",
    keywords: ["unlock pdf", "remove pdf password", "remove protection"],
    path: "/tools/pdf/unlock",
  },
  "image-compress": {
    title: "Compress Image - Reduce Image Size Online",
    description:
      "Compress PNG, JPG, and WebP images online without a complicated workflow.",
    keywords: ["compress image", "image compressor", "reduce image size", "online image compression"],
    path: "/tools/image/compress",
  },
  "image-resize": {
    title: "Resize Image - Change Image Dimensions Online",
    description:
      "Resize images with custom dimensions, presets, and aspect ratio controls.",
    keywords: ["resize image", "image resizer", "change image size", "crop image"],
    path: "/tools/image/resize",
  },
  "image-convert": {
    title: "Convert Image Format - PNG, JPG, and WebP Converter",
    description:
      "Convert images between PNG, JPG, and WebP formats directly in your browser.",
    keywords: ["convert image", "image converter", "png to jpg", "convert png to jpg"],
    path: "/tools/image/convert",
  },
  "image-watermark": {
    title: "Add Watermark to Image - Text and Logo Watermarks",
    description:
      "Add custom text or image watermarks to photos and graphics online.",
    keywords: ["watermark image", "add watermark", "image watermark", "protect photos"],
    path: "/tools/image/add-watermark",
  },
  "gpa-calculator": {
    title: "GPA Calculator - Calculate Your Grade Point Average Online",
    description:
      "Calculate GPA instantly with credits, target grades, and a standard 4.0 scale.",
    keywords: ["gpa calculator", "calculate gpa", "college gpa", "grade calculator"],
    path: "/tools/education/gpa",
  },
  "cgpa-calculator": {
    title: "CGPA Calculator - Calculate Cumulative GPA Online",
    description:
      "Calculate CGPA across semesters and track cumulative academic performance.",
    keywords: ["cgpa calculator", "cumulative gpa", "semester gpa"],
    path: "/tools/education/cgpa",
  },
  "percentage-calculator": {
    title: "Percentage Calculator - Calculate Marks and Percentages",
    description:
      "Calculate percentages from marks and convert common academic scores online.",
    keywords: ["percentage calculator", "calculate percentage", "percentage to gpa"],
    path: "/tools/education/percentage",
  },
  "attendance-tracker": {
    title: "Attendance Tracker - Calculate Attendance Percentage",
    description:
      "Track attendance and find out how many classes you need to attend or can miss.",
    keywords: ["attendance tracker", "attendance calculator", "attendance percentage"],
    path: "/tools/education/attendance",
  },
  "resume-builder": {
    title: "Resume Builder - Create a Professional Resume Online",
    description:
      "Create ATS-friendly resumes online and export them as polished PDF files.",
    keywords: ["resume builder", "resume maker", "cv builder", "create resume online"],
    path: "/tools/document/resume-builder",
  },
  "invoice-generator": {
    title: "Invoice Generator - Create Professional Invoices Online",
    description:
      "Create and download professional invoices instantly with tax and total support.",
    keywords: ["invoice generator", "invoice maker", "create invoice", "invoice template"],
    path: "/tools/document/invoice",
  },
  "word-counter": {
    title: "Word Counter - Count Words and Characters Online",
    description:
      "Count words, characters, paragraphs, and reading time with instant stats.",
    keywords: ["word counter", "character counter", "word count tool"],
    path: "/tools/text-web/word-counter",
  },
  "json-formatter": {
    title: "JSON Formatter - Format and Validate JSON Online",
    description:
      "Format, validate, and minify JSON online with quick visual feedback.",
    keywords: ["json formatter", "json validator", "format json", "minify json"],
    path: "/tools/text-web/json-formatter",
  },
  "base64-encoder": {
    title: "Base64 Encoder and Decoder - Convert Base64 Online",
    description:
      "Encode and decode Base64 text instantly in your browser.",
    keywords: ["base64 encoder", "base64 decoder", "encode base64", "decode base64"],
    path: "/tools/text-web/base64",
  },
  "case-converter": {
    title: "Case Converter - Convert Text Case Online",
    description:
      "Convert text to uppercase, lowercase, title case, camel case, and more.",
    keywords: ["case converter", "text converter", "uppercase", "lowercase", "camelcase"],
    path: "/tools/text-web/case-converter",
  },
  "text-to-speech": {
    title: "Text to Speech - Convert Text to Audio Online",
    description:
      "Convert text to speech with browser voices and simple controls.",
    keywords: ["text to speech", "text to audio", "tts converter", "speech synthesis"],
    path: "/tools/text-web/text-to-speech",
  },
};

export function generateToolMetadata(
  toolKey: string,
  baseUrl = "https://www.koovlo.com"
): Metadata {
  const config = toolsMetadata[toolKey];

  if (!config) {
    return {};
  }

  const url = `${baseUrl}${config.path}`;

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    openGraph: {
      title: config.title,
      description: config.description,
      url,
      type: "website",
      siteName: "Koovlo",
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export function getToolSchemaMarkup(
  toolKey: string,
  baseUrl = "https://www.koovlo.com"
) {
  const config = toolsMetadata[toolKey];

  if (!config) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: config.title,
    description: config.description,
    url: `${baseUrl}${config.path}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}
