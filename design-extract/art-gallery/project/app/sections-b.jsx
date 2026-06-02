/* =========================================================================
   Sections B — Virtual Exhibition, Creative Process, Video,
   Testimonials, Commission Inquiry
   ========================================================================= */
const { useState, useEffect, useRef } = React;

/* ---- 04 · Virtual Exhibition Preview --------------------------------- */
function Exhibition() {
  const A = window.GALLERY.ARTWORKS;
  const wall = [A[0], A[8], A[2], A[6], A[3]];
  return (
    <section className="section--tight section exhibition" id="exhibition">
      <div className="wrap">
        <div className="exhibition__head">
          <div>
            <Reveal><Eyebrow idx="04">Virtual Exhibition</Eyebrow></Reveal>
            <Reveal delay={1}><h2 className="display h-lg" style={{ marginTop: "1rem" }}>Walk the room</h2></Reveal>
          </div>
          <Reveal delay={2} className="exhibition__head-r">
            <p className="serif-body">A curated hang of eleven works, lit and spaced as they would be on the wall. Step inside and move at your own pace.</p>
          </Reveal>
        </div>
      </div>

      <Reveal className="exhibition__room">
        <div className="exhibition__wall" data-parallax="3">
          {wall.map((a, i) => (
            <figure className="exhibition__hang" key={a.id} style={{ "--i": i }}>
              <ArtFrame hue={a.hue} ratio={a.ratio > 1 ? 1.18 : 0.78} fill
                        style={{ height: i % 2 ? "240px" : "300px" }}
                        label={a.title.toLowerCase()} sub={a.size} />
              <figcaption className="meta exhibition__plate">{a.title} · {a.year}</figcaption>
            </figure>
          ))}
        </div>
        <div className="exhibition__floor" />
        <a href="collections.html" className="exhibition__enter">
          <span className="btn" style={{ background: "var(--paper)", color: "var(--ink)" }}>Enter the exhibition <span className="arr">→</span></span>
        </a>
      </Reveal>
    </section>
  );
}

/* ---- 05 · Creative Process (sticky scroll) --------------------------- */
function Process() {
  const P = window.GALLERY.PROCESS;
  const [active, setActive] = useState(0);
  const refs = useRef([]);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(Number(e.target.dataset.i));
      });
    }, { threshold: 0.6 });
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);
  return (
    <section className="section is-dark process" id="process">
      <div className="wrap process__grid">
        <div className="process__sticky">
          <div className="process__head">
            <Eyebrow idx="05">The Process</Eyebrow>
            <h2 className="display h-md" style={{ color: "var(--paper)", marginTop: "1rem" }}>How a wash<br/>becomes a world</h2>
          </div>
          <div className="process__viz">
            {P.map((p, i) => (
              <div key={p.no} className={`process__viz-img ${active === i ? "on" : ""}`}>
                <ArtFrame hue={p.hue} fill style={{ height: "100%" }} label={`${p.title.toLowerCase()}`} sub={`stage ${p.no}`} />
              </div>
            ))}
            <span className="process__viz-no mono">{P[active].no} / 04</span>
          </div>
        </div>
        <ol className="process__steps">
          {P.map((p, i) => (
            <li key={p.no} ref={(el) => (refs.current[i] = el)} data-i={i}
                className={`process__step ${active === i ? "on" : ""}`}>
              <span className="process__step-no mono">{p.no}</span>
              <h3 className="display" style={{ fontSize: "clamp(1.8rem,3.4vw,2.8rem)", color: "var(--paper)" }}>{p.title}</h3>
              <p className="serif-body">{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---- 06 · Video Showcase --------------------------------------------- */
function VideoShowcase() {
  const [playing, setPlaying] = useState(false);
  return (
    <section className="section video" id="video">
      <div className="wrap">
        <div className="section-head video__head">
          <Reveal><Eyebrow idx="06">In Motion</Eyebrow></Reveal>
          <Reveal delay={1}><h2 className="display h-lg">The studio, at work</h2></Reveal>
        </div>
      </div>
      <Reveal clip className="video__stage-wrap">
        <div className={`video__stage ${playing ? "playing" : ""}`}>
          <ArtFrame hue={30} fill style={{ height: "100%" }} label="studio film · poster" sub="1920 × 1080" parallax={4} />
          <div className="video__overlay" />
          {!playing ? (
            <button className="video__play" onClick={() => setPlaying(true)} aria-label="Play film">
              <span className="video__play-ring"><span className="video__play-tri">▶</span></span>
              <span className="meta" style={{ color: "var(--paper)", letterSpacing: ".22em" }}>Watch · 3:48</span>
            </button>
          ) : (
            <div className="video__placeholder">
              <span className="mono">▣ video source not yet connected</span>
              <span className="meta" style={{ marginTop: ".6rem" }}>Drop a film file or link here — the player is wired and ready.</span>
              <button className="link-u" style={{ color: "var(--paper)", marginTop: "1.4rem" }} onClick={() => setPlaying(false)}>← Back to poster</button>
            </div>
          )}
          <div className="video__caption">
            <span className="meta" style={{ color: "rgba(250,248,243,0.7)" }}>From paper to painting</span>
            <span className="meta" style={{ color: "rgba(250,248,243,0.5)" }}>A film by the studio</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ---- 07 · Testimonials ------------------------------------------------ */
function Testimonials() {
  const T = window.GALLERY.TESTIMONIALS;
  const [i, setI] = useState(0);
  const go = (d) => setI((p) => (p + d + T.length) % T.length);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % T.length), 7000);
    return () => clearInterval(t);
  }, [T.length]);
  const t = T[i];
  return (
    <section className="section testimonials" id="testimonials">
      <div className="wrap testimonials__inner">
        <Reveal><Eyebrow idx="07">In Their Words</Eyebrow></Reveal>
        <div className="testimonials__stage">
          <span className="testimonials__mark">“</span>
          <Reveal delay={1}>
            <blockquote key={i} className="testimonials__quote display">{t.quote}</blockquote>
          </Reveal>
          <div className="testimonials__foot">
            <div className="testimonials__who">
              <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.3rem" }}>{t.who}</span>
              <span className="meta">{t.role}</span>
            </div>
            <div className="testimonials__ctrl">
              <button onClick={() => go(-1)} aria-label="Previous">‹</button>
              <span className="mono">{String(i + 1).padStart(2, "0")} / {String(T.length).padStart(2, "0")}</span>
              <button onClick={() => go(1)} aria-label="Next">›</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- 08 · Commission Inquiry ----------------------------------------- */
function Commission() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", type: "Portrait", message: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = (e) => { e.preventDefault(); setSent(true); };
  const types = ["Portrait", "Landscape", "Wildlife", "Other"];
  return (
    <section className="section is-dark commission" id="commission">
      <div className="wrap commission__grid">
        <div className="commission__intro">
          <Reveal><Eyebrow idx="08">Commission</Eyebrow></Reveal>
          <Reveal delay={1}>
            <h2 className="display h-lg" style={{ color: "var(--paper)", marginTop: "1rem" }}>
              Commission a<br/>work in water
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="serif-body" style={{ marginTop: "1.4rem" }}>
              A portrait, a beloved landscape, a creature from the wild — painted to your story, in the artist's own hand. Commissions are accepted in limited number each season.
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
                <textarea rows="3" value={form.message} onChange={set("message")} placeholder="The subject, the size, the occasion…" />
              </label>
              <button type="submit" className="btn" style={{ background: "var(--paper)", color: "var(--ink)", alignSelf: "flex-start" }}>
                Send inquiry <span className="arr">→</span>
              </button>
              <a href="commission.html" className="link-u" style={{ color: "rgba(250,248,243,0.7)" }}>See full commission process <span className="arr">→</span></a>
            </form>
          ) : (
            <div className="commission__thanks">
              <span className="commission__thanks-mark">✓</span>
              <h3 className="display h-sm" style={{ color: "var(--paper)" }}>Thank you, {form.name.split(" ")[0] || "friend"}.</h3>
              <p className="serif-body">Your inquiry is received. The studio replies to every commission personally within a few days.</p>
              <button className="link-u" style={{ color: "var(--paper)" }} onClick={() => { setSent(false); setForm({ name: "", email: "", type: "Portrait", message: "" }); }}>Send another <span className="arr">→</span></button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

Object.assign(window, { Exhibition, Process, VideoShowcase, Testimonials, Commission });
