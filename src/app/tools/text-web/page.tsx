// src/app/tools/text-web/page.tsx
import ToolCard from "@/components/ToolCard";
import styles from "../tools-common.module.css";

export const metadata = {
    title: "Text & Web Tools - Koovlo",
    description:
        "Free online text and web tools including word counter, case converter, text to speech, JSON formatter, and more. No uploads required.",

};

export default function textWebToolsPage() {
    return (

        <main className={styles.container}>
            <h1 className={styles.pageTitle}>
                <span className={styles.icon}>📝</span>
                <span className={styles.textGradient}>Text & Web Tools</span>
            </h1>
            <p className={styles.subText}>
                Explore our collection of free online text and web tools to manipulate, analyze, and convert your text and web data quickly and securely.
            </p>

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
        </main>
    );
}
