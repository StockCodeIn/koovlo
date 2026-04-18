import type { Metadata } from "next";
import styles from "./legal.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy - Koovlo",
  description:
    "Learn how Koovlo protects privacy. Many tools process data locally in your browser for stronger privacy and security.",
  keywords: ["privacy policy", "data protection", "koovlo privacy", "browser-based tools"],
};

export default function PrivacyPage() {
  return (
    <main className={styles.container}>
      <h1>Privacy Policy</h1>
      <p className={styles.lastUpdated}>Last updated: April 16, 2026</p>

      <section className={styles.section}>
        <h2>Our Commitment to Privacy</h2>
        <p>
          At Koovlo, privacy is a core part of the product. Many tools process data directly in the browser,
          which means files do not need to leave your device to complete common tasks.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Data Collection and Usage</h2>
        <h3>Browser-Based Processing</h3>
        <p>When you use browser-based tools on Koovlo:</p>
        <ul>
          <li>Your files are processed locally on your device whenever the tool supports it.</li>
          <li>No file content is intentionally stored on Koovlo servers for those workflows.</li>
          <li>Your data remains under your control within your own browser session.</li>
        </ul>

        <h3>Analytics</h3>
        <p>We may collect limited analytics to understand site performance and usage, such as:</p>
        <ul>
          <li>Page views and navigation patterns</li>
          <li>Device type and browser information</li>
          <li>General location at a broad regional level</li>
          <li>No personally identifiable file content is collected through standard analytics</li>
        </ul>

        <h3>Local Storage and Cookies</h3>
        <p>Some tools save preferences or draft data in the browser so users can continue where they left off.</p>
      </section>

      <section className={styles.section}>
        <h2>Third-Party Services</h2>
        <p>
          Koovlo may use third-party services for analytics or infrastructure. Those services may process limited technical data
          according to their own policies. Koovlo does not sell personal information.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Data Security</h2>
        <p>
          Browser-based processing reduces unnecessary transfer of sensitive files. For any data involved in site operations,
          reasonable security measures are used to protect it.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Your Rights</h2>
        <ul>
          <li>Clear local storage in your browser to remove saved drafts or preferences</li>
          <li>Disable cookies through browser settings</li>
          <li>Contact Koovlo with privacy questions</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Children&apos;s Privacy</h2>
        <p>
          Koovlo is not intended to knowingly collect personal information from children under 13.
          If you believe that has happened, please contact us so the issue can be reviewed.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Changes to This Policy</h2>
        <p>
          This policy may be updated from time to time. Updates will be reflected on this page with a revised date.
        </p>
      </section>
    </main>
  );
}
