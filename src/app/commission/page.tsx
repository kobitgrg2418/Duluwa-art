"use client";

import { useState, useRef, useCallback, FormEvent } from "react";
import { Reveal, Eyebrow, useRevealEngine } from "@/components/atoms";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const SIZES = [
  "A2 (42 x 59.4 cm)",
  "A3 (29.7 x 42 cm)",
  "A4 (21 x 29.7 cm)",
  "Quarter (18.2 x 25.7 cm)",
];
const MEDIUMS = [
  "Watercolour on cotton rag",
  "Watercolour & graphite",
  "Watercolour sketch",
  "Graphite / pencil only",
  "Mixed media",
];

function RefImageUploader({ onFileChange }: { onFileChange: (file: File | null) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    onFileChange(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }, [onFileChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const clear = () => { setPreview(null); onFileChange(null); };

  return (
    <div className="field">
      <span className="field__label">Reference image (optional)</span>
      <div
        className={`comm-dropzone ${dragOver ? "comm-dropzone--over" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <div className="comm-dropzone__preview">
            <img src={preview} alt="Reference" />
            <button type="button" className="comm-dropzone__clear" onClick={(e) => { e.stopPropagation(); clear(); }}>&times;</button>
          </div>
        ) : (
          <div className="comm-dropzone__empty">
            <span className="comm-dropzone__icon">&#128247;</span>
            <span>Drag & drop your reference photo or <u>browse</u></span>
            <span className="comm-dropzone__hint">JPG, PNG, WebP &middot; Max 10 MB</span>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} style={{ display: "none" }} />
    </div>
  );
}

export default function CommissionPage() {
  useRevealEngine();

  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", type: "Portrait", size: "", medium: "", budget: "", message: "" });
  const [refImage, setRefImage] = useState<File | null>(null);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("type", form.type);
      fd.append("size", form.size);
      fd.append("medium", form.medium);
      fd.append("budget", form.budget);
      fd.append("message", form.message);
      if (refImage) fd.append("refImage", refImage);

      const res = await fetch("/api/commission", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setSent(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };
  const types = ["Portrait", "Landscape", "Wildlife", "Culture", "Other"];

  const steps = [
    { no: "01", t: "The conversation", d: "Tell the studio about your subject — a person, a place, a creature, an occasion. Kobit replies to every inquiry personally." },
    { no: "02", t: "Sketch & colour study", d: "From reference photographs, the artist prepares a pencil composition and a small watercolour colour study for your approval." },
    { no: "03", t: "The painting", d: "The final work is built in transparent layers on cotton rag — a process of two to five weeks depending on scale." },
    { no: "04", t: "Framed & delivered", d: "Your watercolour arrives framed to archival, museum-grade standard, with a signed certificate of authenticity." },
  ];
  const pricing = [
    { t: "Small", amt: "from $480", m: "up to 30 × 40 cm · sketch & portrait studies" },
    { t: "Medium", amt: "from $980", m: "up to 56 × 76 cm · portraits & landscapes" },
    { t: "Large", amt: "from $1,900", m: "76 cm and beyond · statement panoramas" },
  ];

  return (
    <>
      <Nav />
      <main>
        <header className="cm-hero">
          <div className="wrap">
            <Reveal><Eyebrow>Commission</Eyebrow></Reveal>
            <Reveal delay={1}><h1 className="display h-xl">A work<br />in water</h1></Reveal>
            <Reveal delay={2}>
              <p className="lede" style={{ maxWidth: "42ch", marginTop: "1.2rem" }}>
                Commission an original watercolour in the artist&apos;s own hand — a portrait, a beloved landscape, a creature from the wild. Accepted in limited number each season.
              </p>
            </Reveal>
          </div>
        </header>

        <section className="section--tight section">
          <div className="wrap cm-grid">
            <div className="cm-left">
              <Reveal><Eyebrow>How it works</Eyebrow></Reveal>
              <ol className="cm-steps">
                {steps.map((s) => (
                  <Reveal as="li" key={s.no} className="cm-step">
                    <span className="cm-step__no">{s.no}</span>
                    <div><h3>{s.t}</h3><p>{s.d}</p></div>
                  </Reveal>
                ))}
              </ol>
              <Reveal>
                <Eyebrow style={{ marginTop: "1rem" }}>Guide pricing</Eyebrow>
                <div className="cm-pricing">
                  {pricing.map((p) => (
                    <div className="cm-price" key={p.t}>
                      <h4>{p.t}</h4>
                      <span className="amt">{p.amt}</span>
                      <span className="meta">{p.m}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal delay={1}>
              <div className="cm-form-card">
                {!sent ? (
                  <form className="cm-form" onSubmit={submit}>
                    <div className="cm-row2">
                      <label className="field"><span className="field__label">Your name</span>
                        <input required value={form.name} onChange={set("name")} placeholder="Full name" /></label>
                      <label className="field"><span className="field__label">Email</span>
                        <input required type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" /></label>
                    </div>
                    <div className="field"><span className="field__label">Subject</span>
                      <div className="field__chips">
                        {types.map((ty) => (
                          <button type="button" key={ty} className={`chip ${form.type === ty ? "on" : ""}`}
                                  onClick={() => setForm((f) => ({ ...f, type: ty }))}>{ty}</button>
                        ))}
                      </div>
                    </div>
                    <div className="comm-row2">
                      <label className="field"><span className="field__label">Size</span>
                        <select value={form.size} onChange={set("size")} className="comm-select">
                          <option value="">Select size...</option>
                          {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </label>
                      <label className="field"><span className="field__label">Medium</span>
                        <select value={form.medium} onChange={set("medium")} className="comm-select">
                          <option value="">Select medium...</option>
                          {MEDIUMS.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </label>
                    </div>
                    <label className="field"><span className="field__label">Budget (optional)</span>
                      <input value={form.budget} onChange={set("budget")} placeholder="e.g. $1,000" /></label>
                    <RefImageUploader onFileChange={setRefImage} />
                    <label className="field"><span className="field__label">Tell the story</span>
                      <textarea rows={4} value={form.message} onChange={set("message")} placeholder="The subject, the occasion, any reference you have in mind..." /></label>
                    {error && <p style={{ color: "#ef4444", fontSize: ".88rem", margin: 0 }}>{error}</p>}
                    <button type="submit" className="btn" disabled={sending} style={{ alignSelf: "flex-start", opacity: sending ? 0.6 : 1 }}>{sending ? "Sending..." : "Send inquiry"} <span className="arr">→</span></button>
                  </form>
                ) : (
                  <div className="cm-thanks">
                    <span className="cm-thanks-mark">✓</span>
                    <h3 className="display h-sm">Thank you, {form.name.split(" ")[0] || "friend"}.</h3>
                    <p className="muted">Your inquiry is received. The studio replies to every commission personally within a few days — usually with a question or two about the light you have in mind.</p>
                    <button className="link-u" onClick={() => { setSent(false); setForm({ name: "", email: "", type: "Portrait", size: "", medium: "", budget: "", message: "" }); setRefImage(null); }}>
                      Send another <span className="arr">→</span>
                    </button>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
