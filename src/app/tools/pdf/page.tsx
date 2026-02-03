// src/app/tools/pdf/page.tsx
import ToolCard from "@/components/ToolCard";
import styles from "../tools-common.module.css";

const tools = [
  { title: "PDF Merge", desc: "Combine multiple PDFs into one file.", link: "/tools/pdf/merge", icon: "📎" },
  { title: "Extract PDF Pages", desc: "Create a new PDF from selected pages.", link: "/tools/pdf/extract-pages", icon: "✂️" },
  { title: "Split PDF by Page Range", desc: "Split a PDF into multiple files by range.", link: "/tools/pdf/page-range-split", icon: "📄" },
  { title: "Reorder PDF Pages", desc: "Reorder or delete pages visually.", link: "/tools/pdf/reorder", icon: "↕️" },
  { title: "Rotate PDF Pages", desc: "Rotate specific or all PDF pages.", link: "/tools/pdf/rotate", icon: "🔄" },
  { title: "Duplicate PDF Pages", desc: "Copy selected pages within a PDF.", link: "/tools/pdf/duplicate-pages", icon: "📋" },
  { title: "PDF to Images", desc: "Convert PDF pages into images.", link: "/tools/pdf/to-image", icon: "🖼️" },
  { title: "Images to PDF", desc: "Convert images into a PDF document.", link: "/tools/pdf/to-pdf", icon: "📄" },
  { title: "Change PDF Page Size", desc: "Resize pages to A4, Letter, or custom.", link: "/tools/pdf/change-page-size", icon: "📏" },
  { title: "Crop PDF Pages", desc: "Crop margins and unwanted areas.", link: "/tools/pdf/crop", icon: "✂️" },
  { title: "Add Page Numbers to PDF", desc: "Insert custom page numbers.", link: "/tools/pdf/page-number", icon: "🔢" },
  { title: "Compress PDF", desc: "Reduce file size without losing quality.", link: "/tools/pdf/compress", icon: "🗜️" },
  { title: "PDF Metadata Editor", desc: "Add or remove PDF metadata.", link: "/tools/pdf/metadata", icon: "🧾" },
  { title: "Add PDF Watermark", desc: "Add text or image watermark.", link: "/tools/pdf/watermark", icon: "💧" },
  { title: "Convert PDF to Grayscale", desc: "Convert PDFs to black and white.", link: "/tools/pdf/grayscale", icon: "🖤" },
  { title: "PDF to Word Converter", desc: "Convert PDFs into editable Word files.", link: "/tools/pdf/to-word", icon: "📝" },
  { title: "Remove PDF Password", desc: "Unlock password‑protected PDFs.", link: "/tools/pdf/unlock", icon: "🔓" },
  { title: "Sign PDF", desc: "Add a digital signature to PDFs.", link: "/tools/pdf/sign", icon: "✍️" },
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
          <span className={styles.icon}>📄</span>
          <span className={styles.textGradient}>PDF Tools</span>
        </h1>
        <p className={styles.subText}>
          Fast, free, and privacy-friendly PDF tools to merge, compress, split, and manage documents on any device.
        </p>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Popular PDF Tools</h2>
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
