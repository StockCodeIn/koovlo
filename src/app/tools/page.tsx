// src/app/tools/page.tsx
"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import ToolCard from "@/components/ToolCard";
import styles from "./tools.module.css";

const faqs = [
  {
    q: "Are all tools free to use?",
    a: "Yes, all Koovlo tools are free and available directly in your browser.",
  },
  {
    q: "Do I need to create an account?",
    a: "No signup required. Just open any tool and start using it.",
  },
  {
    q: "Is my data safe?",
    a: "Most tools process data locally in your browser for better privacy.",
  },
  {
    q: "Can I use these tools on mobile?",
    a: "Yes. The tools are designed to work smoothly on phones and tablets.",
  },
];

interface Tool {
  title: string;
  desc: string;
  link: string;
  icon: string;
  category: string;
}

export default function AllTools() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search input (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const allTools: Tool[] = [
    { title: "PDF Merge", desc: "Combine multiple PDFs into one document", link: "/tools/pdf/merge", icon: "📎", category: "PDF" },
    { title: "Extract PDF Pages", desc: "Extract specific pages by number or range", link: "/tools/pdf/extract-pages", icon: "✂️", category: "PDF" },
    { title: "Split PDF by Page Range", desc: "Split PDF by custom page ranges into multiple files", link: "/tools/pdf/page-range-split", icon: "📄", category: "PDF" },
    { title: "Reorder PDF Pages", desc: "Drag-and-drop to rearrange or delete pages", link: "/tools/pdf/reorder", icon: "↕️", category: "PDF" },
    { title: "Rotate PDF Pages", desc: "Rotate all pages by 90°, 180°, or 270°", link: "/tools/pdf/rotate", icon: "🔄", category: "PDF" },
    { title: "Compress PDF", desc: "Reduce PDF file size with 3 compression levels", link: "/tools/pdf/compress", icon: "🗜️", category: "PDF" },
    { title: "PDF to Image", desc: "Convert PDF pages to PNG or JPG images", link: "/tools/pdf/to-image", icon: "🖼️", category: "PDF" },
    { title: "Image to PDF", desc: "Convert JPG and PNG images to PDF", link: "/tools/pdf/to-pdf", icon: "📄", category: "PDF" },
    { title: "PDF to Word", desc: "Convert PDF to editable Word (DOCX) files", link: "/tools/pdf/to-word", icon: "📝", category: "PDF" },
    { title: "Add Watermark", desc: "Add custom text or image watermarks to PDFs", link: "/tools/pdf/watermark", icon: "💧", category: "PDF" },
    { title: "PDF Page Numbers", desc: "Add customizable page numbers to PDFs", link: "/tools/pdf/page-number", icon: "🔢", category: "PDF" },
    { title: "Duplicate PDF Pages", desc: "Create copies of specific pages within your PDF", link: "/tools/pdf/duplicate-pages", icon: "📋", category: "PDF" },
    { title: "Crop PDF Pages", desc: "Remove margins or crop specific areas from PDFs", link: "/tools/pdf/crop", icon: "✂️", category: "PDF" },
    { title: "Change Page Size", desc: "Resize PDF pages to standard or custom sizes", link: "/tools/pdf/change-page-size", icon: "📏", category: "PDF" },
    { title: "PDF Metadata", desc: "View and edit PDF properties and information", link: "/tools/pdf/metadata", icon: "🏷️", category: "PDF" },
    { title: "Grayscale PDF", desc: "Convert colored PDFs to black and white", link: "/tools/pdf/grayscale", icon: "🖤", category: "PDF" },
    { title: "Sign PDF", desc: "Add signatures, initials, dates, and text", link: "/tools/pdf/sign", icon: "✍️", category: "PDF" },
    { title: "Unlock PDF", desc: "Remove password protection from secured PDFs", link: "/tools/pdf/unlock", icon: "🔓", category: "PDF" },

    // Image Tools
    { title: "Resize Image", desc: "Resize images with presets and aspect ratio control", link: "/tools/image/resize", icon: "📏", category: "Image" },
    { title: "Compress Image", desc: "Reduce image size with quality and format control", link: "/tools/image/compress", icon: "📦", category: "Image" },
    { title: "Convert Image", desc: "Convert between PNG, JPG, and WebP formats", link: "/tools/image/convert", icon: "🔄", category: "Image" },
    { title: "Add Watermark", desc: "Add text and image watermarks to photos", link: "/tools/image/add-watermark", icon: "💧", category: "Image" },
    { title: "Strip Metadata", desc: "Remove EXIF data and metadata from images", link: "/tools/image/strip-metadata", icon: "🧹", category: "Image" },

    // Education Tools
    { title: "GPA Calculator", desc: "Calculate GPA with credits and multiple grade scales", link: "/tools/education/gpa", icon: "📊", category: "Education" },
    { title: "CGPA Calculator", desc: "Calculate CGPA across semesters with grade tracking", link: "/tools/education/cgpa", icon: "📈", category: "Education" },
    { title: "Grade Calculator", desc: "Convert marks to grades with weighted subjects", link: "/tools/education/grade", icon: "📝", category: "Education" },
    { title: "Percentage Calculator", desc: "Calculate percentages and CGPA conversions instantly", link: "/tools/education/percentage", icon: "🔢", category: "Education" },
    { title: "Attendance Tracker", desc: "Track and calculate attendance percentage daily", link: "/tools/education/attendance", icon: "📅", category: "Education" },
    { title: "Flashcard Creator", desc: "Create and study with categorized flashcards", link: "/tools/education/flashcard", icon: "🎴", category: "Education" },
    { title: "Quiz Generator", desc: "Create custom quizzes with multiple question types", link: "/tools/education/quiz-generator", icon: "❓", category: "Education" },
    { title: "Notes Organizer", desc: "Organize notes by category, tags, and colors", link: "/tools/education/notes-organizer", icon: "📓", category: "Education" },
    { title: "Revision Planner", desc: "Plan study schedule and track exam preparation", link: "/tools/education/revision-planner", icon: "📅", category: "Education" },
    { title: "Rank Calculator", desc: "Calculate rankings and score statistics instantly", link: "/tools/education/rank", icon: "🏆", category: "Education" },
    // Document Tools
    { title: "Resume & CV Builder", desc: "Create ATS-ready resumes and CVs with templates and PDF export", link: "/tools/document/resume-builder", icon: "📄", category: "Document" },
    { title: "Invoice Generator", desc: "Create professional invoices with templates and PDF export", link: "/tools/document/invoice", icon: "🧾", category: "Document" },
    { title: "PDF Form Builder", desc: "Create fillable PDF forms with drag-and-drop editor", link: "/tools/document/pdf-form-builder", icon: "📋", category: "Document" },

    // Text/Web Tools
    { title: "Word Counter", desc: "Count words, characters, and reading time", link: "/tools/text-web/word-counter", icon: "📊", category: "Text/Web" },
    { title: "Case Converter", desc: "Convert text to uppercase, lowercase, camelCase", link: "/tools/text-web/case-converter", icon: "🔤", category: "Text/Web" },
    { title: "JSON Formatter", desc: "Format, validate, and minify JSON instantly", link: "/tools/text-web/json-formatter", icon: "{ }", category: "Text/Web" },
    { title: "Base64 Encoder/Decoder", desc: "Encode and decode Base64 strings online", link: "/tools/text-web/base64", icon: "🔐", category: "Text/Web" },
    { title: "URL Encoder/Decoder", desc: "Encode and decode URLs with custom options", link: "/tools/text-web/url-encode", icon: "🔗", category: "Text/Web" },
    { title: "Text to Speech", desc: "Convert text to audio with voice selection", link: "/tools/text-web/text-to-speech", icon: "🔊", category: "Text/Web" },
    { title: "Regex Tester", desc: "Test and debug regular expressions instantly", link: "/tools/text-web/regex-tester", icon: "🔍", category: "Text/Web" },
    { title: "Lorem Ipsum Generator", desc: "Generate dummy text for mockups and designs", link: "/tools/text-web/lorem-ipsum", icon: "📄", category: "Text/Web" },
    { title: "Text Summarizer", desc: "Summarize long text with multiple modes", link: "/tools/text-web/text-summarizer", icon: "📝", category: "Text/Web" },
  ];

  const filteredTools = useMemo(() => {
    if (!debouncedQuery.trim()) return allTools;
    
    const query = debouncedQuery.toLowerCase();
    return allTools.filter(
      (tool) =>
        tool.title.toLowerCase().includes(query) ||
        tool.desc.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query)
    );
  }, [debouncedQuery]);

  const toolsByCategory = useMemo(() => {
    const categories = {
      "PDF Tools": [] as Tool[],
      "Image Tools": [] as Tool[],
      "Education Tools": [] as Tool[],
      "Document Tools": [] as Tool[],
      "Text/Web Tools": [] as Tool[],
    };

    filteredTools.forEach((tool) => {
      if (tool.category === "PDF") {
        categories["PDF Tools"].push(tool);
      } else if (tool.category === "Image") {
        categories["Image Tools"].push(tool);
      } else if (tool.category === "Education") {
        categories["Education Tools"].push(tool);
      } else if (tool.category === "Document") {
        categories["Document Tools"].push(tool);
      } else if (tool.category === "Text/Web") {
        categories["Text/Web Tools"].push(tool);
      }
    });

    return categories;
  }, [filteredTools]);

  return (
    <main className={styles.main}>
        <section className={styles.heroSection}>
          <h1>All Tools</h1>
          <p>Explore our complete collection of productivity tools</p>

          {/* Search Bar */}
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              id="tools-search"
              type="text"
              placeholder="Search tools... (e.g., PDF merge, compress, resize)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              aria-label="Search tools"
            />
            {searchQuery && (
              <button
                className={styles.clearBtn}
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {searchQuery && (
            <p className={styles.resultCount}>
              Found <strong>{filteredTools.length}</strong> tool{filteredTools.length !== 1 ? "s" : ""}
            </p>
          )}
        </section>

        {/* Conditionally render sections only if they have tools */}
        {toolsByCategory["PDF Tools"].length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>📄 PDF Tools <span className={styles.count}>({toolsByCategory["PDF Tools"].length})</span></h2>
              <p>Merge, split, compress, convert, and manage PDFs easily.</p>
            </div>
            <div className={styles.grid}>
              {toolsByCategory["PDF Tools"].map((tool) => (
                <ToolCard
                  key={tool.title}
                  title={tool.title}
                  desc={tool.desc}
                  link={tool.link}
                  icon={tool.icon}
                />
              ))}
            </div>
          </section>
        )}

        {toolsByCategory["Image Tools"].length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>🖼️ Image Tools <span className={styles.count}>({toolsByCategory["Image Tools"].length})</span></h2>
              <p>Resize, compress, convert, and protect your images.</p>
            </div>
            <div className={styles.grid}>
              {toolsByCategory["Image Tools"].map((tool) => (
                <ToolCard
                  key={tool.title}
                  title={tool.title}
                  desc={tool.desc}
                  link={tool.link}
                  icon={tool.icon}
                />
              ))}
            </div>
          </section>
        )}

        {toolsByCategory["Education Tools"].length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>🎓 Education Tools <span className={styles.count}>({toolsByCategory["Education Tools"].length})</span></h2>
              <p>Calculators and study helpers for students and teachers.</p>
            </div>
            <div className={styles.grid}>
              {toolsByCategory["Education Tools"].map((tool) => (
                <ToolCard
                  key={tool.title}
                  title={tool.title}
                  desc={tool.desc}
                  link={tool.link}
                  icon={tool.icon}
                />
              ))}
            </div>
          </section>
        )}

        {toolsByCategory["Document Tools"].length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>📋 Document Tools <span className={styles.count}>({toolsByCategory["Document Tools"].length})</span></h2>
              <p>Create resumes, invoices, and fillable documents.</p>
            </div>
            <div className={styles.grid}>
              {toolsByCategory["Document Tools"].map((tool) => (
                <ToolCard
                  key={tool.title}
                  title={tool.title}
                  desc={tool.desc}
                  link={tool.link}
                  icon={tool.icon}
                />
              ))}
            </div>
          </section>
        )}

        {toolsByCategory["Text/Web Tools"].length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>📝 Text/Web Tools <span className={styles.count}>({toolsByCategory["Text/Web Tools"].length})</span></h2>
              <p>Analyze, convert, and transform text instantly.</p>
            </div>
            <div className={styles.grid}>
              {toolsByCategory["Text/Web Tools"].map((tool) => (
                <ToolCard
                  key={tool.title}
                  title={tool.title}
                  desc={tool.desc}
                  link={tool.link}
                  icon={tool.icon}
                />
              ))}
            </div>
          </section>
        )}

        {filteredTools.length === 0 && (
          <section className={styles.section}>
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>🔍</div>
              <h3>No tools found</h3>
              <p>Try adjusting your search terms or browse all categories</p>
              <button
                className={styles.resetBtn}
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </button>
            </div>
          </section>
        )}

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Why Choose Koovlo?</h2>
            <p>Fast, free, and reliable tools for everyone</p>
          </div>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚡</div>
              <h3>Lightning Fast</h3>
              <p>All tools are optimized for speed and performance.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🆓</div>
              <h3>100% Free</h3>
              <p>No hidden charges. Use all tools completely free.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔒</div>
              <h3>Privacy First</h3>
              <p>Your data is processed locally in your browser.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📱</div>
              <h3>Mobile Ready</h3>
              <p>All tools are optimized for phones and tablets.</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to common questions.</p>
          </div>
          <div className={styles.faqGrid}>
            {faqs.map((item) => (
              <div key={item.q} className={styles.faqCard}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
  );
}

