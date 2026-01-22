// src/components/Header.tsx
"use client";
import Link from "next/link";
import { useState } from "react";
import styles from "@/styles/header.module.css";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>Koovlo</Link>

        <button
          className={styles.menuButton}
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>

        <nav className={`${styles.nav} ${open ? styles.show : ""}`}>
          <Link href="/">Home</Link>
          <Link href="/tools">All Tools</Link>
          <Link href="/tools/pdf">PDF</Link>
          <Link href="/tools/image">Image</Link>
          <Link href="/tools/education">Education</Link>
        </nav>
      </div>
    </header>
  );
}
