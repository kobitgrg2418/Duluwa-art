"use client";

import { useState, FormEvent } from "react";
import { Reveal, Eyebrow, useRevealEngine } from "@/components/atoms";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export default function CommissionPage() {
  useRevealEngine();

  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", type: "Portrait", size: "Medium", budget: "", message: "" });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = (e: FormEvent) => { e.preventDefault(); setSent(true); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const types = ["Portrait", "Landscape", "Wildlife", "Culture", "Other"];
  const sizes = ["Small", "Medium", "Large"];

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
                    <div className="field"><span className="field__label">Approximate size</span>
                      <div className="field__chips">
                        {sizes.map((sz) => (
                          <button type="button" key={sz} className={`chip ${form.size === sz ? "on" : ""}`}
                                  onClick={() => setForm((f) => ({ ...f, size: sz }))}>{sz}</button>
                        ))}
                      </div>
                    </div>
                    <label className="field"><span className="field__label">Budget (optional)</span>
                      <input value={form.budget} onChange={set("budget")} placeholder="e.g. $1,000" /></label>
                    <label className="field"><span className="field__label">Tell the story</span>
                      <textarea rows={4} value={form.message} onChange={set("message")} placeholder="The subject, the occasion, any reference you have in mind…" /></label>
                    <button type="submit" className="btn" style={{ alignSelf: "flex-start" }}>Send inquiry <span className="arr">→</span></button>
                  </form>
                ) : (
                  <div className="cm-thanks">
                    <span className="cm-thanks-mark">✓</span>
                    <h3 className="display h-sm">Thank you, {form.name.split(" ")[0] || "friend"}.</h3>
                    <p className="muted">Your inquiry is received. The studio replies to every commission personally within a few days — usually with a question or two about the light you have in mind.</p>
                    <button className="link-u" onClick={() => { setSent(false); setForm({ name: "", email: "", type: "Portrait", size: "Medium", budget: "", message: "" }); }}>
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
