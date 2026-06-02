"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Reveal, Eyebrow } from "./atoms";

export function CommissionSection() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", type: "Portrait", message: "" });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: FormEvent) => { e.preventDefault(); setSent(true); };
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
              <label className="field">
                <span className="field__label">Tell the story</span>
                <textarea rows={3} value={form.message} onChange={set("message")} placeholder="The subject, the size, the occasion…" />
              </label>
              <button type="submit" className="btn" style={{ background: "var(--paper)", color: "var(--ink)", alignSelf: "flex-start" }}>
                Send inquiry <span className="arr">→</span>
              </button>
              <Link href="/commission" className="link-u" style={{ color: "rgba(250,248,243,0.7)" }}>See full commission process <span className="arr">→</span></Link>
            </form>
          ) : (
            <div className="commission__thanks">
              <span className="commission__thanks-mark">✓</span>
              <h3 className="display h-sm" style={{ color: "var(--paper)" }}>Thank you, {form.name.split(" ")[0] || "friend"}.</h3>
              <p className="serif-body">Your inquiry is received. The studio replies to every commission personally within a few days.</p>
              <button className="link-u" style={{ color: "var(--paper)" }} onClick={() => { setSent(false); setForm({ name: "", email: "", type: "Portrait", message: "" }); }}>
                Send another <span className="arr">→</span>
              </button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
