// src/app/tools/document/page.tsx
import ToolCard from "@/components/ToolCard";
import styles from "../tools-common.module.css";

const tools = [
    { title: "Resume & CV Builder", desc: "Create ATS-ready resumes and CVs with templates and PDF export", link: "/tools/document/resume-builder", icon: "📄", category: "Document" },
    { title: "Invoice Generator", desc: "Create professional invoices with templates and PDF export", link: "/tools/document/invoice", icon: "🧾", category: "Document" },
    { title: "PDF Form Builder", desc: "Create fillable PDF forms with drag-and-drop editor", link: "/tools/document/pdf-form-builder", icon: "📋", category: "Document" },
];

const faqs = [
    {
        q: "Are these document tools free to use?",
        a: "Yes. All document tools are completely free and work directly in your browser.",
    },
    {
        q: "Do I need to create an account?",
        a: "No account is required. You can open a tool and start creating right away.",
    },
    {
        q: "Can I download documents as PDF?",
        a: "Yes. Most tools support PDF export so you can share or print your documents easily.",
    },
    {
        q: "Is my data safe?",
        a: "Your data stays in your browser for these tools, and you can delete it anytime.",
    },
];

export default function DocumentToolsPage() {
    return (
        <main className={styles.container}>
            <section className={styles.hero}>
                <h1 className={styles.pageTitle}>
                    {/* <span className={styles.icon}>📋</span> */}
                    <span className={styles.textGradient}>Free Online Document Tools – Resume Builder & Invoice Generator</span>
                </h1>
                <p className={styles.subText}>
                    Create professional resumes, CVs, invoices and fillable PDF forms online. Fast, secure and mobile-friendly document tools with instant PDF export.
                </p>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>All Document Tools</h2>
                    <p>Choose a tool and start creating instantly.</p>
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
                    <h2>Why use Koovlo Document Tools?</h2>
                    <p>Built for speed, quality, and a great mobile experience.</p>
                </div>
                <div className={styles.featureGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>⚡</div>
                        <h3>Fast & Simple</h3>
                        <p>Get professional results with easy-to-use templates and smart defaults.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>📱</div>
                        <h3>Mobile Friendly</h3>
                        <p>Create and download documents from any device — desktop or phone.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🔒</div>
                        <h3>Privacy First</h3>
                        <p>Your data stays in your browser. You stay in control.</p>
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
