import type { Metadata } from "next";
import styles from "./legal.module.css";

export const metadata: Metadata = {
  title: "Terms of Use - Koovlo",
  description:
    "Terms and conditions for using Koovlo's free online tools. By using the service, you agree to these terms.",
  keywords: ["terms of use", "terms and conditions", "koovlo terms", "user agreement"],
};

export default function TermsPage() {
  return (
    <main className={styles.container}>
      <h1>Terms of Use</h1>
      <p className={styles.lastUpdated}>Last updated: April 16, 2026</p>

      <section className={styles.section}>
        <h2>Agreement to Terms</h2>
        <p>
          By accessing and using Koovlo, you agree to these Terms of Use. If you do not agree,
          please do not use the service.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Use of Services</h2>
        <h3>Acceptable Use</h3>
        <p>You agree to use Koovlo only for lawful purposes. You may not:</p>
        <ul>
          <li>Use the service to process illegal or harmful content</li>
          <li>Attempt to disrupt, exploit, or damage the website</li>
          <li>Abuse automated traffic in a way that harms availability</li>
          <li>Violate applicable laws or the rights of others</li>
        </ul>

        <h3>Free Service</h3>
        <p>Koovlo provides free online tools and may update, limit, or discontinue features at any time.</p>
      </section>

      <section className={styles.section}>
        <h2>Intellectual Property</h2>
        <p>
          The Koovlo website, including its design, code, and content, is protected by applicable intellectual property laws.
          Your own files remain yours, and Koovlo does not claim ownership of content you process.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Disclaimer of Warranties</h2>
        <p>
          Koovlo is provided on an as-is basis without warranties of any kind. Always keep backups of important files
          before using any online tool.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Koovlo is not liable for indirect, incidental, or consequential damages
          arising from use of the site.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Third-Party Links</h2>
        <p>
          Koovlo may link to third-party services or resources. Those destinations operate under their own terms and policies.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Changes to Terms</h2>
        <p>
          These terms may be updated from time to time. Continued use of the site after updates means you accept the revised terms.
        </p>
      </section>
    </main>
  );
}
