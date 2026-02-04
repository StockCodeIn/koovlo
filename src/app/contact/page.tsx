"use client";

import { useState } from "react";
import styles from "./contact.module.css";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Thank you! Your message has been sent successfully. We'll get back to you soon.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <h1>Contact Us</h1>
        <p>Have questions or feedback? We'd love to hear from you!</p>
      </section>

      <div className={styles.content}>
        <section className={styles.formSection}>
          <h2>Send us a message</h2>
          
          {submitStatus.type && (
            <div className={`${styles.alert} ${styles[submitStatus.type]}`}>
              {submitStatus.message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                autoComplete="name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
                autoComplete="email"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subject">Subject</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="bug">Report a Bug</option>
                <option value="feature">Feature Request</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Tell us what's on your mind..."
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </section>

        <aside className={styles.infoSection}>
          <h2>Get in Touch</h2>
          <div className={styles.infoCard}>
            <div className={styles.infoItem}>
              {/* <div className={styles.infoIcon}>📧</div>
              <div>
                <h3>Email</h3>
                <p>support@koovlo.com</p>
              </div> */}
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>💬</div>
              <div>
                <h3>Response Time</h3>
                <p>Within 24-48 hours</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>🌍</div>
              <div>
                <h3>Available</h3>
                <p>24/7 Online Tools</p>
              </div>
            </div>
          </div>

          {/* <div className={styles.socialLinks}>
            <h3>Follow Us</h3>
            <div className={styles.socialIcons}>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">🐦</a>
              <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">💼</a>
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">📸</a>
            </div>
          </div> */}
        </aside>
      </div>
    </main>
  );
}
