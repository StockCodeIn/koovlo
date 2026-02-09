// src/components/Header.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import styles from "@/styles/header.module.css";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/brand/logo.svg"
            alt="Koovlo logo"
            className={styles.logoImg}
            width={32}
            height={32}
            priority
          />
           <span className={styles.logoText}>Koovlo</span>
        </Link>


        <button
          className={styles.menuButton}
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? "✕" : "☰"}
        </button>

        <nav className={`${styles.nav} ${open ? styles.show : ""}`}>
          <Link href="/">Home</Link>
          <Link href="/tools">All Tools</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
