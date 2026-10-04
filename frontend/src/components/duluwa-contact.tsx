"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function DuluwaContact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <section className="duluwa-contact" style={{ position: 'relative', color: '#f4f6fa', background: `radial-gradient(ellipse 54% 82% at 50% 8%,rgba(128,128,128,.22) 0%,rgba(71,71,71,.16) 28%,rgba(35,35,35,.09) 49%,rgba(15,15,15,.025) 68%,transparent 82%),radial-gradient(ellipse 50% 84% at 50% 74%,rgba(22,22,22,.24) 0%,rgba(13,13,13,.13) 43%,transparent 76%),linear-gradient(108deg,#010101 0%,#080808 25%,#101010 46%,#141414 53%,#0a0a0a 72%,#010101 100%)` }}>
      <div className="contact-container">
        <motion.div 
          className="contact-form"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2>Art Consulting</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </motion.div>

        <motion.div 
          className="contact-info"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <h3>Get In Touch</h3>
          <div className="contact-details">
            <a href="tel:+12085550112" className="contact-link">+1 (208) 555-0112</a>
            <a href="mailto:hello@duluwa-art.com" className="contact-link">hello@duluwa-art.com</a>
            <a href="mailto:info@duluwa-art.com" className="contact-link">info@duluwa-art.com</a>
          </div>
          <div className="social-links">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">X.com</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
