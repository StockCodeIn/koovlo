"use client";

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