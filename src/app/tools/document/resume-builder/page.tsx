"use client";

import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import styles from "./resume.module.css";
import ToolInfo from "@/components/ToolInfo";

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
  };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  theme: string;
}

export default function ResumeBuilder() {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState('blue');
  const [skillInput, setSkillInput] = useState('');
  
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: ''
  });

  const [summary, setSummary] = useState('');

  const [experience, setExperience] = useState<Experience[]>([
    {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    }
  ]);

  const [education, setEducation] = useState<Education[]>([
    {
      id: Date.now().toString(),
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: ''
    }
  ]);

  const [skills, setSkills] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('resume-builder-data');
    if (saved) {
      const data: ResumeData = JSON.parse(saved);
      setPersonalInfo(data.personalInfo);
      setSummary(data.summary);
      setExperience(data.experience);
      setEducation(data.education);
      setSkills(data.skills);
      setTheme(data.theme || 'blue');
    }
  }, []);

  useEffect(() => {
    const data: ResumeData = {
      personalInfo,
      summary,
      experience,
      education,
      skills,
      theme
    };
    localStorage.setItem('resume-builder-data', JSON.stringify(data));
  }, [personalInfo, summary, experience, education, skills, theme]);

  const addExperience = () => {
    setExperience([...experience, {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    }]);
  };

  const removeExperience = (id: string) => {
    setExperience(experience.filter(exp => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperience(experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const addEducation = () => {
    setEducation([...education, {
      id: Date.now().toString(),
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: ''
    }]);
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const exportToPDF = async () => {
    if (!resumeRef.current) return;

    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

      if (imgHeight * ratio > pdfHeight) {
        let heightLeft = imgHeight * ratio;
        let position = 0;
        
        while (heightLeft >= pdfHeight) {
          position = heightLeft - imgHeight * ratio;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
          heightLeft -= pdfHeight;
        }
      }

      pdf.save(`${personalInfo.name || 'resume'}.pdf`);
      alert('✅ Resume downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('❌ Failed to generate PDF. Please try again.');
    }
  };

  const saveResume = () => {
    const data: ResumeData = {
      personalInfo,
      summary,
      experience,
      education,
      skills,
      theme
    };
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${personalInfo.name || 'resume'}-data.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert('✅ Resume data saved!');
  };

  const loadResume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data: ResumeData = JSON.parse(event.target?.result as string);
        setPersonalInfo(data.personalInfo);
        setSummary(data.summary);
        setExperience(data.experience);
        setEducation(data.education);
        setSkills(data.skills);
        setTheme(data.theme || 'blue');
        alert('✅ Resume data loaded!');
      } catch (error) {
        alert('❌ Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>📄</span>
        <span className={styles.textGradient}>Professional Resume Builder</span>
      </h1>
      <p className={styles.subtitle}>
        Create stunning, ATS-friendly resumes with real-time preview and PDF export
      </p>

      <div className={styles.mainContent}>
        <div className={styles.editorPanel}>
          <h2>✏️ Resume Editor</h2>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>👤 Personal Information</h3>
            </div>
            <div className={styles.formGroup}>
              <label>Full Name *</label>
              <input
                type="text"
                className={styles.input}
                value={personalInfo.name}
                onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className={styles.grid2}>
              <div className={styles.formGroup}>
                <label>Email *</label>
                <input
                  type="email"
                  className={styles.input}
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Phone</label>
                <input
                  type="tel"
                  className={styles.input}
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Location</label>
              <input
                type="text"
                className={styles.input}
                value={personalInfo.location}
                onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                placeholder="New York, USA"
              />
            </div>
            <div className={styles.grid2}>
              <div className={styles.formGroup}>
                <label>LinkedIn</label>
                <input
                  type="url"
                  className={styles.input}
                  value={personalInfo.linkedin}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                  placeholder="linkedin.com/in/johndoe"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Website/Portfolio</label>
                <input
                  type="url"
                  className={styles.input}
                  value={personalInfo.website}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, website: e.target.value })}
                  placeholder="johndoe.com"
                />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>📝 Professional Summary</h3>
            </div>
            <div className={styles.formGroup}>
              <textarea
                className={styles.textarea}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="A brief overview of your professional background, key achievements, and career goals..."
              />
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>💼 Work Experience</h3>
              <button className={styles.addBtn} onClick={addExperience}>
                + Add
              </button>
            </div>
            {experience.map((exp, index) => (
              <div key={exp.id} className={styles.entryCard}>
                <div className={styles.entryHeader}>
                  <strong>Experience {index + 1}</strong>
                  {experience.length > 1 && (
                    <button className={styles.removeBtn} onClick={() => removeExperience(exp.id)}>
                      Remove
                    </button>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label>Company Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    placeholder="Google"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Position</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                    placeholder="Software Engineer"
                  />
                </div>
                <div className={styles.grid2}>
                  <div className={styles.formGroup}>
                    <label>Start Date</label>
                    <input
                      type="month"
                      className={styles.input}
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>End Date</label>
                    <input
                      type="month"
                      className={styles.input}
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                      placeholder="Leave empty if current"
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea
                    className={styles.textarea}
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    placeholder="• Led development of key features&#10;• Improved performance by 40%&#10;• Mentored junior developers"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>🎓 Education</h3>
              <button className={styles.addBtn} onClick={addEducation}>
                + Add
              </button>
            </div>
            {education.map((edu, index) => (
              <div key={edu.id} className={styles.entryCard}>
                <div className={styles.entryHeader}>
                  <strong>Education {index + 1}</strong>
                  {education.length > 1 && (
                    <button className={styles.removeBtn} onClick={() => removeEducation(edu.id)}>
                      Remove
                    </button>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label>School/University</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                    placeholder="Stanford University"
                  />
                </div>
                <div className={styles.grid2}>
                  <div className={styles.formGroup}>
                    <label>Degree</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      placeholder="Bachelor of Science"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Field of Study</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                      placeholder="Computer Science"
                    />
                  </div>
                </div>
                <div className={styles.grid2}>
                  <div className={styles.formGroup}>
                    <label>Start Date</label>
                    <input
                      type="month"
                      className={styles.input}
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>End Date</label>
                    <input
                      type="month"
                      className={styles.input}
                      value={edu.endDate}
                      onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>🛠️ Skills</h3>
            </div>
            <div className={styles.formGroup}>
              <label>Add Skill</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className={styles.input}
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., JavaScript, React, Node.js"
                />
                <button className={styles.addBtn} onClick={addSkill}>
                  Add
                </button>
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              {skills.map((skill, index) => (
                <span key={index} className={styles.skillTag}>
                  {skill}
                  <button
                    onClick={() => removeSkill(index)}
                    style={{
                      marginLeft: '8px',
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.previewPanel}>
          <div className={styles.previewHeader}>
            <h2>👁️ Live Preview</h2>
            <div className={styles.themeSelector}>
              <button
                className={`${styles.themeBtn} ${theme === 'blue' ? styles.active : ''}`}
                onClick={() => setTheme('blue')}
                style={{ background: '#667eea' }}
                title="Blue Theme"
              />
              <button
                className={`${styles.themeBtn} ${theme === 'green' ? styles.active : ''}`}
                onClick={() => setTheme('green')}
                style={{ background: '#28a745' }}
                title="Green Theme"
              />
              <button
                className={`${styles.themeBtn} ${theme === 'purple' ? styles.active : ''}`}
                onClick={() => setTheme('purple')}
                style={{ background: '#764ba2' }}
                title="Purple Theme"
              />
              <button
                className={`${styles.themeBtn} ${theme === 'dark' ? styles.active : ''}`}
                onClick={() => setTheme('dark')}
                style={{ background: '#343a40' }}
                title="Dark Theme"
              />
            </div>
          </div>

          <div ref={resumeRef} className={`${styles.resumePreview} ${styles[`theme-${theme}`]}`}>
            <div className={styles.resumeHeader}>
              <h1>{personalInfo.name || 'Your Name'}</h1>
              <div className={styles.contact}>
                {personalInfo.email && <span>📧 {personalInfo.email}</span>}
                {personalInfo.phone && <span>📱 {personalInfo.phone}</span>}
                {personalInfo.location && <span>📍 {personalInfo.location}</span>}
                {personalInfo.linkedin && <span>💼 {personalInfo.linkedin}</span>}
                {personalInfo.website && <span>🌐 {personalInfo.website}</span>}
              </div>
            </div>

            {summary && (
              <div className={styles.resumeSection}>
                <h2>Professional Summary</h2>
                <p>{summary}</p>
              </div>
            )}

            {experience.some(exp => exp.company || exp.position) && (
              <div className={styles.resumeSection}>
                <h2>Work Experience</h2>
                {experience.map((exp, index) => (
                  (exp.company || exp.position) && (
                    <div key={index} className={styles.resumeEntry}>
                      <h3>{exp.position || 'Position'}</h3>
                      <div className={styles.meta}>
                        <strong>{exp.company || 'Company'}</strong>
                        {(exp.startDate || exp.endDate) && (
                          <span> • {exp.startDate || 'Start'} - {exp.endDate || 'Present'}</span>
                        )}
                      </div>
                      {exp.description && (
                        <p style={{ whiteSpace: 'pre-line' }}>{exp.description}</p>
                      )}
                    </div>
                  )
                ))}
              </div>
            )}

            {education.some(edu => edu.school || edu.degree) && (
              <div className={styles.resumeSection}>
                <h2>Education</h2>
                {education.map((edu, index) => (
                  (edu.school || edu.degree) && (
                    <div key={index} className={styles.resumeEntry}>
                      <h3>{edu.degree || 'Degree'} {edu.field && `in ${edu.field}`}</h3>
                      <div className={styles.meta}>
                        <strong>{edu.school || 'School'}</strong>
                        {(edu.startDate || edu.endDate) && (
                          <span> • {edu.startDate || 'Start'} - {edu.endDate || 'End'}</span>
                        )}
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}

            {skills.length > 0 && (
              <div className={styles.resumeSection}>
                <h2>Skills</h2>
                <div className={styles.skillsList}>
                  {skills.map((skill, index) => (
                    <span key={index} className={styles.skillBadge}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.actionBar}>
            <button className={styles.exportBtn} onClick={exportToPDF}>
              📥 Download PDF
            </button>
            <button className={styles.saveBtn} onClick={saveResume}>
              💾 Save Data
            </button>
            <label htmlFor="load-resume" className={styles.loadBtn} style={{ textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              📂 Load Data
              <input
                id="load-resume"
                type="file"
                accept=".json"
                onChange={loadResume}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="1. Fill in your personal information<br>2. Add professional summary<br>3. Add work experience and education<br>4. List your skills<br>5. Choose a color theme<br>6. Download as PDF or save your data"
        faqs={[
          { title: "What is ATS-friendly?", content: "ATS (Applicant Tracking System) friendly resumes use standard formatting and clear section headers that automated systems can easily parse." },
          { title: "Can I save my progress?", content: "Yes! Your resume is auto-saved to your browser. You can also download the data as JSON and reload it later." },
          { title: "How many pages should my resume be?", content: "Typically 1-2 pages. Entry-level: 1 page. Experienced professionals: up to 2 pages." },
          { title: "What should I include?", content: "Always include: Contact info, Summary, Experience, Education, Skills. Optional: Certifications, Projects, Languages." }
        ]}
        tips={[
          "Use action verbs: Led, Developed, Managed, Improved",
          "Quantify achievements: 'Increased sales by 40%' not just 'Increased sales'",
          "Tailor your resume for each job application",
          "Keep formatting consistent and professional",
          "Proofread multiple times - typos can cost you the job"
        ]}
      />
    </div>
  );
}
