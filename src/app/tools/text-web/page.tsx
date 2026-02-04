// src/app/tools/text-web/page.tsx
import ToolCard from "@/components/ToolCard";
import styles from "../tools-common.module.css";

const tools = [
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

const faqs = [
    {
        q: "Are these text and web tools free?",
        a: "Yes, all tools are free and work directly in your browser.",
    },
    {
        q: "Do I need to upload any files?",
        a: "No uploads needed. Most tools work with direct input on the page.",
    },
    {
        q: "Can I use these tools on mobile?",
        a: "Yes. All tools are optimized for mobile devices.",
    },
    {
        q: "Is my data private?",
        a: "Your data stays in your browser for these tools.",
    },
];

export default function TextWebToolsPage() {
    return (
        <main className={styles.container}>
            <section className={styles.hero}>
                <h1 className={styles.pageTitle}>
                    <span className={styles.icon}>📝</span>
                    <span className={styles.textGradient}>Text & Web Tools</span>
                </h1>
                <p className={styles.subText}>
                    Fast and secure text utilities for writers, developers, and marketers — simple, accurate, and mobile-friendly.
                </p>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Popular Text & Web Tools</h2>
                    <p>Choose a tool and get results instantly.</p>
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
                    <h2>Why use Koovlo Text & Web Tools?</h2>
                    <p>Optimized for speed, clarity, and privacy.</p>
                </div>
                <div className={styles.featureGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>⚡</div>
                        <h3>Instant Output</h3>
                        <p>Get results immediately with clean, minimal inputs.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🔒</div>
                        <h3>Privacy Friendly</h3>
                        <p>Your text stays in your browser for these tools.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>📱</div>
                        <h3>Mobile Ready</h3>
                        <p>Use every tool comfortably on any screen size.</p>
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
