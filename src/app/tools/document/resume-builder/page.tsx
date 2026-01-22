"use client";
import { useState } from "react";
import ToolsNav from "@/components/ToolsNav";

export default function ResumeBuilder() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [skill, setSkill] = useState("");
  const [summary, setSummary] = useState("");

  const downloadPDF = () => {
    window.print();
  };

  return (
     <>
            <ToolsNav />
    <main style={wrap}>
      <h1>Resume Builder</h1>
      <p>Create a simple resume & download as PDF.</p>

      <input placeholder="Full Name" onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Skills (comma separated)" onChange={(e) => setSkill(e.target.value)} />
      <textarea placeholder="Short Summary" onChange={(e) => setSummary(e.target.value)} />

      <button onClick={downloadPDF} style={btn}>
        Download PDF
      </button>

      {/* Resume Preview */}
      <section style={resume}>
        <h2>{name}</h2>
        <p>{email}</p>
        <hr />
        <h3>Summary</h3>
        <p>{summary}</p>
        <h3>Skills</h3>
        <p>{skill}</p>
      </section>
    </main>
    </>
  );
}

const wrap = { padding: "40px", maxWidth: "900px", margin: "auto" };
const btn = { marginTop: "20px", padding: "12px", background: "#000", color: "#fff" };
const resume = {
  marginTop: "40px",
  padding: "20px",
  border: "1px solid #ddd",
};
