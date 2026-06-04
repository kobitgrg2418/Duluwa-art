"use client";

import { useState, useRef, useCallback, FormEvent } from "react";
import Link from "next/link";
import { Reveal, Eyebrow } from "./atoms";

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

export function CommissionSection() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", type: "Portrait", size: "", medium: "", message: "" });
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
      fd.append("message", form.message);
      if (refImage) fd.append("refImage", refImage);

      const res = await fetch("/api/commission", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };
  const types = ["Portrait", "Landscape", "Wildlife", "Other"];

  return (
    <section className="section is-dark commission" id="commission">
      <div className="wrap commission__grid">
        <div className="commission__intro">
          <Reveal><Eyebrow idx="08">Commission</Eyebrow></Reveal>
          <Reveal delay={1}>
            <h2 className="display h-lg" style={{ color: "var(--paper)", marginTop: "1rem" }}>
              Commission a<br />work in water
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="serif-body" style={{ marginTop: "1.4rem" }}>
              A portrait, a beloved landscape, a creature from the wild — painted to your story, in the artist&apos;s own hand. Commissions are accepted in limited number each season.
            </p>
            <ul className="commission__list">
              <li><span className="mono">01</span> A conversation about your subject</li>
              <li><span className="mono">02</span> Reference, sketches & a colour study for approval</li>
              <li><span className="mono">03</span> The finished watercolour, framed to archival standard</li>
            </ul>
          </Reveal>
        </div>

        <Reveal delay={1} className="commission__form-wrap">
          {!sent ? (
            <form className="commission__form" onSubmit={submit}>
              <label className="field">
                <span className="field__label">Your name</span>
                <input required value={form.name} onChange={set("name")} placeholder="Full name" />
              </label>
              <label className="field">
                <span className="field__label">Email</span>
                <input required type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" />
              </label>
              <div className="field">
                <span className="field__label">What would you like painted?</span>
                <div className="field__chips">
                  {types.map((ty) => (
                    <button type="button" key={ty} className={`chip ${form.type === ty ? "on" : ""}`}
                            onClick={() => setForm((f) => ({ ...f, type: ty }))}>{ty}</button>
                  ))}
                </div>
              </div>
              <div className="comm-row2">
                <label className="field">
                  <span className="field__label">Size</span>
                  <select value={form.size} onChange={set("size")} className="comm-select">
                    <option value="">Select size...</option>
                    {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
                <label className="field">
                  <span className="field__label">Medium</span>
                  <select value={form.medium} onChange={set("medium")} className="comm-select">
                    <option value="">Select medium...</option>
                    {MEDIUMS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </label>
              </div>
              <RefImageUploader onFileChange={setRefImage} />
              <label className="field">
                <span className="field__label">Tell the story</span>
                <textarea rows={3} value={form.message} onChange={set("message")} placeholder="The subject, the occasion, any details..." />
              </label>
              {error && <p style={{ color: "#ef4444", fontSize: ".88rem", margin: 0 }}>{error}</p>}
              <button type="submit" className="btn" disabled={sending} style={{ background: "var(--paper)", color: "var(--ink)", alignSelf: "flex-start", opacity: sending ? 0.6 : 1 }}>
                {sending ? "Sending..." : "Send inquiry"} <span className="arr">→</span>
              </button>
              <Link href="/commission" className="link-u" style={{ color: "rgba(250,248,243,0.7)" }}>See full commission process <span className="arr">→</span></Link>
            </form>
          ) : (
            <div className="commission__thanks">
              <span className="commission__thanks-mark">✓</span>
              <h3 className="display h-sm" style={{ color: "var(--paper)" }}>Thank you, {form.name.split(" ")[0] || "friend"}.</h3>
              <p className="serif-body">Your inquiry is received. The studio replies to every commission personally within a few days.</p>
              <button className="link-u" style={{ color: "var(--paper)" }} onClick={() => { setSent(false); setForm({ name: "", email: "", type: "Portrait", size: "", medium: "", message: "" }); setRefImage(null); }}>
                Send another <span className="arr">→</span>
              </button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
