// src/components/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Main Footer */}
      <div className={styles.container}>
        {/* Brand Info */}
        <div className={styles.brand}>
          <div className={styles.brandHeader}>
            <Image
              src="/brand/logo.svg"
              alt="Koovlo logo"
              className={styles.footerLogo}
              width={32}
              height={32}
            />

            <h3>Koovlo</h3>
          </div>
          <p>
            Free online tools for PDF editing, image processing, education calculators, and more.
            All tools work in your browser for maximum privacy and speed.
          </p>
        </div>

        {/* Tools Links */}
        <div className={styles.links}>
          <h3>Popular Tools</h3>
          <ul>
            <li><Link href="/tools/pdf/merge">Merge PDF</Link></li>
            <li><Link href="/tools/pdf/compress">Compress PDF</Link></li>
            <li><Link href="/tools/image/compress">Compress Image</Link></li>
            <li><Link href="/tools/document/resume-builder">Resume Builder</Link></li>
            <li><Link href="/tools/education/gpa">GPA Calculator</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className={styles.links}>
          <h3>Categories</h3>
          <ul>
            <li><Link href="/tools">All Tools</Link></li>
            <li><Link href="/tools/pdf">PDF Tools</Link></li>
            <li><Link href="/tools/image">Image Tools</Link></li>
            <li><Link href="/tools/education">Education Tools</Link></li>
            <li><Link href="/tools/document">Document Tools</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div className={styles.links}>
          <h3>Company</h3>
          <ul>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Use</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className={styles.bottom}>
        <div className={styles.bottomLeft}>
          <p>© {year} Koovlo. All rights reserved.</p>
          <p>Free online tools for everyone.</p>
        </div>
      </div>
    </footer>
  );
}
