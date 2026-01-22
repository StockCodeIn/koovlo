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
  { name: "File", path: "/tools/file", emoji: "📁" },
  { name: "All", path: "/tools", emoji: "✨" },
];

export default function ToolsNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <div className={styles.scrollWrap}>
        {categories.map((cat) => {
          const active = pathname.startsWith(cat.path);
          return (
            <Link
              key={cat.name}
              href={cat.path}
              className={`${styles.link} ${active ? styles.active : ""}`}
            >
              <span className={styles.icon}>{cat.emoji}</span>
              {cat.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
