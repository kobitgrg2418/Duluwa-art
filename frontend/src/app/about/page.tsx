"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import RevixNavbar from "@/components/revix-navbar";
import RevixFooter from "@/components/revix-footer";

export default function AboutPage() {
  const stats = [
    { value: "500+", label: "Artworks Displayed" },
    { value: "50K+", label: "Annual Visitors" },
    { value: "15+", label: "Curated Exhibitions" },
    { value: "7+", label: "Years of Excellence" },
  ];

  const milestones = [
    {
      year: "2025",
      title: "Outstanding Contribution to Himalayan Contemporary Art",
      category: "Honors & Recognition",
      award: "Gold Distinction",
    },
    {
      year: "2024",
      title: "Excellence in Curatorial Innovation & Cultural Storytelling",
      category: "Curator Award",
      award: "Platinum Distinction",
    },
    {
      year: "2023",
      title: "Traditional Wash & Cotton Rag Innovation",
      category: "Material Craft",
      award: "Heritage Preservation Award",
    },
  ];

  const values = [
    {
      title: "Artistic Excellence",
      desc: "Every piece is crafted with meticulous attention to detail, combining traditional techniques with contemporary vision.",
      img: "/art/drawing-08.jpg",
    },
    {
      title: "Authentic Materials",
      desc: "Authentic handmade cotton rag papers, pure archival mineral pigments, and natural botanical washes.",
      img: "/art/drawing-09.jpg",
    },
    {
      title: "Cultural Heritage",
      desc: "Celebrating the rich artistic traditions of Nepal while embracing a clean, modern aesthetic dialogue.",
      img: "/art/drawing-03.jpg",
    },
  ];

  return (
    <div className="bg-[#fcfcfc] text-black min-h-screen">
      <RevixNavbar />

      {/* Hero Header */}
      <section className="rx-hero">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-12 border-b border-black/10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-black/50 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#ff2a2a]"></span>
              About The Artist &amp; Gallery
            </div>
            <h1 className="rx-hero-title">
              The Story of<br />
              Duluwa Gallery
            </h1>
          </div>
          <div className="max-w-md">
            <p className="rx-hero-sub mb-6">
              Founded on the belief that Himalayan art can bridge ancestral reverence with bold
              minimalist design, Duluwa Gallery is dedicated to elevating fine watercolour and drawing.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="rx-btn rx-btn-black">
                Contact the Studio <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/commission" className="rx-btn rx-btn-outline">
                Request Commission
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Experience & Stats Section */}
      <section className="py-20 px-8 max-w-[1720px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-20 border-b border-black/10 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-5xl md:text-6xl font-extrabold tracking-tight mb-2">
                {s.value}
              </div>
              <div className="text-xs uppercase tracking-widest text-black/50 font-semibold">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Story & Philosophy */}
      <section className="py-16 px-8 max-w-[1720px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 relative aspect-[4/3] rounded overflow-hidden">
            <Image
              src="/art/drawing-02.jpg"
              alt="Duluwa portrait technique"
              fill
              className="object-cover"
            />
          </div>
          <div className="lg:col-span-6">
            <span className="text-xs uppercase tracking-widest text-black/50 font-semibold block mb-3">
              Philosophy &amp; Method
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-6">
              Capturing Light Across Himalayan Ridges
            </h2>
            <p className="text-base text-black/70 leading-relaxed mb-6">
              Our studio approaches every piece with quiet patience. Whether rendering the early
              morning glow over Machhapuchhre or the weathered gaze of a Mustang elder, our focus
              remains on the living pulse of Nepal.
            </p>
            <p className="text-base text-black/70 leading-relaxed mb-8">
              We work closely with private collectors, interior architects, and galleries worldwide,
              offering both original exhibited pieces and bespoke commissions crafted to harmonize
              with specific spaces.
            </p>
            <Link href="/shop" className="rx-btn rx-btn-black">
              View Available Works <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-24 px-8 max-w-[1720px] mx-auto border-t border-black/10">
        <div className="mb-16">
          <span className="text-xs uppercase tracking-widest text-black/50 font-semibold block mb-2">
            Core Principles
          </span>
          <h2 className="text-4xl font-bold tracking-tight">The Duluwa Approach</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {values.map((v) => (
            <div key={v.title} className="rx-card">
              <div className="rx-card-media relative aspect-[4/3] rounded overflow-hidden mb-6">
                <Image
                  src={v.img}
                  alt={v.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-3">{v.title}</h3>
              <p className="text-black/70 leading-relaxed text-sm">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Honors & Milestones */}
      <section className="rx-dark-section">
        <div className="rx-dark-inner">
          <div className="mb-12">
            <span className="text-xs uppercase tracking-widest text-white/50 font-semibold block mb-2">
              Recognitions
            </span>
            <h2 className="text-4xl font-bold tracking-tight">Honors &amp; Milestones</h2>
          </div>

          <div className="divide-y divide-white/10">
            {milestones.map((m) => (
              <div key={m.title} className="py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-white/40 block mb-1">
                    {m.category}
                  </span>
                  <h4 className="text-xl font-bold">{m.title}</h4>
                </div>
                <div className="flex items-center gap-6">
                  <span className="rx-btn rx-btn-outline-white text-xs">{m.award}</span>
                  <span className="text-2xl font-mono text-white/60">{m.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RevixFooter />
    </div>
  );
}
