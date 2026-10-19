"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import DuluwaNavbar from "@/components/duluwa-navbar";
import GenZGlassyFooter from "@/components/genz-footer";

export default function AboutPage() {
  const heroRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const valuesRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const storyInView = useInView(storyRef, { once: true, amount: 0.3 });
  const valuesInView = useInView(valuesRef, { once: true, amount: 0.3 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });

  const values = [
    {
      title: "Artistic Excellence",
      desc: "Every piece is crafted with meticulous attention to detail, combining traditional techniques with contemporary vision.",
      image: "/galleria-assets/framerusercontent.com/images/3OOnGypjPo3PMlLd84axGtA.webp",
    },
    {
      title: "Custom Creations",
      desc: "Transform your unique vision into tangible masterpieces through our bespoke commission services.",
      image: "/galleria-assets/framerusercontent.com/images/8N48THfGrbBTzCG29qcOgTIzDA.webp",
    },
    {
      title: "Cultural Heritage",
      desc: "Celebrating the rich artistic traditions of Nepal while embracing modern artistic expression.",
      image: "/galleria-assets/framerusercontent.com/images/0LJBCt4VxzfS6eTZoFopAt2HY.webp",
    },
  ];

  const stats = [
    { value: "5+", label: "Years of Excellence" },
    { value: "200+", label: "Artworks Created" },
    { value: "50+", label: "Happy Collectors" },
    { value: "15+", label: "Exhibitions" },
  ];

  return (
    <>
      <DuluwaNavbar />

      <main className="galleria-about">
        {/* Hero Section */}
        <section ref={heroRef} className="about-hero">
          <div className="hero-content">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="hero-badge"
            >
              <span>Our Story</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="hero-title"
            >
              About Duluwa Art Gallery
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="hero-subtitle"
            >
              Where creativity meets passion. Discover the story behind our art gallery and the artist who brings visions to life through the medium of watercolor.
            </motion.p>
          </div>
        </section>

        {/* Artist Story Section */}
        <section ref={storyRef} className="artist-story">
          <div className="container">
            <div className="story-grid">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={storyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="story-image-wrapper"
              >
                <div className="story-image">
                  <Image
                    src="/galleria-assets/framerusercontent.com/images/uePLHiLRHEJENQLkDKYjnDwzYlc.png"
                    alt="Artist at work"
                    width={600}
                    height={800}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="experience-badge">
                  <span className="years">5+</span>
                  <span className="label">Years of Experience</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={storyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="story-content"
              >
                <h2 className="section-title">The Artist Behind Duluwa</h2>
                <div className="story-text">
                  <p>
                    Duluwa Art Gallery was born from a deep passion for artistic expression and a desire to bring unique, meaningful artwork into people's lives. Founded in the heart of Kathmandu, Nepal, our gallery represents a bridge between traditional artistic techniques and contemporary creative vision.
                  </p>
                  <p>
                    Every piece in our collection tells a story — a moment captured, an emotion expressed, a vision realized. We believe that art should not just be seen, but felt, experienced, and lived. Our work spans across various mediums including graphite, watercolor, and custom commissioned pieces that transform personal visions into tangible masterpieces.
                  </p>
                  <p>
                    Whether you're looking for a stunning portrait, a serene landscape, or an abstract piece that speaks to your soul, Duluwa Art Gallery offers curated collections and bespoke services tailored to your unique taste and space.
                  </p>
                </div>
                <div className="story-actions">
                  <Link href="/contact" className="btn-primary">
                    Commission Artwork
                  </Link>
                  <Link href="/shop" className="btn-secondary">
                    View Collections
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section ref={valuesRef} className="values-section">
          <div className="container">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="section-title-center"
            >
              What We Stand For
            </motion.h2>
            <div className="values-grid">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 40 }}
                  animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.15 }}
                  className="value-card"
                >
                  <div className="value-image">
                    <Image
                      src={value.image}
                      alt={value.title}
                      width={400}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="value-content">
                    <h3 className="value-title">{value.title}</h3>
                    <p className="value-desc">{value.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="stats-section">
          <div className="container">
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 40 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
                  className="stat-card"
                >
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">Let's Create Together</h2>
              <p className="cta-text">
                Ready to bring your artistic vision to life? Connect with us to discuss your project and discover how we can transform your ideas into beautiful artwork.
              </p>
              <div className="cta-actions">
                <Link href="/contact" className="btn-primary">
                  Get in Touch
                </Link>
                <Link href="/commission" className="btn-secondary">
                  Start Commission
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <GenZGlassyFooter />
    </>
  );
}
