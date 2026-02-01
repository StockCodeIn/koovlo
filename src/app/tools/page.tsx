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
            <ToolCard title="PDF Merge" desc="Combine multiple PDF files into one document" link="/tools/pdf/merge" icon="📎" />
            <ToolCard title="Extract PDF Pages" desc="Create a new PDF using selected pages only" link="/tools/pdf/extract-pages" icon="✂️" />
            <ToolCard title="Split PDF by Page Range" desc="Split PDF into multiple files by page ranges" link="/tools/pdf/page-range-split" icon="📄" />
            <ToolCard title="Reorder PDF Pages" desc="Reorder or delete PDF pages visually" link="/tools/pdf/reorder" icon="↕️" />
            <ToolCard title="Rotate PDF Pages" desc="Rotate specific or all pages in a PDF" link="/tools/pdf/rotate" icon="🔄" />
            <ToolCard title="Duplicate PDF Pages" desc="Copy selected pages within a PDF file" link="/tools/pdf/duplicate-pages" icon="📋" />
            <ToolCard title="PDF to Images" desc="Convert PDF pages into high-quality images" link="/tools/pdf/to-image" icon="🖼️" />
            <ToolCard title="Images to PDF" desc="Convert JPG, PNG images into a PDF file" link="/tools/pdf/to-pdf" icon="📄" />
            <ToolCard title="Change PDF Page Size" desc="Resize PDF pages to A4, Letter, or custom size" link="/tools/pdf/change-page-size" icon="📏" />
            <ToolCard title="Crop PDF Pages" desc="Crop margins and unwanted areas from PDF pages" link="/tools/pdf/crop" icon="✂️" />
            <ToolCard title="Add Page Numbers to PDF" desc="Insert custom page numbers into your PDF" link="/tools/pdf/page-number" icon="🔢" />
            <ToolCard title="Compress PDF" desc="Reduce PDF file size without losing quality" link="/tools/pdf/compress" icon="🗜️" />
            <ToolCard title="PDF Metadata Editor" desc="Add or remove metadata from PDF files" link="/tools/pdf/metadata" icon="🧾" />
            <ToolCard title="Add PDF Watermark" desc="Add text or image watermark to PDF files" link="/tools/pdf/watermark" icon="💧" />
            <ToolCard title="Convert PDF to Grayscale" desc="Turn colorful PDFs into black-and-white files" link="/tools/pdf/grayscale" icon="🖤" />
            <ToolCard title="PDF to Word Converter" desc="Convert PDF documents into editable Word files" link="/tools/pdf/to-word" icon="📝" />
            <ToolCard title="Remove PDF Password" desc="Unlock password-protected PDF files" link="/tools/pdf/unlock" icon="🔓" />
            <ToolCard title="Sign PDF" desc="Add a digital signature to your PDF" link="/tools/pdf/sign" icon="✍️" />
          </div>
        </section>

        {/* Image Tools */}
        <section className={styles.section}>
          <h2>🖼️ Image Tools</h2>
          <div className={styles.grid}>
            <ToolCard title="Image Resize" desc="Resize multiple images with presets, percentage, or exact dimensions." link="/tools/image/resize" icon="📏" />
            <ToolCard title="Image Compress" desc="Compress multiple images at once. Fast, private, and free." link="/tools/image/compress" icon="🗜️" />
            <ToolCard title="Image Convert" desc="Convert multiple images between formats. Fast, private, and free." link="/tools/image/convert" icon="🔄" />
            <ToolCard title="Add Image Watermark" desc="Add text or logo watermark to images" link="/tools/image/add-watermark" icon="💧" />
            <ToolCard title="Strip Metadata" desc="Remove EXIF metadata from images" link="/tools/image/strip-metadata" icon="🗑️" />
          </div>
        </section>

        {/* Education Tools */}
        <section className={styles.section}>
          <h2>🎓 Education Tools</h2>
          <div className={styles.grid}>
            <ToolCard title="Percentage Calculator" desc="Calculate exam percentage" link="/tools/education/percentage" icon="📊" />
            <ToolCard title="CGPA Calculator" desc="Calculate overall CGPA across all semesters with credits & percentage" link="/tools/education/cgpa" icon="📘" />
            <ToolCard title="GPA Calculator" desc="Calculate current semester GPA and predict required grades for your target" link="/tools/education/gpa" icon="📚" />
            <ToolCard title="Grade Calculator" desc="Calculate weighted grades" link="/tools/education/grade" icon="🎓" />
            <ToolCard title="Attendance Calculator" desc="Track and calculate attendance" link="/tools/education/attendance" icon="📅" />
            <ToolCard title="Rank Calculator" desc="Calculate class rank & percentile" link="/tools/education/rank" icon="🏆" />
            <ToolCard title="Text Summarizer" desc="Summarize long text instantly" link="/tools/education/text-summarizer" icon="📄" />
            <ToolCard title="Flashcard Maker" desc="Create study flashcards" link="/tools/education/flashcard" icon="🃏" />
            <ToolCard title="Quiz Generator" desc="Generate practice quizzes" link="/tools/education/quiz-generator" icon="❓" />
            <ToolCard title="Notes Organizer" desc="Professional note-taking with categories, tags, pinning, and advanced organization" link="/tools/education/notes-organizer" icon="📓" />
            <ToolCard title="Revision Planner" desc="Plan your exam revision" link="/tools/education/revision-planner" icon="📅" />
          </div>
        </section>

        {/* Document / Template Tools */}
        <section className={styles.section}>
          <h2>📋 Document Tools</h2>
          <div className={styles.grid}>
            <ToolCard title="Resume Builder" desc="Create professional resumes with PDF export" link="/tools/document/resume-builder" icon="📄" />
            <ToolCard title="CV Builder" desc="Build comprehensive CVs" link="/tools/document/cv-builder" icon="📋" />
            <ToolCard title="Invoice Generator" desc="Generate professional invoices" link="/tools/document/invoice" icon="💳" />
            <ToolCard title="PDF Form Builder" desc="Create fillable PDF forms" link="/tools/document/pdf-form-builder" icon="📝" />
          </div>
        </section>

        {/* Text / Web Tools */}
        <section className={styles.section}>
          <h2>📝 Text/Web Tools</h2>
          <div className={styles.grid}>
            <ToolCard title="Word Counter" desc="Count words, characters & reading time" link="/tools/text-web/word-counter" icon="📊" />
            <ToolCard title="Case Converter" desc="Convert text case instantly" link="/tools/text-web/case-converter" icon="🔄" />
            <ToolCard title="Text to Speech" desc="Convert text to speech" link="/tools/text-web/text-to-speech" icon="🔊" />
            <ToolCard title="JSON Formatter" desc="Format & validate JSON" link="/tools/text-web/json-formatter" icon="🔧" />
            <ToolCard title="Base64 Encode/Decode" desc="Encode/decode Base64" link="/tools/text-web/base64" icon="🔢" />
            <ToolCard title="URL Encode/Decode" desc="Encode/decode URLs" link="/tools/text-web/url-encode" icon="🔗" />
            <ToolCard title="Regex Tester" desc="Test regular expressions" link="/tools/text-web/regex-tester" icon="🔍" />
            <ToolCard title="Lorem Ipsum Generator" desc="Generate placeholder text" link="/tools/text-web/lorem-ipsum" icon="📝" />
          </div>
        </section>
      </main>
    </>
  );
}
