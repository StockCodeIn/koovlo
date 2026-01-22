// src/components/Footer.tsx
"use client"; // ✅ Add this line

import Link from "next/link";
import styles from "@/styles/footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Newsletter CTA */}
      <section className={styles.newsletter}>
        <h2>✨ Stay updated with Koovlo</h2>
        <p>Join our newsletter for new tools, tips, and exclusive updates.</p>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thank you for subscribing!");
          }}
        >
          <input
            type="email"
            placeholder="Enter your email"
            required
            aria-label="Email"
          />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      {/* Main Footer */}
      <div className={styles.container}>
        {/* Brand Info */}
        <div className={styles.brand}>
          <h2>Koovlo</h2>
          <p>
            Free online tools for PDF, Images, Education and more.  
            Built to make everyday digital tasks simpler, faster and secure.
          </p>
        </div>

        {/* Quick Links */}
        <div className={styles.links}>
          <h3>Explore</h3>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/tools">All Tools</Link></li>
            <li><Link href="/tools/pdf">PDF Tools</Link></li>
            <li><Link href="/tools/image">Image Tools</Link></li>
            <li><Link href="/tools/education">Education</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div className={styles.links}>
          <h3>Company</h3>
          <ul>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Use</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div className={styles.social}>
          <h3>Follow Us</h3>
          <div className={styles.icons}>
            <a href="https://twitter.com/" target="_blank" aria-label="Twitter">🐦</a>
            <a href="https://linkedin.com/" target="_blank" aria-label="LinkedIn">💼</a>
            <a href="https://instagram.com/" target="_blank" aria-label="Instagram">📸</a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className={styles.bottom}>
        <p>© {year} Koovlo. All rights reserved.</p>
        <p>
          Built with ❤️ by <Link href="/">Koovlo Team</Link>
        </p>
      </div>
    </footer>
  );
}
