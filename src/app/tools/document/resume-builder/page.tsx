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
  gpa?: string;
}

interface Publication {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: string;
  doi?: string;
}

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

interface Language {
  id: string;
  name: string;
  proficiency: string;
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
  publications: Publication[];
  certificates: Certificate[];
  languages: Language[];
  skills: string[];
  theme: string;
  template: string;
  fontStyle: string;
  density: string;
  mode: string;
}

export default function ResumeBuilder() {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState('resume'); // 'resume' or 'cv'
  const [theme, setTheme] = useState('blue');
  const [template, setTemplate] = useState('classic');
  const [fontStyle, setFontStyle] = useState('serif');
  const [density, setDensity] = useState('standard');
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
      endDate: '',
      gpa: ''
    }
  ]);

  const [publications, setPublications] = useState<Publication[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [skills, setSkills] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('resume-builder-data');
    if (saved) {
      const data: ResumeData = JSON.parse(saved);
      setPersonalInfo(data.personalInfo);
      setSummary(data.summary);
      setExperience(data.experience);
      setEducation(data.education);
      setPublications(data.publications || []);
      setCertificates(data.certificates || []);
      setLanguages(data.languages || []);
      setSkills(data.skills);
      setTheme(data.theme || 'blue');
      setTemplate(data.template || 'classic');
      setFontStyle(data.fontStyle || 'serif');
      setDensity(data.density || 'standard');
      setMode(data.mode || 'resume');
    }
  }, []);

  useEffect(() => {
    const data: ResumeData = {
      personalInfo,
      summary,
      experience,
      education,
      publications,
      certificates,
      languages,
      skills,
      theme,
      template,
      fontStyle,
      density,
      mode
    };
    localStorage.setItem('resume-builder-data', JSON.stringify(data));
  }, [personalInfo, summary, experience, education, publications, certificates, languages, skills, theme, template, fontStyle, density, mode]);

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
      endDate: '',
      gpa: ''
    }]);
  };

  const addPublication = () => {
    setPublications([...publications, {
      id: Date.now().toString(),
      title: '',
      authors: '',
      journal: '',
      year: '',
      doi: ''
    }]);
  };

  const removePublication = (id: string) => {
    setPublications(publications.filter(pub => pub.id !== id));
  };

  const updatePublication = (id: string, field: keyof Publication, value: string) => {
    setPublications(publications.map(pub =>
      pub.id === id ? { ...pub, [field]: value } : pub
    ));
  };

  const addCertificate = () => {
    setCertificates([...certificates, {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      credentialUrl: ''
    }]);
  };

  const removeCertificate = (id: string) => {
    setCertificates(certificates.filter(cert => cert.id !== id));
  };

  const updateCertificate = (id: string, field: keyof Certificate, value: string) => {
    setCertificates(certificates.map(cert =>
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  const addLanguage = () => {
    setLanguages([...languages, {
      id: Date.now().toString(),
      name: '',
      proficiency: 'Intermediate'
    }]);
  };

  const removeLanguage = (id: string) => {
    setLanguages(languages.filter(lang => lang.id !== id));
  };

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    setLanguages(languages.map(lang =>
      lang.id === id ? { ...lang, [field]: value } : lang
    ));
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

      const scaledHeight = imgHeight * ratio;
      const scaledWidth = imgWidth * ratio;

      pdf.addImage(imgData, 'PNG', imgX, imgY, scaledWidth, scaledHeight);

      if (scaledHeight > pdfHeight) {
        let heightLeft = scaledHeight - pdfHeight;
        let position = -pdfHeight;

        while (heightLeft > 0) {
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', imgX, position, scaledWidth, scaledHeight);
          heightLeft -= pdfHeight;
          position -= pdfHeight;
        }
      }

      pdf.save(`${personalInfo.name || (mode === 'resume' ? 'resume' : 'cv')}.pdf`);
      alert(`✅ ${mode === 'resume' ? 'Resume' : 'CV'} downloaded successfully!`);
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
      publications,
      certificates,
      languages,
      skills,
      theme,
      template,
      fontStyle,
      density,
      mode
    };
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${personalInfo.name || (mode === 'resume' ? 'resume' : 'cv')}-data.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert('✅ Data saved!');
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
        setPublications(data.publications || []);
        setCertificates(data.certificates || []);
        setLanguages(data.languages || []);
        setSkills(data.skills);
        setTheme(data.theme || 'blue');
        setTemplate(data.template || 'classic');
        setFontStyle(data.fontStyle || 'serif');
        setDensity(data.density || 'standard');
        setMode(data.mode || 'resume');
        alert('✅ Data loaded!');
      } catch (error) {
        alert('❌ Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>{mode === 'resume' ? '📄' : '📋'}</span>
        <span className={styles.textGradient}>{mode === 'resume' ? 'Resume' : 'CV'} Builder</span>
      </h1>
      <p className={styles.subtitle}>
        {mode === 'resume' ? 
          'Create ATS-friendly resumes (1-2 pages) with professional templates and instant PDF export' : 
          'Create comprehensive CVs with publications, certifications, languages, and academic sections'}
      </p>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', gap: '0.5rem', backgroundColor: '#f0f0f0', padding: '0.5rem', borderRadius: '8px' }}>
          <button
            onClick={() => setMode('resume')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              backgroundColor: mode === 'resume' ? '#667eea' : 'transparent',
              color: mode === 'resume' ? 'white' : '#666',
              transition: 'all 0.2s'
            }}
          >
            📄 Resume (1-2 pages)
          </button>
          <button
            onClick={() => setMode('cv')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              backgroundColor: mode === 'cv' ? '#667eea' : 'transparent',
              color: mode === 'cv' ? 'white' : '#666',
              transition: 'all 0.2s'
            }}
          >
            📋 CV (Comprehensive)
          </button>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.editorPanel}>
          <h2>✏️ {mode === 'resume' ? 'Resume' : 'CV'} Editor</h2>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>🎨 Template & Style</h3>
            </div>
            <div className={styles.formGroup}>
              <label>Choose Template</label>
              <div className={styles.templateGrid}>
                <button
                  className={`${styles.templateCard} ${template === 'classic' ? styles.activeTemplate : ''}`}
                  onClick={() => setTemplate('classic')}
                  type="button"
                >
                  <span className={styles.templateTitle}>Classic</span>
                  <span className={styles.templateDesc}>Traditional & ATS-safe</span>
                </button>
                <button
                  className={`${styles.templateCard} ${template === 'modern' ? styles.activeTemplate : ''}`}
                  onClick={() => setTemplate('modern')}
                  type="button"
                >
                  <span className={styles.templateTitle}>Modern</span>
                  <span className={styles.templateDesc}>Clean with accents</span>
                </button>
                <button
                  className={`${styles.templateCard} ${template === 'minimal' ? styles.activeTemplate : ''}`}
                  onClick={() => setTemplate('minimal')}
                  type="button"
                >
                  <span className={styles.templateTitle}>Minimal</span>
                  <span className={styles.templateDesc}>Simple & compact</span>
                </button>
                <button
                  className={`${styles.templateCard} ${template === 'creative' ? styles.activeTemplate : ''}`}
                  onClick={() => setTemplate('creative')}
                  type="button"
                >
                  <span className={styles.templateTitle}>Creative</span>
                  <span className={styles.templateDesc}>Bold header style</span>
                </button>
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.formGroup}>
                <label>Font Style</label>
                <select
                  className={styles.select}
                  value={fontStyle}
                  onChange={(e) => setFontStyle(e.target.value)}
                >
                  <option value="serif">Serif (Professional)</option>
                  <option value="sans">Sans (Modern)</option>
                  <option value="modern">Modern (Clean)</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Spacing</label>
                <select
                  className={styles.select}
                  value={density}
                  onChange={(e) => setDensity(e.target.value)}
                >
                  <option value="compact">Compact</option>
                  <option value="standard">Standard</option>
                  <option value="airy">Airy</option>
                </select>
              </div>
            </div>
          </div>

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
                placeholder={mode === 'resume' ? 'John Doe' : 'Dr. John Doe'}
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
                  placeholder={mode === 'resume' ? 'john@example.com' : 'john@university.edu'}
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
                placeholder={
                  mode === 'resume'
                    ? 'A brief overview of your professional background, key achievements, and career goals...'
                    : 'A comprehensive overview of your professional background, research interests, and achievements...'
                }
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
                  <label>{mode === 'resume' ? 'Company Name' : 'Organization/Company'}</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    placeholder={mode === 'resume' ? 'Google' : 'University/Company Name'}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Position/Title</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                    placeholder={mode === 'resume' ? 'Software Engineer' : 'Professor/Engineer/Manager'}
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
                    placeholder={
                      mode === 'resume'
                        ? '• Led development of key features\n• Improved performance by 40%\n• Mentored junior developers'
                        : '• Led research on cutting-edge projects\n• Published 15+ peer-reviewed papers\n• Mentored graduate students'
                    }
                  />
                </div>
              </div>
            ))}
          </div>

              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3>🎓 Education</h3>
                  <button className={styles.addBtn} onClick={addEducation} type="button">
                    + Add
                  </button>
                </div>
                {education.map((edu, index) => (
                  <div key={edu.id} className={styles.entryCard}>
                    <div className={styles.entryHeader}>
                      <strong>Education {index + 1}</strong>
                      {education.length > 1 && (
                        <button className={styles.removeBtn} onClick={() => removeEducation(edu.id)} type="button">
                          Remove
                        </button>
                      )}
                    </div>
                    <div className={styles.formGroup}>
                      <label>{mode === 'resume' ? 'School/University' : 'Institution'}</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={edu.school}
                        onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                        placeholder={mode === 'resume' ? 'Stanford University' : 'University Name'}
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
                          placeholder={mode === 'resume' ? 'Bachelor of Science' : 'PhD'}
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
                    <div className={styles.formGroup}>
                      <label>GPA (Optional)</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={edu.gpa}
                        onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                        placeholder="4.0/4.0"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {mode === 'cv' && (
                <>
                  <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <h3>📚 Publications</h3>
                      <button className={styles.addBtn} onClick={addPublication} type="button">
                        + Add
                      </button>
                    </div>
                    {publications.map((pub, index) => (
                      <div key={pub.id} className={styles.entryCard}>
                        <div className={styles.entryHeader}>
                          <strong>Publication {index + 1}</strong>
                          {publications.length > 0 && (
                            <button className={styles.removeBtn} onClick={() => removePublication(pub.id)} type="button">
                              Remove
                            </button>
                          )}
                        </div>
                        <div className={styles.formGroup}>
                          <label>Title</label>
                          <input
                            type="text"
                            className={styles.input}
                            value={pub.title}
                            onChange={(e) => updatePublication(pub.id, 'title', e.target.value)}
                            placeholder="Research Paper Title"
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label>Authors</label>
                          <input
                            type="text"
                            className={styles.input}
                            value={pub.authors}
                            onChange={(e) => updatePublication(pub.id, 'authors', e.target.value)}
                            placeholder="Author One, Author Two"
                          />
                        </div>
                        <div className={styles.grid2}>
                          <div className={styles.formGroup}>
                            <label>Journal/Conference</label>
                            <input
                              type="text"
                              className={styles.input}
                              value={pub.journal}
                              onChange={(e) => updatePublication(pub.id, 'journal', e.target.value)}
                              placeholder="Nature, IEEE, etc."
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label>Year</label>
                            <input
                              type="text"
                              className={styles.input}
                              value={pub.year}
                              onChange={(e) => updatePublication(pub.id, 'year', e.target.value)}
                              placeholder="2024"
                            />
                          </div>
                        </div>
                        <div className={styles.formGroup}>
                          <label>DOI (Optional)</label>
                          <input
                            type="text"
                            className={styles.input}
                            value={pub.doi}
                            onChange={(e) => updatePublication(pub.id, 'doi', e.target.value)}
                            placeholder="10.1234/example.doi"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <h3>🏆 Certifications & Awards</h3>
                      <button className={styles.addBtn} onClick={addCertificate} type="button">
                        + Add
                      </button>
                    </div>
                    {certificates.map((cert, index) => (
                      <div key={cert.id} className={styles.entryCard}>
                        <div className={styles.entryHeader}>
                          <strong>Certificate {index + 1}</strong>
                          {certificates.length > 0 && (
                            <button className={styles.removeBtn} onClick={() => removeCertificate(cert.id)} type="button">
                              Remove
                            </button>
                          )}
                        </div>
                        <div className={styles.formGroup}>
                          <label>Name</label>
                          <input
                            type="text"
                            className={styles.input}
                            value={cert.name}
                            onChange={(e) => updateCertificate(cert.id, 'name', e.target.value)}
                            placeholder="Award/Certification Name"
                          />
                        </div>
                        <div className={styles.grid2}>
                          <div className={styles.formGroup}>
                            <label>Issuer</label>
                            <input
                              type="text"
                              className={styles.input}
                              value={cert.issuer}
                              onChange={(e) => updateCertificate(cert.id, 'issuer', e.target.value)}
                              placeholder="Organization Name"
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label>Date</label>
                            <input
                              type="month"
                              className={styles.input}
                              value={cert.date}
                              onChange={(e) => updateCertificate(cert.id, 'date', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className={styles.formGroup}>
                          <label>Credential URL (Optional)</label>
                          <input
                            type="url"
                            className={styles.input}
                            value={cert.credentialUrl}
                            onChange={(e) => updateCertificate(cert.id, 'credentialUrl', e.target.value)}
                            placeholder="Link to credential"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <h3>🗣️ Languages</h3>
                      <button className={styles.addBtn} onClick={addLanguage} type="button">
                        + Add
                      </button>
                    </div>
                    {languages.map((lang, index) => (
                      <div key={lang.id} className={styles.entryCard}>
                        <div className={styles.entryHeader}>
                          <strong>Language {index + 1}</strong>
                          {languages.length > 0 && (
                            <button className={styles.removeBtn} onClick={() => removeLanguage(lang.id)} type="button">
                              Remove
                            </button>
                          )}
                        </div>
                        <div className={styles.grid2}>
                          <div className={styles.formGroup}>
                            <label>Language</label>
                            <input
                              type="text"
                              className={styles.input}
                              value={lang.name}
                              onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                              placeholder="English, Spanish, etc."
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label>Proficiency</label>
                            <select
                              className={styles.select}
                              value={lang.proficiency}
                              onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                              <option value="Native/Fluent">Native/Fluent</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

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
                  placeholder={mode === 'resume' ? 'e.g., JavaScript, React, Node.js' : 'e.g., Research, Python, Data Analysis'}
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

          <div
            ref={resumeRef}
            className={`${styles.resumePreview} ${styles[`theme-${theme}`]} ${styles[`template-${template}`]} ${styles[`font-${fontStyle}`]} ${styles[`density-${density}`]}`}
          >
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

            {experience.some((exp) => exp.company || exp.position) && (
              <div className={styles.resumeSection}>
                <h2>Work Experience</h2>
                {experience.map((exp, index) =>
                  exp.company || exp.position ? (
                    <div key={index} className={styles.resumeEntry}>
                      <h3>{exp.position || 'Position'}</h3>
                      <div className={styles.meta}>
                        <strong>{exp.company || 'Company'}</strong>
                        {(exp.startDate || exp.endDate) && (
                          <span> • {exp.startDate || 'Start'} - {exp.endDate || 'Present'}</span>
                        )}
                      </div>
                      {exp.description && <p style={{ whiteSpace: 'pre-line' }}>{exp.description}</p>}
                    </div>
                  ) : null
                )}
              </div>
            )}

            {education.some((edu) => edu.school || edu.degree) && (
              <div className={styles.resumeSection}>
                <h2>Education</h2>
                {education.map((edu, index) =>
                  edu.school || edu.degree ? (
                    <div key={index} className={styles.resumeEntry}>
                      <h3>{edu.degree || 'Degree'} {edu.field && `in ${edu.field}`}</h3>
                      <div className={styles.meta}>
                        <strong>{edu.school || 'School'}</strong>
                        {(edu.startDate || edu.endDate) && (
                          <span> • {edu.startDate || 'Start'} - {edu.endDate || 'End'}</span>
                        )}
                        {edu.gpa && <span> • GPA: {edu.gpa}</span>}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            )}

            {mode === 'cv' && publications.some((pub) => pub.title || pub.journal) && (
              <div className={styles.resumeSection}>
                <h2>Publications</h2>
                {publications.map((pub, index) =>
                  pub.title || pub.journal ? (
                    <div key={index} className={styles.resumeEntry}>
                      <h3>{pub.title || 'Publication Title'}</h3>
                      <div className={styles.meta}>
                        {pub.authors && <strong>{pub.authors}</strong>}
                        {pub.journal && <span> • {pub.journal}</span>}
                        {pub.year && <span> • {pub.year}</span>}
                        {pub.doi && <span> • DOI: {pub.doi}</span>}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            )}

            {mode === 'cv' && certificates.some((cert) => cert.name || cert.issuer) && (
              <div className={styles.resumeSection}>
                <h2>Certifications & Awards</h2>
                {certificates.map((cert, index) =>
                  cert.name || cert.issuer ? (
                    <div key={index} className={styles.resumeEntry}>
                      <h3>{cert.name || 'Certificate'}</h3>
                      <div className={styles.meta}>
                        <strong>{cert.issuer || 'Issuer'}</strong>
                        {cert.date && <span> • {cert.date}</span>}
                        {cert.credentialUrl && (
                          <span> • <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">View Credential</a></span>
                        )}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            )}

            {mode === 'cv' && languages.some((lang) => lang.name) && (
              <div className={styles.resumeSection}>
                <h2>Languages</h2>
                {languages.map((lang, index) =>
                  lang.name ? (
                    <div key={index} className={styles.resumeEntry}>
                      <h3>{lang.name}</h3>
                      <div className={styles.meta}>{lang.proficiency}</div>
                    </div>
                  ) : null
                )}
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
        howItWorks={mode === 'resume' ?
          "1. Choose a resume template and style<br>2. Fill in your personal information<br>3. Add professional summary<br>4. Add work experience and education<br>5. List your skills<br>6. Pick a color theme, font, and spacing<br>7. Download as PDF or save your data" :
          "1. Choose a CV template and style<br>2. Fill in your personal information<br>3. Add professional summary<br>4. Add work experience, education<br>5. Add publications, certifications, languages<br>6. List your skills<br>7. Pick a color theme, font, and spacing<br>8. Download as PDF or save your data"}
        faqs={mode === 'resume' ? [
          { title: "What is ATS-friendly?", content: "ATS (Applicant Tracking System) friendly resumes use standard formatting and clear section headers that automated systems can easily parse." },
          { title: "Can I save my progress?", content: "Yes! Your resume is auto-saved to your browser. You can also download the data as JSON and reload it later." },
          { title: "How many pages should my resume be?", content: "Typically 1-2 pages. Entry-level: 1 page. Experienced professionals: up to 2 pages." },
          { title: "What should I include?", content: "Always include: Contact info, Summary, Experience, Education, Skills. Optional: Certifications, Projects, Languages." }
        ] : [
          { title: "What's the difference between CV and Resume?", content: "CV (Curriculum Vitae) is comprehensive and detailed, typically 2-4+ pages. Resume is concise (1-2 pages). CVs include publications, certifications, and detailed work history." },
          { title: "Is my CV ATS-friendly?", content: "Yes! All templates use standard formatting and clear section headers that automated systems can parse. Avoid fancy graphics or unusual fonts." },
          { title: "Can I save my progress?", content: "Yes! Your CV is auto-saved to your browser. You can also download the data as JSON and reload it later." },
          { title: "What should I include?", content: "Always: Contact info, Summary, Experience, Education, Skills. Optional: Publications, Certifications, Awards, Languages, Projects." },
          { title: "How long should my CV be?", content: "Typically 2-4 pages for academics and researchers. 1-2 pages for industry professionals. Keep it relevant to the position." }
        ]}
        tips={mode === 'resume' ? [
          "Use action verbs: Led, Developed, Managed, Improved",
          "Quantify achievements: 'Increased sales by 40%' not just 'Increased sales'",
          "Tailor your resume for each job application",
          "Keep formatting consistent and professional",
          "Proofread multiple times - typos can cost you the job"
        ] : [
          "Use action verbs: Developed, Conducted, Published, Led, Managed",
          "Quantify achievements: 'Authored 15+ papers' not just 'Authored papers'",
          "List publications with DOI links for academic CVs",
          "Include GPA only if 3.8+ or if applying to top institutions",
          "Use academic template for research-heavy roles",
          "Keep formatting consistent throughout"
        ]}
      />
    </div>
  );
}
