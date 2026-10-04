"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function NorellContact() {
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
    <div className="compact-contact">
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
    </div>
  );
}
