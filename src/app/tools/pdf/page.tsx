// src/app/tools/pdf/page.tsx
import { Suspense } from "react";
import ToolCard from "@/components/ToolCard";
import styles from "../tools-common.module.css";
import Link from "next/link";

const tools = [
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
];

const faqs = [
  {
    q: "Are these PDF tools free?",
    a: "Yes, all PDF tools are free and work directly in your browser.",
  },
  {
    q: "Do you upload my PDFs to a server?",
    a: "No. Processing happens locally in your browser for privacy.",
  },
  {
    q: "Can I use these tools on mobile?",
    a: "Yes. The tools are optimized for phones and tablets.",
  },
  {
    q: "Is there any file size limit?",
    a: "Large files may take longer to process, but there is no fixed limit.",
  },
];

export default function PdfToolsPage() {
  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.pageTitle}>
          {/* <span className={styles.icon}>📄</span> */}
          <span className={styles.textGradient}>Free Online PDF Tools – Merge, Compress, Split & More
          </span>
        </h1>
        <p className={styles.subText}>
          Fast, free, and privacy-friendly PDF tools to merge, compress, split, and manage documents on any device.
        </p>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>All PDF Tools</h2>
          <p>Pick a tool to start working with your PDFs instantly.</p>
        </div>
        <div className={styles.grid}>
          {tools.map((tool) => (
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

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Link href="/tools">View All Tools →</Link>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Why use Koovlo PDF Tools?</h2>
          <p>Designed for speed, quality, and privacy.</p>
        </div>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>Fast Processing</h3>
            <p>Work with PDFs quickly without long uploads.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h3>Privacy First</h3>
            <p>Your documents stay on your device during processing.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📱</div>
            <h3>Mobile Friendly</h3>
            <p>Edit and convert PDFs easily on any screen size.</p>
          </div>
        </div>
      </section>

      <Suspense fallback={<div style={{ minHeight: "320px" }} />}>
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
      </Suspense>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
              },
            })),
          }),
        }}
      />
    </main>
  );
}
