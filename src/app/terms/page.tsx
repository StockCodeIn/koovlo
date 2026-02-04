import { Metadata } from "next";
import styles from "./legal.module.css";

export const metadata: Metadata = {
  title: "Terms of Use - Koovlo",
  description: "Terms and conditions for using Koovlo's free online tools. By using our services, you agree to these terms.",
  keywords: ["terms of use", "terms and conditions", "koovlo terms", "user agreement"],
};

export default function TermsPage() {
  return (
    <main className={styles.container}>
      <h1>Terms of Use</h1>
      <p className={styles.lastUpdated}>Last updated: February 2026</p>

      <section className={styles.section}>
        <h2>Agreement to Terms</h2>
        <p>
          By accessing and using Koovlo's website and services, you agree to be bound by these Terms of Use. 
          If you do not agree to these terms, please do not use our services.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Use of Services</h2>
        <h3>Acceptable Use</h3>
        <p>You agree to use Koovlo's tools and services only for lawful purposes. You may not:</p>
        <ul>
          <li>Use the services to process illegal or harmful content</li>
          <li>Attempt to hack, disrupt, or damage the website</li>
          <li>Use automated tools to scrape or overload our servers</li>
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe on intellectual property rights of others</li>
        </ul>

        <h3>Free Service</h3>
        <p>
          Koovlo provides free online tools for personal and commercial use. We reserve the right to:
        </p>
        <ul>
          <li>Modify, suspend, or discontinue any service at any time</li>
          <li>Introduce usage limits or restrictions</li>
          <li>Update features and functionality</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Intellectual Property</h2>
        <p>
          The Koovlo website, including its design, code, and content, is protected by copyright and other 
          intellectual property laws. You may not copy, modify, or distribute our code or content without permission.
        </p>
        <p>
          <strong>Your Content:</strong> You retain all rights to files you process using our tools. We do not 
          claim ownership of your content.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Disclaimer of Warranties</h2>
        <p>
          Koovlo's services are provided "as is" without warranties of any kind, either express or implied. We do not guarantee that:
        </p>
        <ul>
          <li>The services will be uninterrupted or error-free</li>
          <li>Results will be accurate or reliable</li>
          <li>Any errors will be corrected</li>
        </ul>
        <p>
          You use our tools at your own risk. Always keep backups of important files.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Koovlo shall not be liable for any indirect, incidental, 
          special, or consequential damages arising from your use of our services, including but not limited to:
        </p>
        <ul>
          <li>Loss of data or files</li>
          <li>Business interruption</li>
          <li>Loss of profits</li>
          <li>Any other commercial damages</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Third-Party Links</h2>
        <p>
          Our website may contain links to third-party websites. We are not responsible for the content, 
          privacy policies, or practices of these external sites.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms of Use at any time. Changes will be effective immediately 
          upon posting. Your continued use of our services after changes constitutes acceptance of the modified terms.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Governing Law</h2>
        <p>
          These Terms of Use shall be governed by and construed in accordance with applicable laws, 
          without regard to conflict of law provisions.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Contact Information</h2>
        <p>
          If you have questions about these Terms of Use, please contact us at{" "}
          <a href="mailto:legal@koovlo.com">legal@koovlo.com</a>
        </p>
      </section>
    </main>
  );
}
