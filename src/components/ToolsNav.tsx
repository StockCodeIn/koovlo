"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/styles/toolsnav.module.css";

const categories = [
  { name: "PDF", path: "/tools/pdf", emoji: "📄" },
  { name: "Image", path: "/tools/image", emoji: "🖼️" },
  { name: "Education", path: "/tools/education", emoji: "🎓" },
  { name: "Document", path: "/tools/document", emoji: "📋" },
  { name: "Text/Web", path: "/tools/text-web", emoji: "📝" },
  { name: "All", path: "/tools", emoji: "✨" },
];

export default function ToolsNav() {
  const pathname = usePathname() || "";

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Delay a little longer so layout and fonts settle before scrolling.
    const id = setTimeout(() => {
      try {
        window.scrollTo({ top: 0, behavior: "auto" });
      } catch (e) {
        window.scrollTo(0, 0);
      }
      // Remove focus from the nav link (prevents browser from scrolling focused element)
      try {
        const active = document.activeElement as HTMLElement | null;
        if (active && (active.tagName === "A" || active.getAttribute("role") === "link")) {
          active.blur();
        }

        // Move focus to main content to avoid focus-driven jump. Use preventScroll when possible.
        const main = document.querySelector("main") as HTMLElement | null;
        if (main) {
          const hadTab = main.hasAttribute("tabindex");
          const prev = main.getAttribute("tabindex");
          main.setAttribute("tabindex", "-1");
          try {
            main.focus({ preventScroll: true } as FocusOptions);
          } catch (e) {
            main.focus();
          }
          if (!hadTab) {
            if (prev === null) main.removeAttribute("tabindex");
            else main.setAttribute("tabindex", prev);
          }
        }
      } catch (e) {
        // ignore focus-related errors
      }
    }, 200);

    return () => clearTimeout(id);
  }, [pathname]);

  // Prevent automatic browser scroll restoration which can conflict with our manual scroll.
  useEffect(() => {
    if (typeof window === "undefined" || !('scrollRestoration' in window.history)) return;
    const prev = window.history.scrollRestoration;
    try {
      window.history.scrollRestoration = 'manual';
    } catch (e) {
      // ignore in environments that disallow setting this
    }

    return () => {
      try {
        window.history.scrollRestoration = prev;
      } catch (e) {
        // ignore
      }
    };
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.scrollWrap}>
        {categories.map((cat) => {
          const isActive =
            cat.path === "/tools"
              ? pathname === "/tools"
              : pathname.startsWith(cat.path);

          return (
            <Link
              key={cat.path}
              href={cat.path}
              scroll={false}
              className={`${styles.link} ${
                isActive ? styles.active : ""
              }`}
              aria-label={`${cat.name} tools`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className={styles.icon}>{cat.emoji}</span>
              <span className={styles.label}>{cat.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}