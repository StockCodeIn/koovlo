import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "Koovlo – 50+ Free Online PDF, Image & Web Tools",
  description:
    "Koovlo offers 50+ powerful free online tools including PDF Merge, Compress PDF, Resume Builder, Image Converter, GPA Calculator, Word Counter and more. Fast, secure and mobile friendly.",
};

const featuredTools = [
  { title: "PDF Merge", href: "/tools/pdf/merge", icon: "📎" },
  { title: "Compress PDF", href: "/tools/pdf/compress", icon: "🗜️" },
  { title: "PDF to Word", href: "/tools/pdf/to-word", icon: "📝" },
  { title: "Image Resize", href: "/tools/image/resize", icon: "📏" },
  { title: "Image Convert", href: "/tools/image/convert", icon: "🔄" },
  { title: "Image to PDF", href: "/tools/pdf/to-pdf", icon: "📄" },
  { title: "Resume Builder", href: "/tools/document/resume-builder", icon: "📄" },
  { title: "Invoice Generator", href: "/tools/document/invoice", icon: "🧾" },
  { title: "GPA Calculator", href: "/tools/education/gpa", icon: "📊" },
  { title: "CGPA Calculator", href: "/tools/education/cgpa", icon: "📈" },
  { title: "Word Counter", href: "/tools/text-web/word-counter", icon: "🔢" },
  { title: "JSON Formatter", href: "/tools/text-web/json-formatter", icon: "{ }" },
];

const categories = [
  { label: "PDF Tools", href: "/tools/pdf" },
  { label: "Image Tools", href: "/tools/image" },
  { label: "Education Tools", href: "/tools/education" },
  { label: "Document Tools", href: "/tools/document" },
  { label: "Text & Web Tools", href: "/tools/text-web" },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <h1>All-in-One Free Online Tools Platform</h1>
        <p>
          50+ powerful tools for PDF editing, image processing, resume creation,
          education calculators, and web utilities — fast, secure and completely free.
        </p>

        <div className={styles.heroButtons}>
          <Link href="/tools" className={styles.primaryBtn}>
            Explore All Tools
          </Link>
        </div>

        {/* AnimatedStats removed — considered duplicate/placeholder metrics */}
      </section>

      {/* FEATURED TOOLS */}
      <section className={styles.featured}>
        <h2>Most Popular Tools</h2>
        <div className={styles.featuredGrid}>
          {featuredTools.map((tool) => (
            <Link key={tool.href} href={tool.href} className={styles.toolCard}>
              <div className={styles.icon}>{tool.icon}</div>
              <h3>{tool.title}</h3>
              {/* <p>{tool.desc}</p> */}
            </Link>
          ))}
        </div>
      </section>

      {/* CATEGORY SECTION */}
      <section className={styles.categories}>
        <h2>Browse Tools by Category</h2>
        <div className={styles.categoryGrid}>
          {categories.map((cat) => (
            <Link key={cat.href} href={cat.href} className={styles.categoryCard}>
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section className={styles.trust}>
        <h2>Why Choose Koovlo?</h2>
        <div className={styles.trustGrid}>
          <div>⚡ Lightning Fast Processing</div>
          <div>🔒 Privacy Focused</div>
          <div>📱 Fully Mobile Optimized</div>
          <div>🆓 100% Free Tools</div>
        </div>
      </section>
      {/* SEO CONTENT */}
      <section className={styles.seo}>
        <h2>Powerful & Secure Online Tools</h2>
        <p>
          Koovlo provides free and secure tools for PDF editing, image conversion,
          resume building, GPA calculation, JSON formatting and more.
          Whether you need to merge PDFs, compress images or generate invoices,
          Koovlo makes it fast and effortless.
        </p>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Are Koovlo tools free?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, all tools are completely free to use.",
                },
              },
              {
                "@type": "Question",
                name: "Is my data secure?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, files are processed securely and not stored permanently.",
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}