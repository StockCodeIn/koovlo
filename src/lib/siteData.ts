export type ToolCategoryKey = "pdf" | "image" | "education" | "document" | "text-web";

export interface ToolRecord {
  slug: string;
  title: string;
  description: string;
  path: string;
  category: ToolCategoryKey;
  icon: string;
  keywords: string[];
}

export interface CategoryRecord {
  key: ToolCategoryKey;
  title: string;
  shortTitle: string;
  path: string;
  description: string;
  intro: string;
  icon: string;
}

export const categories: CategoryRecord[] = [
  {
    key: "pdf",
    title: "PDF Tools",
    shortTitle: "PDF",
    path: "/tools/pdf",
    description: "Merge, split, compress, convert, and edit PDF files online.",
    intro:
      "Privacy-first PDF utilities for merging, compressing, converting, signing, and organizing documents directly in your browser.",
    icon: "\uD83D\uDCC4",
  },
  {
    key: "image",
    title: "Image Tools",
    shortTitle: "Image",
    path: "/tools/image",
    description: "Resize, compress, convert, and protect images online.",
    intro:
      "Fast browser-based image tools for resizing, compression, format conversion, watermarking, and metadata cleanup.",
    icon: "\uD83D\uDDBC\uFE0F",
  },
  {
    key: "education",
    title: "Education Tools",
    shortTitle: "Education",
    path: "/tools/education",
    description: "Student calculators and study tools for GPA, CGPA, grades, and planning.",
    intro:
      "Academic tools for students, colleges, and exam prep including GPA, CGPA, percentage, attendance, and revision planning.",
    icon: "\uD83C\uDF93",
  },
  {
    key: "document",
    title: "Document Tools",
    shortTitle: "Document",
    path: "/tools/document",
    description: "Create resumes, invoices, and fillable PDF documents online.",
    intro:
      "Document workflow tools for building resumes, invoices, and PDF forms without complex desktop software.",
    icon: "\uD83D\uDCCB",
  },
  {
    key: "text-web",
    title: "Text and Web Tools",
    shortTitle: "Text and Web",
    path: "/tools/text-web",
    description: "Analyze, format, convert, and transform text or web data online.",
    intro:
      "Everyday utilities for word counts, formatting JSON, testing regex, encoding text, and other quick browser tasks.",
    icon: "\u270D\uFE0F",
  },
];

export const tools: ToolRecord[] = [
  {
    slug: "merge",
    title: "PDF Merge",
    description: "Combine multiple PDF files into a single document in your browser.",
    path: "/tools/pdf/merge",
    category: "pdf",
    icon: "\uD83D\uDCCE",
    keywords: ["merge pdf", "combine pdf files", "pdf merger online"],
  },
  {
    slug: "extract-pages",
    title: "Extract PDF Pages",
    description: "Create a new PDF from selected pages or page ranges.",
    path: "/tools/pdf/extract-pages",
    category: "pdf",
    icon: "\u2702\uFE0F",
    keywords: ["extract pdf pages", "split pdf pages", "save selected pdf pages"],
  },
  {
    slug: "page-range-split",
    title: "Split PDF by Page Range",
    description: "Split one PDF into multiple files using custom page ranges.",
    path: "/tools/pdf/page-range-split",
    category: "pdf",
    icon: "\uD83D\uDCC4",
    keywords: ["split pdf", "split pdf range", "divide pdf online"],
  },
  {
    slug: "reorder",
    title: "Reorder PDF Pages",
    description: "Rearrange, delete, and organize PDF pages visually.",
    path: "/tools/pdf/reorder",
    category: "pdf",
    icon: "\u2195\uFE0F",
    keywords: ["reorder pdf pages", "organize pdf", "sort pdf pages"],
  },
  {
    slug: "rotate",
    title: "Rotate PDF Pages",
    description: "Rotate all or selected PDF pages by 90, 180, or 270 degrees.",
    path: "/tools/pdf/rotate",
    category: "pdf",
    icon: "\uD83D\uDD04",
    keywords: ["rotate pdf", "turn pdf pages", "fix sideways pdf"],
  },
  {
    slug: "compress",
    title: "Compress PDF",
    description: "Reduce PDF file size for email, forms, and faster downloads.",
    path: "/tools/pdf/compress",
    category: "pdf",
    icon: "\uD83D\uDDD3\uFE0F",
    keywords: ["compress pdf", "reduce pdf size", "pdf optimizer"],
  },
  {
    slug: "to-image",
    title: "PDF to Image",
    description: "Convert PDF pages to high-quality PNG or JPG images.",
    path: "/tools/pdf/to-image",
    category: "pdf",
    icon: "\uD83D\uDCF8",
    keywords: ["pdf to image", "pdf to jpg", "pdf to png"],
  },
  {
    slug: "to-pdf",
    title: "Image to PDF",
    description: "Convert JPG, PNG, and other images into a PDF document.",
    path: "/tools/pdf/to-pdf",
    category: "pdf",
    icon: "\uD83D\uDDBC\uFE0F",
    keywords: ["image to pdf", "jpg to pdf", "png to pdf"],
  },
  {
    slug: "to-word",
    title: "PDF to Word",
    description: "Convert PDF files into editable DOCX documents.",
    path: "/tools/pdf/to-word",
    category: "pdf",
    icon: "\uD83D\uDCDD",
    keywords: ["pdf to word", "pdf to docx", "convert pdf to editable word"],
  },
  {
    slug: "watermark",
    title: "Add Watermark to PDF",
    description: "Add text or image watermarks to protect PDF files.",
    path: "/tools/pdf/watermark",
    category: "pdf",
    icon: "\uD83D\uDCA7",
    keywords: ["pdf watermark", "add watermark to pdf", "protect pdf"],
  },
  {
    slug: "page-number",
    title: "PDF Page Numbers",
    description: "Add customizable page numbers to one or more PDF pages.",
    path: "/tools/pdf/page-number",
    category: "pdf",
    icon: "\uD83D\uDD22",
    keywords: ["add page numbers to pdf", "pdf pagination", "number pdf pages"],
  },
  {
    slug: "duplicate-pages",
    title: "Duplicate PDF Pages",
    description: "Create copies of selected pages inside a PDF document.",
    path: "/tools/pdf/duplicate-pages",
    category: "pdf",
    icon: "\uD83D\uDCCB",
    keywords: ["duplicate pdf page", "copy pages in pdf", "repeat pdf pages"],
  },
  {
    slug: "crop",
    title: "Crop PDF Pages",
    description: "Trim margins and crop visible page areas in a PDF.",
    path: "/tools/pdf/crop",
    category: "pdf",
    icon: "\u2702\uFE0F",
    keywords: ["crop pdf", "trim pdf pages", "remove pdf margins"],
  },
  {
    slug: "change-page-size",
    title: "Change PDF Page Size",
    description: "Resize PDF pages to A4, Letter, and custom dimensions.",
    path: "/tools/pdf/change-page-size",
    category: "pdf",
    icon: "\uD83D\uDCCF",
    keywords: ["change pdf page size", "resize pdf pages", "a4 pdf converter"],
  },
  {
    slug: "metadata",
    title: "PDF Metadata",
    description: "View and edit PDF properties like title, author, and subject.",
    path: "/tools/pdf/metadata",
    category: "pdf",
    icon: "\uD83C\uDFF7\uFE0F",
    keywords: ["pdf metadata editor", "edit pdf title", "pdf properties"],
  },
  {
    slug: "grayscale",
    title: "Grayscale PDF",
    description: "Convert a colored PDF into black-and-white pages.",
    path: "/tools/pdf/grayscale",
    category: "pdf",
    icon: "\u26AB",
    keywords: ["grayscale pdf", "black and white pdf", "convert color pdf"],
  },
  {
    slug: "sign",
    title: "Sign PDF",
    description: "Add signatures, initials, dates, and text to PDF documents.",
    path: "/tools/pdf/sign",
    category: "pdf",
    icon: "\u270D\uFE0F",
    keywords: ["sign pdf", "electronic signature pdf", "add signature to pdf"],
  },
  {
    slug: "unlock",
    title: "Unlock PDF",
    description: "Remove password protection from PDF files you are authorized to edit.",
    path: "/tools/pdf/unlock",
    category: "pdf",
    icon: "\uD83D\uDD13",
    keywords: ["unlock pdf", "remove pdf password", "unprotect pdf"],
  },
  {
    slug: "resize",
    title: "Resize Image",
    description: "Resize images with presets, custom dimensions, and aspect ratio control.",
    path: "/tools/image/resize",
    category: "image",
    icon: "\uD83D\uDCCF",
    keywords: ["resize image", "image resizer", "change image dimensions"],
  },
  {
    slug: "compress-image",
    title: "Compress Image",
    description: "Reduce image size while balancing quality for the web or email.",
    path: "/tools/image/compress",
    category: "image",
    icon: "\uD83D\uDCE6",
    keywords: ["compress image", "image compressor", "reduce image kb"],
  },
  {
    slug: "convert-image",
    title: "Convert Image",
    description: "Convert between PNG, JPG, and WebP formats online.",
    path: "/tools/image/convert",
    category: "image",
    icon: "\uD83D\uDD04",
    keywords: ["image converter", "png to jpg", "webp converter"],
  },
  {
    slug: "add-watermark",
    title: "Add Watermark to Image",
    description: "Add text or logo watermarks to photos and graphics.",
    path: "/tools/image/add-watermark",
    category: "image",
    icon: "\uD83D\uDCA7",
    keywords: ["watermark image", "add logo to photo", "protect photos"],
  },
  {
    slug: "strip-metadata",
    title: "Strip Image Metadata",
    description: "Remove EXIF metadata and location details from images.",
    path: "/tools/image/strip-metadata",
    category: "image",
    icon: "\uD83E\uDDF9",
    keywords: ["remove exif data", "strip image metadata", "clean image privacy"],
  },
  {
    slug: "gpa",
    title: "GPA Calculator",
    description: "Calculate current GPA, credits, and target grade requirements.",
    path: "/tools/education/gpa",
    category: "education",
    icon: "\uD83C\uDFAF",
    keywords: ["gpa calculator", "grade point average calculator", "college gpa"],
  },
  {
    slug: "cgpa",
    title: "CGPA Calculator",
    description: "Track cumulative GPA across multiple semesters and credits.",
    path: "/tools/education/cgpa",
    category: "education",
    icon: "\uD83D\uDCC8",
    keywords: ["cgpa calculator", "cumulative gpa", "semester cgpa calculator"],
  },
  {
    slug: "grade",
    title: "Grade Calculator",
    description: "Convert marks into grades with support for weighted subjects.",
    path: "/tools/education/grade",
    category: "education",
    icon: "\uD83D\uDCDD",
    keywords: ["grade calculator", "marks to grade", "weighted grade calculator"],
  },
  {
    slug: "percentage",
    title: "Percentage Calculator",
    description: "Calculate percentages, mark conversions, and quick academic ratios.",
    path: "/tools/education/percentage",
    category: "education",
    icon: "\uD83D\uDD22",
    keywords: ["percentage calculator", "marks percentage", "cgpa to percentage"],
  },
  {
    slug: "attendance",
    title: "Attendance Tracker",
    description: "Track classes attended and calculate required future attendance.",
    path: "/tools/education/attendance",
    category: "education",
    icon: "\uD83D\uDCC5",
    keywords: ["attendance calculator", "attendance percentage", "college attendance tracker"],
  },
  {
    slug: "flashcard",
    title: "Flashcard Creator",
    description: "Create and review digital flashcards by topic or subject.",
    path: "/tools/education/flashcard",
    category: "education",
    icon: "\uD83C\uDFB4",
    keywords: ["flashcard maker", "study flashcards", "revision flashcards"],
  },
  {
    slug: "quiz-generator",
    title: "Quiz Generator",
    description: "Build quick quizzes for revision, teaching, and practice tests.",
    path: "/tools/education/quiz-generator",
    category: "education",
    icon: "\u2753",
    keywords: ["quiz generator", "practice test creator", "study quiz maker"],
  },
  {
    slug: "notes-organizer",
    title: "Notes Organizer",
    description: "Sort study notes with categories, tags, and structure.",
    path: "/tools/education/notes-organizer",
    category: "education",
    icon: "\uD83D\uDCD3",
    keywords: ["notes organizer", "study notes tool", "organize class notes"],
  },
  {
    slug: "revision-planner",
    title: "Revision Planner",
    description: "Plan revision schedules and track upcoming exams or goals.",
    path: "/tools/education/revision-planner",
    category: "education",
    icon: "\uD83D\uDCDD",
    keywords: ["revision planner", "study timetable", "exam planner"],
  },
  {
    slug: "rank",
    title: "Rank Calculator",
    description: "Estimate ranking and compare score performance quickly.",
    path: "/tools/education/rank",
    category: "education",
    icon: "\uD83C\uDFC6",
    keywords: ["rank calculator", "exam rank predictor", "score ranking tool"],
  },
  {
    slug: "resume-builder",
    title: "Resume Builder",
    description: "Create ATS-friendly resumes and export them as PDF files.",
    path: "/tools/document/resume-builder",
    category: "document",
    icon: "\uD83D\uDCC4",
    keywords: ["resume builder", "cv maker", "ats resume builder"],
  },
  {
    slug: "invoice",
    title: "Invoice Generator",
    description: "Generate professional invoices with totals, taxes, and PDF export.",
    path: "/tools/document/invoice",
    category: "document",
    icon: "\uD83E\uDDFE",
    keywords: ["invoice generator", "invoice maker", "free invoice template"],
  },
  {
    slug: "pdf-form-builder",
    title: "PDF Form Builder",
    description: "Create fillable PDF forms with a drag-and-drop editor.",
    path: "/tools/document/pdf-form-builder",
    category: "document",
    icon: "\uD83D\uDCCB",
    keywords: ["pdf form builder", "fillable pdf creator", "make pdf form"],
  },
  {
    slug: "word-counter",
    title: "Word Counter",
    description: "Count words, characters, paragraphs, and reading time instantly.",
    path: "/tools/text-web/word-counter",
    category: "text-web",
    icon: "\uD83D\uDCCA",
    keywords: ["word counter", "character counter", "reading time calculator"],
  },
  {
    slug: "case-converter",
    title: "Case Converter",
    description: "Convert text into upper, lower, title, camel, or snake case.",
    path: "/tools/text-web/case-converter",
    category: "text-web",
    icon: "\uD83D\uDD24",
    keywords: ["case converter", "uppercase lowercase tool", "camel case converter"],
  },
  {
    slug: "json-formatter",
    title: "JSON Formatter",
    description: "Format, validate, and minify JSON in one place.",
    path: "/tools/text-web/json-formatter",
    category: "text-web",
    icon: "{ }",
    keywords: ["json formatter", "json validator", "minify json"],
  },
  {
    slug: "base64",
    title: "Base64 Encoder and Decoder",
    description: "Encode or decode Base64 strings and text snippets online.",
    path: "/tools/text-web/base64",
    category: "text-web",
    icon: "\uD83D\uDD10",
    keywords: ["base64 encoder", "base64 decoder", "base64 converter"],
  },
  {
    slug: "url-encode",
    title: "URL Encoder and Decoder",
    description: "Encode and decode URLs for web-safe strings and query values.",
    path: "/tools/text-web/url-encode",
    category: "text-web",
    icon: "\uD83D\uDD17",
    keywords: ["url encoder", "url decoder", "encode query string"],
  },
  {
    slug: "text-to-speech",
    title: "Text to Speech",
    description: "Turn written text into spoken audio with browser voices.",
    path: "/tools/text-web/text-to-speech",
    category: "text-web",
    icon: "\uD83D\uDD0A",
    keywords: ["text to speech", "tts tool", "convert text to audio"],
  },
  {
    slug: "regex-tester",
    title: "Regex Tester",
    description: "Test regular expressions with instant pattern matching feedback.",
    path: "/tools/text-web/regex-tester",
    category: "text-web",
    icon: "\uD83D\uDD0D",
    keywords: ["regex tester", "regular expression tool", "test regex online"],
  },
  {
    slug: "lorem-ipsum",
    title: "Lorem Ipsum Generator",
    description: "Generate placeholder text for designs, wireframes, and drafts.",
    path: "/tools/text-web/lorem-ipsum",
    category: "text-web",
    icon: "\uD83D\uDCC4",
    keywords: ["lorem ipsum generator", "dummy text generator", "placeholder text"],
  },
  {
    slug: "text-summarizer",
    title: "Text Summarizer",
    description: "Summarize long text into shorter takeaways with browser-based processing.",
    path: "/tools/text-web/text-summarizer",
    category: "text-web",
    icon: "\uD83D\uDCDD",
    keywords: ["text summarizer", "article summarizer", "shorten text"],
  },
];

export const featuredToolPaths = [
  "/tools/pdf/merge",
  "/tools/pdf/compress",
  "/tools/pdf/to-word",
  "/tools/image/resize",
  "/tools/image/convert",
  "/tools/pdf/to-pdf",
  "/tools/document/resume-builder",
  "/tools/document/invoice",
  "/tools/education/gpa",
  "/tools/education/cgpa",
  "/tools/text-web/word-counter",
  "/tools/text-web/json-formatter",
];

export function getToolsByCategory(category: ToolCategoryKey) {
  return tools.filter((tool) => tool.category === category);
}

export function getToolByPath(path: string) {
  return tools.find((tool) => tool.path === path);
}

export function getCategoryByPath(path: string) {
  return categories.find((category) => category.path === path);
}

export function getFeaturedTools() {
  return featuredToolPaths
    .map((path) => getToolByPath(path))
    .filter((tool): tool is ToolRecord => Boolean(tool));
}

export function getRelatedTools(currentPath: string, limit = 3) {
  const currentTool = getToolByPath(currentPath);

  if (!currentTool) {
    return [];
  }

  return tools
    .filter(
      (tool) =>
        tool.category === currentTool.category &&
        tool.path !== currentTool.path
    )
    .slice(0, limit);
}
