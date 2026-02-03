// src/app/tools/text-web/page.tsx
import ToolCard from "@/components/ToolCard";
import styles from "../tools-common.module.css";

const tools = [
    { title: "Word Counter", desc: "Count words, characters, and reading time.", link: "/tools/text-web/word-counter", icon: "📊" },
    { title: "Case Converter", desc: "Convert text case instantly.", link: "/tools/text-web/case-converter", icon: "🔄" },
    { title: "Text to Speech", desc: "Turn text into natural speech.", link: "/tools/text-web/text-to-speech", icon: "🔊" },
    { title: "JSON Formatter", desc: "Format, validate, and beautify JSON.", link: "/tools/text-web/json-formatter", icon: "🔧" },
    { title: "Base64 Encode/Decode", desc: "Encode or decode Base64 quickly.", link: "/tools/text-web/base64", icon: "🔢" },
    { title: "URL Encode/Decode", desc: "Encode or decode URLs safely.", link: "/tools/text-web/url-encode", icon: "🔗" },
    { title: "Regex Tester", desc: "Test and debug regular expressions.", link: "/tools/text-web/regex-tester", icon: "🔍" },
    { title: "Lorem Ipsum Generator", desc: "Generate placeholder text for design.", link: "/tools/text-web/lorem-ipsum", icon: "📝" },
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
