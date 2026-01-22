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
        </main>
    );
}
