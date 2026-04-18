"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "@/styles/header.module.css";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} onClick={() => setOpen(false)}>
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
          type="button"
          className={styles.menuButton}
          onClick={() => setOpen((current) => !current)}
          aria-label="Toggle navigation"
          aria-expanded={open}
          aria-controls="main-navigation"
        >
          {open ? "Close" : "Menu"}
        </button>

        <nav
          id="main-navigation"
          className={`${styles.nav} ${open ? styles.show : ""}`}
          aria-label="Main navigation"
        >
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/tools" onClick={() => setOpen(false)}>All Tools</Link>
          <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
        </nav>
      </div>
    </header>
  );
}
