"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import DuluwaNavbar from "@/components/duluwa-navbar";
import GenZGlassyFooter from "@/components/genz-footer";

export default function AboutPage() {
  const heroRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const missionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const storyInView = useInView(storyRef, { once: true, amount: 0.3 });
  const missionInView = useInView(missionRef, { once: true, amount: 0.3 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const stats = [
    { value: "5+", label: "Years Experience" },
    { value: "200+", label: "Artworks Created" },
    { value: "50+", label: "Happy Clients" },
    { value: "100%", label: "Satisfaction" },
  ];

  const values = [
    {
      title: "Passion",
      desc: "Every brushstroke is infused with genuine love for the craft and dedication to artistic excellence.",
    },
    {
      title: "Vision",
      desc: "We transform your unique ideas into tangible masterpieces that speak to your soul.",
    },
    {
      title: "Quality",
      desc: "Premium materials and archival techniques ensure your artwork lasts for generations.",
    },
  ];

  return (
    <>
      <DuluwaNavbar />

      <main className="site">
        {/* Hero Section */}
        <section ref={heroRef} className="hero-section" style={{ fontFamily: "'Behind The Nineties', serif" }}>
          <motion.div style={{ opacity, scale }} className="hero-content">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="hero-tag"
            >
              <span className="eyebrow">Our Story</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="hero-title"
            >
              About <span className="text-red-500">Duluwa</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="hero-subtitle"
            >
              Where creativity meets passion. Discover the story behind our art gallery and the artist who brings visions to life.
            </motion.p>
          </motion.div>
        </section>

        {/* Artist Story Section */}
        <section ref={storyRef} className="artist-story-section">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={storyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="story-image"
              >
                <div className="aspect-square bg-gradient-to-br from-red-100 to-gray-100 rounded-lg overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                        <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">Art in Progress</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-red-500 text-white p-6 rounded-lg shadow-xl">
                  <p className="text-4xl font-bold">5+</p>
                  <p className="text-sm">Years of Experience</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={storyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="story-content space-y-6"
              >
                <h2 className="section-title">The Artist Behind Duluwa</h2>
                <p className="story-text">
                  Duluwa Art Gallery was born from a deep passion for artistic expression and a desire to bring unique, meaningful artwork into people's lives. Founded in the heart of Kathmandu, Nepal, our gallery represents a bridge between traditional artistic techniques and contemporary creative vision.
                </p>
                <p className="story-text">
                  Every piece in our collection tells a story — a moment captured, an emotion expressed, a vision realized. We believe that art should not just be seen, but felt, experienced, and lived. Our work spans across various mediums including graphite, watercolor, and custom commissioned pieces that transform personal visions into tangible masterpieces.
                </p>
                <p className="story-text">
                  Whether you're looking for a stunning portrait, a serene landscape, or an abstract piece that speaks to your soul, Duluwa Art Gallery offers curated collections and bespoke services tailored to your unique taste and space.
                </p>
                <div className="flex gap-4 pt-4">
                  <Link href="/contact" className="btn-primary">
                    Commission Artwork
                  </Link>
                  <Link href="/shop" className="btn-outline">
                    View Collections
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section ref={missionRef} className="mission-section">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={missionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="section-heading-title"
            >
              Our Mission & Values
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 40 }}
                  animate={missionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.15 }}
                  className="value-card"
                >
                  <div className="value-number">{String(index + 1).padStart(2, "0")}</div>
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-desc">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="stats-section">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 40 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
                  className="stat-item"
                >
                  <p className="stat-value">{stat.value}</p>
                  <p className="stat-label">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="max-w-4xl mx-auto px-6 py-24 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="cta-title"
            >
              Let's Create Together
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="cta-text"
            >
              Ready to bring your artistic vision to life? Connect with us to discuss your project.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="flex justify-center gap-4"
            >
              <Link href="/contact" className="btn-primary">
                Get in Touch
              </Link>
              <Link href="/commission" className="btn-outline">
                Start Commission
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <GenZGlassyFooter />
    </>
  );
}
