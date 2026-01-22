// src/components/ToolCard.tsx
import Link from "next/link";
import styles from "@/styles/toolcard.module.css";

type ToolCardProps = {
  title: string;
  desc: string;
  link: string;
  icon?: string;
};

export default function ToolCard({ title, desc, link, icon = "🧩" }: ToolCardProps) {
  return (
    <Link href={link} className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.textBox}>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </Link>
  );
}
