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
                <ToolCard title="Resume Builder" desc="Create professional resumes" link="/tools/document/resume-builder" icon="📄" />
                <ToolCard title="CV Builder" desc="Create CVs" link="/tools/document/cv-builder" icon="📋" />
                <ToolCard title="Invoice Generator" desc="Generate invoices" link="/tools/document/invoice" icon="💳" />
                <ToolCard title="Bill Generator" desc="Generate bills" link="/tools/document/bill" icon="📄" />
                <ToolCard title="Quotation Generator" desc="Generate quotations" link="/tools/document/quotation" icon="💬" />
                <ToolCard title="Business Card Generator" desc="Create business cards" link="/tools/document/business-card" icon="💼" />
                <ToolCard title="Letterhead Generator" desc="Generate letterheads" link="/tools/document/letterhead" icon="📧" />
                <ToolCard title="Certificate Generator" desc="Create certificates" link="/tools/document/certificate" icon="🏆" />
                <ToolCard title="ID Card Generator" desc="Generate ID cards" link="/tools/document/id-card" icon="🆔" />
                <ToolCard title="Experience Letter Generator" desc="Create experience letters" link="/tools/document/experience-letter" icon="📜" />
                <ToolCard title="Offer Letter Generator" desc="Generate offer letters" link="/tools/document/offer-letter" icon="📨" />
                <ToolCard title="Bonafide Certificate" desc="Create bonafide certificates" link="/tools/document/bonafide" icon="📜" />
                <ToolCard title="Salary Slip Generator" desc="Generate salary slips" link="/tools/document/salary-slip" icon="💵" />
                <ToolCard title="Report Cover Page" desc="Create report covers" link="/tools/document/report-cover" icon="📖" />
            </div>
        </main>
    );
}
