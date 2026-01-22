// src/app/tools/page.tsx
import ToolCard from "@/components/ToolCard";
import styles from "./tools.module.css";
import ToolsNav from "@/components/ToolsNav";

export default function AllTools() {
  return (
    <>
    <ToolsNav />
    <main className={styles.container}>
      <h1 className={styles.mainTitle}>All Tools</h1>

      {/* PDF Tools */}
      <section className={styles.section}>
        <h2>📄 PDF Tools</h2>
        <div className={styles.grid}>
          <ToolCard title="PDF Merge" desc="Combine multiple PDFs into one file" link="/tools/pdf/merge" icon="📎" />
          <ToolCard title="PDF Split" desc="Split PDF into multiple files" link="/tools/pdf/split" icon="✂️" />
          <ToolCard title="Page Range Split" desc="Split PDF by page ranges" link="/tools/pdf/page-range-split" icon="📄" />
          <ToolCard title="Single Page Extract" desc="Extract single pages from PDF" link="/tools/pdf/single-page-extract" icon="📄" />
          <ToolCard title="Delete PDF Pages" desc="Remove specific pages from PDF" link="/tools/pdf/delete-pages" icon="🗑️" />
          <ToolCard title="Reorder PDF Pages" desc="Reorder PDF pages" link="/tools/pdf/reorder" icon="↕️" />
          <ToolCard title="Rotate PDF Pages" desc="Rotate PDF pages" link="/tools/pdf/rotate" icon="🔄" />
          <ToolCard title="Extract PDF Pages" desc="Extract pages from PDF" link="/tools/pdf/extract-pages" icon="📄" />
          <ToolCard title="Duplicate Pages" desc="Duplicate PDF pages" link="/tools/pdf/duplicate-pages" icon="📋" />
          <ToolCard title="Preview PDF Pages" desc="Preview PDF pages" link="/tools/pdf/preview" icon="👁️" />
          <ToolCard title="Count PDF Pages" desc="Count pages in PDF" link="/tools/pdf/count-pages" icon="🔢" />
          <ToolCard title="Get PDF Info" desc="Get PDF metadata and info" link="/tools/pdf/info" icon="ℹ️" />
          <ToolCard title="PDF to Images" desc="Convert PDF pages to images" link="/tools/pdf/to-image" icon="🖼️" />
          <ToolCard title="Images to PDF" desc="Convert images to PDF" link="/tools/pdf/to-pdf" icon="📄" />
          <ToolCard title="Change Page Size" desc="Change PDF page size" link="/tools/pdf/change-page-size" icon="📏" />
          <ToolCard title="Crop PDF Pages" desc="Crop PDF pages" link="/tools/pdf/crop" icon="✂️" />
          <ToolCard title="Add Text to PDF" desc="Add text to PDF" link="/tools/pdf/add-text" icon="📝" />
          <ToolCard title="Add Image to PDF" desc="Add image to PDF" link="/tools/pdf/add-image" icon="🖼️" />
          <ToolCard title="Add Page Numbers" desc="Add page numbers to PDF" link="/tools/pdf/page-number" icon="🔢" />
          <ToolCard title="Highlight Text" desc="Highlight text in PDF" link="/tools/pdf/highlight" icon="🖍️" />
          <ToolCard title="Underline Text" desc="Underline text in PDF" link="/tools/pdf/underline" icon="📏" />
          <ToolCard title="Strike Text" desc="Strike through text in PDF" link="/tools/pdf/strike" icon="📏" />
          <ToolCard title="Compress PDF" desc="Reduce PDF file size" link="/tools/pdf/compress" icon="🗜️" />
          <ToolCard title="Flatten PDF" desc="Flatten PDF forms" link="/tools/pdf/flatten" icon="📄" />
          <ToolCard title="Remove Metadata" desc="Remove PDF metadata" link="/tools/pdf/metadata" icon="🗑️" />
          <ToolCard title="PDF Analyzer" desc="Detect encryption, metadata, and page info" link="/tools/pdf/analyzer" icon="🧠" />
          <ToolCard title="Fill PDF Form" desc="Fill PDF forms" link="/tools/pdf/fill-form" icon="📝" />
          <ToolCard title="Flatten Filled Form" desc="Flatten filled PDF forms" link="/tools/pdf/flatten-form" icon="📄" />
          <ToolCard title="Watermark" desc="Add watermark to PDF" link="/tools/pdf/watermark" icon="💧" />
           <ToolCard title="Grayscale PDF" desc="Convert colorful PDFs to black-and-white" link="/tools/pdf/grayscale" icon="🖤" />
          <ToolCard title="PDF to Word" desc="Convert PDF to Word" link="/tools/pdf/to-word" icon="📝" />
          <ToolCard title="PDF to Excel" desc="Convert PDF to Excel" link="/tools/pdf/to-excel" icon="📊" />
          <ToolCard title="Remove PDF Password" desc="Remove PDF password" link="/tools/pdf/unlock" icon="🔓" />
          <ToolCard title="Digital Signature" desc="Add digital signature to PDF" link="/tools/pdf/sign" icon="✍️" />
        </div>
      </section>

      {/* Image Tools */}
      <section className={styles.section}>
        <h2>🖼️ Image Tools</h2>
        <div className={styles.grid}>
          <ToolCard title="Image Resize" desc="Resize images to custom dimensions" link="/tools/image/resize" icon="📏" />
          <ToolCard title="Image Compress" desc="Reduce image size without quality loss" link="/tools/image/compress" icon="📉" />
          <ToolCard title="Image Crop" desc="Crop images to desired size" link="/tools/image/crop" icon="✂️" />
          <ToolCard title="Image Rotate" desc="Rotate images" link="/tools/image/rotate" icon="🔄" />
          <ToolCard title="Image Flip" desc="Flip images horizontally or vertically" link="/tools/image/flip" icon="🔄" />
          <ToolCard title="Image Convert" desc="Convert between JPG, PNG, WebP" link="/tools/image/convert" icon="🔄" />
          <ToolCard title="Change Image Quality" desc="Change image quality" link="/tools/image/quality" icon="⚙️" />
          <ToolCard title="Reduce Image Size" desc="Reduce image size (KB target)" link="/tools/image/reduce-size" icon="📉" />
          <ToolCard title="Convert to WebP" desc="Convert images to WebP format" link="/tools/image/webp" icon="⚡" />
          <ToolCard title="Progressive JPEG" desc="Convert to progressive JPEG" link="/tools/image/progressive-jpeg" icon="📷" />
          <ToolCard title="Strip Metadata" desc="Remove EXIF metadata" link="/tools/image/strip-metadata" icon="🗑️" />
          <ToolCard title="Image Blur" desc="Blur images" link="/tools/image/blur" icon="🌫️" />
          <ToolCard title="Image Grayscale" desc="Convert to grayscale" link="/tools/image/grayscale" icon="⚫" />
          <ToolCard title="Brightness / Contrast" desc="Adjust brightness and contrast" link="/tools/image/brightness" icon="☀️" />
          <ToolCard title="Saturation Adjust" desc="Adjust color saturation" link="/tools/image/saturation" icon="🌈" />
          <ToolCard title="Sepia Filter" desc="Apply sepia filter" link="/tools/image/sepia" icon="📜" />
          <ToolCard title="Invert Colors" desc="Invert image colors" link="/tools/image/invert" icon="🔄" />
          <ToolCard title="Add Text to Image" desc="Add text overlays to images" link="/tools/image/add-text" icon="📝" />
          <ToolCard title="Add Image Watermark" desc="Add watermark to images" link="/tools/image/add-watermark" icon="💧" />
          <ToolCard title="Draw / Annotate" desc="Draw and annotate on images" link="/tools/image/annotate" icon="✏️" />
          <ToolCard title="Add Shapes" desc="Add shapes to images" link="/tools/image/add-shapes" icon="🔲" />
          <ToolCard title="Add Border / Padding" desc="Add borders to images" link="/tools/image/border" icon="🔲" />
          <ToolCard title="Image to Base64" desc="Convert image to Base64" link="/tools/image/to-base64" icon="🔢" />
          <ToolCard title="Base64 to Image" desc="Convert Base64 to image" link="/tools/image/from-base64" icon="🖼️" />
          <ToolCard title="Image Dimensions Checker" desc="Check image dimensions" link="/tools/image/dimensions" icon="📐" />
          <ToolCard title="Image DPI Checker" desc="Check image DPI" link="/tools/image/dpi-checker" icon="📏" />
          <ToolCard title="Image Size Calculator" desc="Calculate image size" link="/tools/image/size-calculator" icon="📊" />
          <ToolCard title="Bulk Resize Images" desc="Resize multiple images" link="/tools/image/bulk-resize" icon="📏" />
          <ToolCard title="Bulk Convert Images" desc="Convert multiple images" link="/tools/image/bulk-convert" icon="🔄" />
          <ToolCard title="Bulk Compress Images" desc="Compress multiple images" link="/tools/image/bulk-compress" icon="📉" />
          <ToolCard title="Background Remover" desc="Remove image backgrounds" link="/tools/image/bg-remove" icon="🪄" />
        </div>
      </section>

      {/* Education Tools */}
      <section className={styles.section}>
        <h2>🎓 Education Tools</h2>
        <div className={styles.grid}>
          <ToolCard title="Percentage Calculator" desc="Calculate exam percentage" link="/tools/education/percentage" icon="📊" />
          <ToolCard title="CGPA Calculator" desc="Calculate CGPA" link="/tools/education/cgpa" icon="📘" />
          <ToolCard title="GPA Calculator" desc="Calculate GPA" link="/tools/education/gpa" icon="📚" />
          <ToolCard title="Marks to Percentage" desc="Convert marks to percentage" link="/tools/education/marks-percentage" icon="🔄" />
          <ToolCard title="Grade Calculator" desc="Calculate grades" link="/tools/education/grade" icon="🎓" />
          <ToolCard title="Attendance Calculator" desc="Calculate attendance percentage" link="/tools/education/attendance" icon="📅" />
          <ToolCard title="Rank Calculator" desc="Calculate rank" link="/tools/education/rank" icon="🏆" />
          <ToolCard title="Word Counter" desc="Count words in text" link="/tools/education/word-counter" icon="📝" />
          <ToolCard title="Reading Time Calculator" desc="Estimate reading time" link="/tools/education/reading-time" icon="⏱️" />
          <ToolCard title="Text Summarizer" desc="Summarize text" link="/tools/education/text-summarizer" icon="📄" />
          <ToolCard title="Flashcard Maker" desc="Create flashcards" link="/tools/education/flashcard" icon="🃏" />
          <ToolCard title="Quiz Generator" desc="Generate quizzes" link="/tools/education/quiz-generator" icon="❓" />
          <ToolCard title="Notes Organizer" desc="Organize notes" link="/tools/education/notes-organizer" icon="📓" />
          <ToolCard title="Scientific Calculator" desc="Advanced calculator" link="/tools/education/scientific-calc" icon="🧮" />
          <ToolCard title="Unit Converter" desc="Convert units" link="/tools/education/unit-converter" icon="🔄" />
          <ToolCard title="Fraction Calculator" desc="Calculate fractions" link="/tools/education/fraction-calc" icon="➗" />
          <ToolCard title="Average Calculator" desc="Calculate averages" link="/tools/education/average" icon="📊" />
          <ToolCard title="Speed Distance Time" desc="Calculate speed, distance, time" link="/tools/education/speed-distance-time" icon="🏃" />
          <ToolCard title="Interest Calculator" desc="Calculate simple/compound interest" link="/tools/education/interest" icon="💰" />
          <ToolCard title="Question Paper Timer" desc="Timer for exams" link="/tools/education/timer" icon="⏰" />
          <ToolCard title="Answer Sheet Generator" desc="Generate answer sheets" link="/tools/education/answer-sheet" icon="📝" />
          <ToolCard title="OMR Sheet Generator" desc="Generate OMR sheets" link="/tools/education/omr-sheet" icon="📋" />
          <ToolCard title="Revision Planner" desc="Plan revisions" link="/tools/education/revision-planner" icon="📅" />
          <ToolCard title="Checklist" desc="Important topics checklist" link="/tools/education/checklist" icon="✅" />
        </div>
      </section>

      {/* Document / Template Tools */}
      <section className={styles.section}>
        <h2>📋 Document Tools</h2>
        <div className={styles.grid}>
          <ToolCard title="Resume Builder" desc="Create professional resumes" link="/tools/document/resume-builder" icon="📄" />
          <ToolCard title="CV Builder" desc="Create CVs" link="/tools/document/cv-builder" icon="📋" />
          <ToolCard title="Invoice Generator" desc="Generate invoices" link="/tools/document/invoice" icon="💳" />
          <ToolCard title="Bill Generator" desc="Generate bills" link="/tools/document/bill" icon="📄" />
          <ToolCard title="Quotation Generator" desc="Generate quotations" link="/tools/document/quotation" icon="💬" />
          <ToolCard title="Business Card Generator" desc="Create business cards" link="/tools/document/business-card" icon="💼" />
          <ToolCard title="Letterhead Generator" desc="Generate letterheads" link="/tools/document/letterhead" icon="📧" />
          <ToolCard title="Certificate Generator" desc="Create certificates" link="/tools/document/certificate" icon="🏆" />
          <ToolCard title="ID Card Generator" desc="Generate ID cards" link="/tools/document/id-card" icon="🆔" />
          <ToolCard title="Experience Letter Generator" desc="Create experience letters" link="/tools/document/experience-letter" icon="📜" />
          <ToolCard title="Offer Letter Generator" desc="Generate offer letters" link="/tools/document/offer-letter" icon="📨" />
          <ToolCard title="Bonafide Certificate" desc="Create bonafide certificates" link="/tools/document/bonafide" icon="📜" />
          <ToolCard title="Salary Slip Generator" desc="Generate salary slips" link="/tools/document/salary-slip" icon="💵" />
          <ToolCard title="Report Cover Page" desc="Create report covers" link="/tools/document/report-cover" icon="📖" />
        </div>
      </section>

      {/* Text / Web Tools */}
      <section className={styles.section}>
        <h2>📝 Text/Web Tools</h2>
        <div className={styles.grid}>
          <ToolCard title="Word Counter" desc="Count words and characters" link="/tools/text-web/word-counter" icon="📊" />
          <ToolCard title="Character Counter" desc="Count characters" link="/tools/text-web/char-counter" icon="🔢" />
          <ToolCard title="Case Converter" desc="Convert text case" link="/tools/text-web/case-converter" icon="🔄" />
          <ToolCard title="Remove Extra Spaces" desc="Clean text spaces" link="/tools/text-web/remove-spaces" icon="🧹" />
          <ToolCard title="Text Sorter" desc="Sort text lines" link="/tools/text-web/text-sorter" icon="🔤" />
          <ToolCard title="Text Replacer" desc="Find and replace text" link="/tools/text-web/text-replacer" icon="🔍" />
          <ToolCard title="Text to Speech" desc="Convert text to speech" link="/tools/text-web/text-to-speech" icon="🔊" />
          <ToolCard title="Speech to Text" desc="Convert speech to text" link="/tools/text-web/speech-to-text" icon="🎤" />
          <ToolCard title="JSON Formatter" desc="Format JSON" link="/tools/text-web/json-formatter" icon="🔧" />
          <ToolCard title="JSON Validator" desc="Validate JSON" link="/tools/text-web/json-validator" icon="✅" />
          <ToolCard title="Base64 Encode/Decode" desc="Encode/decode Base64" link="/tools/text-web/base64" icon="🔢" />
          <ToolCard title="URL Encode/Decode" desc="Encode/decode URLs" link="/tools/text-web/url-encode" icon="🔗" />
          <ToolCard title="HTML Minifier" desc="Minify HTML" link="/tools/text-web/html-minifier" icon="📄" />
          <ToolCard title="CSS Minifier" desc="Minify CSS" link="/tools/text-web/css-minifier" icon="🎨" />
          <ToolCard title="JS Minifier" desc="Minify JavaScript" link="/tools/text-web/js-minifier" icon="💻" />
          <ToolCard title="Regex Tester" desc="Test regular expressions" link="/tools/text-web/regex-tester" icon="🔍" />
          <ToolCard title="Lorem Ipsum Generator" desc="Generate lorem ipsum text" link="/tools/text-web/lorem-ipsum" icon="📝" />
          <ToolCard title="Meta Tag Generator" desc="Generate meta tags" link="/tools/text-web/meta-generator" icon="🏷️" />
        </div>
      </section>

      {/* File & Utility Tools */}
      <section className={styles.section}>
        <h2>📁 File Tools</h2>
        <div className={styles.grid}>
          <ToolCard title="ZIP File Creator" desc="Create ZIP archives" link="/tools/file/zip-creator" icon="📦" />
          <ToolCard title="File Size Checker" desc="Check file sizes" link="/tools/file/size-checker" icon="📏" />
          <ToolCard title="File Name Bulk Renamer" desc="Rename multiple files" link="/tools/file/bulk-renamer" icon="✏️" />
          <ToolCard title="Text to PDF" desc="Convert text to PDF" link="/tools/file/text-to-pdf" icon="📄" />
          <ToolCard title="PDF to Text" desc="Extract text from PDF" link="/tools/file/pdf-to-text" icon="📝" />
        </div>
      </section>
    </main>
    </>
  );
}
