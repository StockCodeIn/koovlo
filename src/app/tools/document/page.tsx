// src/app/tools/document/page.tsx
import ToolCard from "@/components/ToolCard";
import styles from "../tools-common.module.css";

export const metadata = {
    title: "Document Tools – Koovlo",
    description:
        "Free online document generators and templates: resumes, invoices, certificates, and more.",

};

export default function DocumentToolsPage() {
    return (

        <main className={styles.container}>
            <h1 className={styles.pageTitle}>
                <span className={styles.icon}>📋</span>
                <span className={styles.textGradient}>Document Tools</span>
            </h1>
            <p className={styles.subText}>
                Create and generate various professional documents easily and quickly.
            </p>

            <div className={styles.grid}>
                <ToolCard title="Resume Builder" desc="Create professional resumes with PDF export" link="/tools/document/resume-builder" icon="📄" />
                <ToolCard title="CV Builder" desc="Build comprehensive CVs" link="/tools/document/cv-builder" icon="📋" />
                <ToolCard title="Invoice Generator" desc="Generate professional invoices" link="/tools/document/invoice" icon="💳" />
                <ToolCard title="PDF Form Builder" desc="Create fillable PDF forms" link="/tools/document/pdf-form-builder" icon="📝" />
            </div>
        </main>
    );
}
