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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
          message: "Thank you. Your message has been sent successfully and we will get back to you soon.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Failed to send message. Please try again.",
        });
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <h1>Contact Us</h1>
        <p>Have questions or feedback? We&apos;d love to hear from you.</p>
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
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" autoComplete="name" />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your.email@example.com" autoComplete="email" />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subject">Subject</label>
              <select id="subject" name="subject" value={formData.subject} onChange={handleChange} required>
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
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={6} placeholder="Tell us what is on your mind..." />
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
              <div className={styles.infoIcon}>Reply</div>
              <div>
                <h3>Response Time</h3>
                <p>Usually within 24 to 48 hours</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>Web</div>
              <div>
                <h3>Availability</h3>
                <p>Koovlo tools are available 24/7 online</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
