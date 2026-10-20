"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { api } from "@/lib/api";
import "@/app/template.css";

const commissionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  type: z.string().min(1, "Please select an artwork type"),
  size: z.string().optional(),
  medium: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(20, "Please provide more details about your vision"),
  refImage: z.any().optional(),
});

type CommissionFormData = z.infer<typeof commissionSchema>;

const artworkTypes = [
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
  { value: "abstract", label: "Abstract" },
  { value: "still-life", label: "Still Life" },
  { value: "custom", label: "Custom / Other" },
];

const sizeOptions = [
  { value: "", label: "Select size" },
  { value: "small", label: "Small (up to 12\")" },
  { value: "medium", label: "Medium (12\" - 24\")" },
  { value: "large", label: "Large (24\" - 36\")" },
  { value: "extra-large", label: "Extra Large (36\"+)" },
];

const mediumOptions = [
  { value: "", label: "Select medium" },
  { value: "graphite", label: "Graphite" },
  { value: "watercolor", label: "Watercolor" },
];

const budgetOptions = [
  { value: "", label: "Select budget range" },
  { value: "3000-10000", label: "Rs 3,000 - Rs 10,000" },
  { value: "10000-20000", label: "Rs 10,000 - Rs 20,000" },
  { value: "20000-30000", label: "Rs 20,000 - Rs 30,000" },
  { value: "30000-40000", label: "Rs 30,000 - Rs 40,000" },
  { value: "40000+", label: "Rs 40,000+" },
];

export default function CommissionPage() {
  const [submitting, setSubmitting] = useState(false);
  const [refImageFile, setRefImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommissionFormData>({
    resolver: zodResolver(commissionSchema),
  });

  const onSubmit = async (data: CommissionFormData) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("type", data.type);
      if (data.size) formData.append("size", data.size);
      if (data.medium) formData.append("medium", data.medium);
      if (data.budget) formData.append("budget", data.budget);
      formData.append("message", data.message);
      if (refImageFile) {
        formData.append("ref_image", refImageFile);
      }

      await api.postForm("/commission/", formData);
      toast.success("Commission request submitted! We'll contact you within 24 hours.");
      reset();
      setRefImageFile(null);
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="galleria">
      {/* HEADER */}
      <header className="g-header">
        <Link href="/" className="g-logo">
          DULUWA-ART
        </Link>

        <nav className="g-nav">
          <Link href="/">Home</Link>
          <Link href="/collections">Collections</Link>
          <Link href="/shop">Shop Art</Link>
          <Link href="/commission" className="active">Commission</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <Link href="/commission" className="g-header-cta">
          <span>Commission Art</span>
          <span>&rarr;</span>
        </Link>
      </header>

      {/* HERO */}
      <section className="g-hero">
        <div className="g-hero-copy">
          <div className="g-eyebrow">
            <span>BESPOKE COMMISSIONS</span>
            <span>&bull;</span>
            <span>NEPAL</span>
          </div>
          <h1 className="g-hero-title">
            Commission a<br />Custom Piece.
          </h1>
          <div className="g-hero-bottom">
            <p className="g-hero-description">
              Work directly with our artists to create a bespoke piece that captures your unique vision and personal story.
            </p>
            <a href="#form" className="g-round-link">
              <span>Start</span>
              <span>Now &rarr;</span>
            </a>
          </div>
        </div>

        <div className="g-hero-image-wrap">
          <img
            src="/art/dancer.jpeg"
            alt="Commission Artwork"
          />
          <div className="g-image-stamp">
            <i>&#9670;</i>
            <span>DULUWA</span>
          </div>
        </div>

        <div className="g-hero-side-note">
          BESPOKE WORK
        </div>
      </section>

      {/* MARQUEE */}
      <div className="g-marquee">
        <div className="g-marquee-track">
          <span>CUSTOM PORTRAITS</span>
          <span>LANDSCAPE COMMISSIONS</span>
          <span>HERITAGE PIECES</span>
          <span>GIFT ARTWORK</span>
          <span>COLLECTOR EDITIONS</span>
          <span>CUSTOM PORTRAITS</span>
          <span>LANDSCAPE COMMISSIONS</span>
          <span>HERITAGE PIECES</span>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="g-section">
        <div className="g-section-label">
          <span>THE PROCESS</span>
          <span>[ 4 STEPS ]</span>
        </div>

        <div className="g-about-grid">
          <h2 className="g-display">
            How It Works
          </h2>

          <div className="g-about-copy">
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="g-stats">
                  <strong>01</strong>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Share Your Vision</h3>
                  <p className="text-sm text-muted-foreground">Tell us about your idea, style preferences, and requirements.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="g-stats">
                  <strong>02</strong>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Artist Matching</h3>
                  <p className="text-sm text-muted-foreground">We connect you with the perfect artist for your project.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="g-stats">
                  <strong>03</strong>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Review & Approve</h3>
                  <p className="text-sm text-muted-foreground">See sketches and progress, request revisions until it's perfect.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="g-stats">
                  <strong>04</strong>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Delivery</h3>
                  <p className="text-sm text-muted-foreground">Receive your completed artwork with certificate of authenticity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMISSION FORM */}
      <section id="form" className="g-section">
        <div className="g-section-label">
          <span>START YOUR COMMISSION</span>
          <span>[ FILL THE FORM ]</span>
        </div>

        <div className="g-about-grid">
          <h2 className="g-display">
            Tell Us Your<br />Vision.
          </h2>

          <div className="g-about-copy">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2">Full Name *</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    {...register("name")}
                    className="w-full border border-black/10 p-3 bg-transparent outline-none focus:border-black/50 transition-colors"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2">Email Address *</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    {...register("email")}
                    className="w-full border border-black/10 p-3 bg-transparent outline-none focus:border-black/50 transition-colors"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest mb-2">Artwork Type *</label>
                <select
                  {...register("type")}
                  className="w-full border border-black/10 p-3 bg-transparent outline-none focus:border-black/50 transition-colors"
                >
                  <option value="">Select artwork type</option>
                  {artworkTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type.message}</p>}
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2">Preferred Size</label>
                  <select
                    {...register("size")}
                    className="w-full border border-black/10 p-3 bg-transparent outline-none focus:border-black/50 transition-colors"
                  >
                    {sizeOptions.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2">Preferred Medium</label>
                  <select
                    {...register("medium")}
                    className="w-full border border-black/10 p-3 bg-transparent outline-none focus:border-black/50 transition-colors"
                  >
                    {mediumOptions.map((medium) => (
                      <option key={medium.value} value={medium.value}>
                        {medium.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2">Budget Range</label>
                  <select
                    {...register("budget")}
                    className="w-full border border-black/10 p-3 bg-transparent outline-none focus:border-black/50 transition-colors"
                  >
                    {budgetOptions.map((budget) => (
                      <option key={budget.value} value={budget.value}>
                        {budget.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest mb-2">Your Vision & Details *</label>
                <textarea
                  placeholder="Describe your vision, color preferences, mood, inspiration images, intended space, and any other details..."
                  rows={6}
                  {...register("message")}
                  className="w-full border border-black/10 p-3 bg-transparent outline-none focus:border-black/50 transition-colors resize-none"
                />
                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest mb-2">Reference Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setRefImageFile(file);
                  }}
                  className="w-full border border-black/10 p-3 bg-transparent outline-none focus:border-black/50 transition-colors"
                />
                {refImageFile && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Selected: {refImageFile.name}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="g-button g-button-dark"
              >
                <span>{submitting ? "Submitting..." : "Submit Commission Request"}</span>
                <span>&rarr;</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="g-footer">
        <div className="g-footer-top">
          <div>
            <div className="g-footer-logo">
              DULUWA-ART
            </div>
            <p>
              Preserving mountain souls through water & pigment.
            </p>
          </div>
          <a
            href="#"
            className="g-back-top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            BACK TO TOP &uarr;
          </a>
        </div>

        <div className="g-footer-bottom">
          <div>
            <Link href="/">Home</Link>
            <Link href="/collections">Collections</Link>
            <Link href="/shop">Shop Art</Link>
            <Link href="/commission">Commission</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <span>&copy; {new Date().getFullYear()} DULUWA ART GALLERY. ALL RIGHTS RESERVED.</span>
        </div>
      </footer>
    </div>
  );
}
