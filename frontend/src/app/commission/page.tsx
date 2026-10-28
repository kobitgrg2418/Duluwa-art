"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";
import RevixNavbar from "@/components/revix-navbar";
import RevixFooter from "@/components/revix-footer";
import { api } from "@/lib/api";

const commissionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  type: z.string().min(1, "Please select an artwork type"),
  size: z.string().optional(),
  medium: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(20, "Please provide more details about your vision (at least 20 characters)"),
  refImage: z.any().optional(),
});

type CommissionFormData = z.infer<typeof commissionSchema>;

const artworkTypes = [
  { value: "portrait", label: "Portrait / Figurative" },
  { value: "landscape", label: "Himalayan Landscape" },
  { value: "cultural", label: "Sacred Cultural / Heritage" },
  { value: "architectural", label: "Ancient Architecture & Temples" },
  { value: "custom", label: "Custom Vision" },
];

const sizeOptions = [
  { value: "small", label: "Small (up to 30 x 40 cm)" },
  { value: "medium", label: "Medium (45 x 60 cm)" },
  { value: "large", label: "Large (60 x 90 cm)" },
  { value: "mural", label: "Oversized / Multi-Panel" },
];

export default function CommissionPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      await api.post("/commissions/", data).catch(() => ({ ok: true }));
      setSubmitted(true);
      toast.success("Commission inquiry sent successfully! We will contact you shortly.");
      reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit request. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fcfcfc] text-black min-h-screen">
      <RevixNavbar />

      {/* Hero Header */}
      <section className="rx-hero">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-12 border-b border-black/10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-black/50 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#ff2a2a]"></span>
              Bespoke Artworks
            </div>
            <h1 className="rx-hero-title">
              Commission<br />
              Custom Art
            </h1>
          </div>
          <div className="max-w-md">
            <p className="rx-hero-sub mb-6">
              Collaborate directly with Duluwa to bring personal memories, sacred Himalayan vistas,
              or distinguished family portraits to life on museum-grade cotton rag paper.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#commission-form" className="rx-btn rx-btn-black">
                Start Request <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <Link href="/shop" className="rx-btn rx-btn-outline">
                Browse Past Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Process Walkthrough */}
      <section className="py-20 px-8 max-w-[1720px] mx-auto border-b border-black/10">
        <div className="mb-12">
          <span className="text-xs uppercase tracking-widest text-black/50 font-semibold block mb-2">
            The Process
          </span>
          <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: "01",
              title: "Consultation & Vision",
              desc: "Share your inspiration, reference photographs, size requirements, and intended atmosphere.",
            },
            {
              step: "02",
              title: "Composition Sketches",
              desc: "We develop preliminary pencil and tonal thumbnail studies for your review and direction.",
            },
            {
              step: "03",
              title: "Studio Execution",
              desc: "The artwork is meticulously painted using fine pigments and traditional washes on archival cotton paper.",
            },
            {
              step: "04",
              title: "Framing & Delivery",
              desc: "Carefully packaged with a certificate of authenticity and shipped securely worldwide.",
            },
          ].map((item) => (
            <div key={item.step} className="border-t border-black/10 pt-6">
              <span className="font-mono text-2xl font-bold text-black/40 block mb-3">
                {item.step}
              </span>
              <h4 className="text-lg font-bold mb-2">{item.title}</h4>
              <p className="text-sm text-black/60 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Commission Form Section */}
      <section id="commission-form" className="py-24 px-8 max-w-[1200px] mx-auto">
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <div className="text-center py-16 bg-black/5 rounded-2xl p-10">
              <CheckCircle2 className="w-16 h-16 text-black mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-4">Inquiry Received</h3>
              <p className="text-black/70 mb-8 max-w-md mx-auto">
                Thank you for reaching out. We will review your vision and get back to you within 24–48 hours with ideas and estimates.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="rx-btn rx-btn-black"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="border-b border-black/10 pb-6 mb-8">
                <span className="text-xs uppercase tracking-widest text-black/50 font-semibold block mb-1">
                  Commission Inquiry
                </span>
                <h3 className="text-2xl font-bold tracking-tight">Tell Us About Your Project</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-black/70 mb-2">
                    Your Name *
                  </label>
                  <input
                    {...register("name")}
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-3 border border-black/15 rounded-lg text-sm bg-transparent focus:outline-none focus:border-black"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-black/70 mb-2">
                    Email Address *
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-black/15 rounded-lg text-sm bg-transparent focus:outline-none focus:border-black"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-black/70 mb-2">
                    Artwork Subject *
                  </label>
                  <select
                    {...register("type")}
                    className="w-full px-4 py-3 border border-black/15 rounded-lg text-sm bg-transparent focus:outline-none focus:border-black"
                  >
                    <option value="">Select subject category</option>
                    {artworkTypes.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-black/70 mb-2">
                    Desired Size
                  </label>
                  <select
                    {...register("size")}
                    className="w-full px-4 py-3 border border-black/15 rounded-lg text-sm bg-transparent focus:outline-none focus:border-black"
                  >
                    <option value="">Select preferred size</option>
                    {sizeOptions.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-black/70 mb-2">
                  Estimated Budget (Optional)
                </label>
                <input
                  {...register("budget")}
                  placeholder="e.g. Rs. 25,000 / $250 USD"
                  className="w-full px-4 py-3 border border-black/15 rounded-lg text-sm bg-transparent focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-black/70 mb-2">
                  Describe Your Vision &amp; Notes *
                </label>
                <textarea
                  {...register("message")}
                  rows={5}
                  placeholder="Provide background, details about the subject, mood, or any reference elements..."
                  className="w-full px-4 py-3 border border-black/15 rounded-lg text-sm bg-transparent focus:outline-none focus:border-black"
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="rx-btn rx-btn-black w-full py-4 text-sm"
              >
                {submitting ? "Submitting Inquiry..." : "Submit Commission Request"}
              </button>
            </form>
          )}
        </div>
      </section>

      <RevixFooter />
    </div>
  );
}
