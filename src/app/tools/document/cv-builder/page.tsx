'use client';

import ToolInfo from '@/components/ToolInfo';

export default function CVBuilderPage() {
  return (
    <main>
      <h1>CV Builder</h1>
      <p>Create professional CVs with customizable templates.</p>

      {/* Tool functionality will be implemented here */}

      <ToolInfo
        howItWorks="1. Enter personal information<br>2. Add education and experience<br>3. Choose template and download CV"
        faqs={[
          { title: "What's the difference between CV and resume?", content: "CV is more detailed and comprehensive than a resume." },
          { title: "Can I save my CV?", content: "Yes, you can save and edit your CV anytime." }
        ]}
        tips={["Tailor your CV for each job application", "Use action verbs and quantifiable achievements", "Keep it concise and relevant"]}
      />
    </main>
  );
}