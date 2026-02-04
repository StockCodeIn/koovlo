import { Metadata } from "next";
import styles from "./legal.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy - Koovlo",
  description: "Learn how Koovlo protects your privacy. Most tools process data locally in your browser for maximum privacy and security.",
  keywords: ["privacy policy", "data protection", "koovlo privacy", "browser-based tools"],
};

export default function PrivacyPage() {
  return (
    <main className={styles.container}>
      <h1>Privacy Policy</h1>
      <p className={styles.lastUpdated}>Last updated: February 2026</p>

      <section className={styles.section}>
        <h2>Our Commitment to Privacy</h2>
        <p>
          At Koovlo, your privacy is our priority. Most of our tools process your data directly in your browser, 
          meaning your files never leave your device. We believe in transparency and want you to understand exactly 
          how we handle your information.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Data Collection and Usage</h2>
        <h3>Browser-Based Processing</h3>
        <p>
          The majority of Koovlo's tools (PDF, Image, Text, and Education tools) operate entirely in your browser. 
          When you use these tools:
        </p>
        <ul>
          <li>Your files are processed locally on your device</li>
          <li>No data is uploaded to our servers</li>
          <li>We cannot access, store, or view your files</li>
          <li>Your data remains completely private</li>
        </ul>

        <h3>Analytics</h3>
        <p>
          We use basic analytics to understand how visitors use our site. This includes:
        </p>
        <ul>
          <li>Page views and navigation patterns</li>
          <li>Device type and browser information</li>
          <li>General location (country/region level)</li>
          <li>No personally identifiable information (PII) is collected</li>
        </ul>

        <h3>Cookies</h3>
        <p>
          We use essential cookies to:
        </p>
        <ul>
          <li>Remember your preferences (like dark mode)</li>
          <li>Save your progress in tools that support auto-save</li>
          <li>Improve user experience</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Third-Party Services</h2>
        <p>
          We may use third-party services for analytics and site functionality. These services may collect 
          anonymized usage data. We do not share personal information with third parties for marketing purposes.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Data Security</h2>
        <p>
          Since most tools process data locally in your browser, your files are never transmitted over the internet. 
          For any data we do collect (like analytics), we use industry-standard security measures to protect it.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Clear your browser's local storage to remove any saved preferences</li>
          <li>Disable cookies through your browser settings</li>
          <li>Contact us with questions about your privacy</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Children's Privacy</h2>
        <p>
          Our services are available to users of all ages. We do not knowingly collect personal information from 
          children under 13. If you believe we have collected such information, please contact us immediately.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this page with an 
          updated "Last updated" date. Continued use of our services after changes constitutes acceptance 
          of the updated policy.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at{" "}
          <a href="mailto:privacy@koovlo.com">privacy@koovlo.com</a>
        </p>
      </section>
    </main>
  );
}
