/* =========================================================================
   Sections A — Featured Works, Collections preview, Artist Story
   ========================================================================= */

function artIndex(id) { return window.GALLERY.ARTWORKS.findIndex((a) => a.id === id); }

/* ---- 01 · Featured Works --------------------------------------------- */
function Featured() {
  const { open } = useLightbox();
  const items = window.GALLERY.ARTWORKS.filter((a) => a.feat);
  return (
    <section className="section featured" id="featured">
      <div className="wrap">
        <div className="featured__head">
          <div className="featured__head-l">
            <Reveal><Eyebrow idx="01">Selected Works</Eyebrow></Reveal>
            <Reveal delay={1}><h2 className="display h-lg">Paintings worth<br/>standing still for</h2></Reveal>
          </div>
          <Reveal delay={2} className="featured__head-r">
            <p className="serif-body">Four works from the studio — each a single, unrepeatable conversation between water, pigment and the tooth of the paper.</p>
            <a href="collections.html" className="link-u">All collections <span className="arr">→</span></a>
          </Reveal>
        </div>

        <div className="featured__rows">
          {items.map((a, i) => (
            <Reveal clip key={a.id} className={`featured__row ${i % 2 ? "rev" : ""}`}>
              <ArtFrame hue={a.hue} ratio={a.ratio} clickable parallax={4}
                        onOpen={() => open(artIndex(a.id))}
                        label={a.title.toLowerCase()} sub={a.size} className="featured__art" />
              <div className="featured__txt">
                <div className="featured__lead">
                  <span className="featured__no">{String(i + 1).padStart(2, "0")}</span>
                  <span className="meta">{a.coll === "himalaya" ? "Himalayan Landscapes" : a.coll === "portrait" ? "Portraits" : a.coll === "wildlife" ? "Wildlife" : "Nepalese Culture"}</span>
                </div>
                <h3 className="display h-md featured__title">{a.title}</h3>
                <p className="lede" style={{ fontSize: "1.18rem", maxWidth: "32ch" }}>{a.note}</p>
                <div className="featured__meta">
                  <span className="meta">{a.medium}</span>
                  <span className="meta">{a.size} · {a.year}</span>
                </div>
                <button className="link-u" onClick={() => open(artIndex(a.id))}>View work <span className="arr">→</span></button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- 02 · Collections preview ---------------------------------------- */
function CollectionsPreview() {
  const C = window.GALLERY.COLLECTIONS;
  const [active, setActive] = React.useState(0);
  const [offset, setOffset] = React.useState(0);
  const trackRef = React.useRef(null);
  const cardRefs = React.useRef([]);

  const recalc = React.useCallback(() => {
    const card = cardRefs.current[active];
    const vp = trackRef.current && trackRef.current.parentElement;
    if (!card || !vp) return;
    // Center the active card within the viewport.
    setOffset(vp.clientWidth / 2 - (card.offsetLeft + card.offsetWidth / 2));
  }, [active]);

  React.useEffect(() => {
    recalc();
    const t = setTimeout(recalc, 350);
    window.addEventListener("resize", recalc);
    return () => { clearTimeout(t); window.removeEventListener("resize", recalc); };
  }, [recalc]);

  const go = (d) => setActive((p) => Math.min(C.length - 1, Math.max(0, p + d)));
  const cur = C[active];

  // Auto-advance: loops the focus through every collection; pauses on hover/focus
  // and only resumes once the section is in view.
  const [paused, setPaused] = React.useState(false);
  const secRef = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const check = () => {
      const el = secRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      setInView(r.top < vh * 0.7 && r.bottom > vh * 0.3);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => { window.removeEventListener("scroll", check); window.removeEventListener("resize", check); };
  }, []);
  React.useEffect(() => {
    if (paused || !inView) return;
    const t = setInterval(() => {
      setActive((p) => (p + 1) % C.length); // wraps back to the first
    }, 3800);
    return () => clearInterval(t);
  }, [paused, inView, C.length]);

  return (
    <section className="section is-dark cslider-sec" id="collections" ref={secRef}
             onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
             onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <div className="wrap">
        <div className="cslider-head">
          <div className="cslider-head__l">
            <Reveal><Eyebrow idx="02">Collections</Eyebrow></Reveal>
            <Reveal delay={1}><h2 className="display h-lg" style={{ color: "var(--paper)" }}>Six bodies<br/>of work</h2></Reveal>
          </div>
          <Reveal delay={2} className="cslider-head__r">
            <p className="serif-body">Six recurring worlds the artist returns to. Bring one into focus.</p>
          </Reveal>
        </div>
      </div>

      <div className="cslider__viewport">
        <div className="cslider__track" ref={trackRef} style={{ transform: `translate3d(${offset}px,0,0)` }}>
          {C.map((c, i) => (
            <button key={c.id} ref={(el) => (cardRefs.current[i] = el)}
                    className={`ccard ${i === active ? "on" : ""}`}
                    aria-label={c.title}
                    onClick={() => (i === active ? (window.location.href = `collections.html#${c.id}`) : setActive(i))}>
              <span className="ccard__no mono">{c.no}</span>
              <div className="ccard__art">
                <ArtFrame hue={c.hue} fill style={{ height: "100%" }} label={c.title.toLowerCase()} sub={`${c.count} works`} />
              </div>
              <div className="ccard__cap">
                <h3 className="display">{c.title}</h3>
                <span className="meta">{c.count} works</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="wrap">
        <div className="cslider__bar">
          <div className="cslider__info" key={active}>
            <p className="serif-body" style={{ margin: 0, maxWidth: "42ch" }}>{cur.blurb}</p>
            <a href={`collections.html#${cur.id}`} className="link-u" style={{ color: "var(--paper)" }}>
              View {cur.title} <span className="arr">→</span>
            </a>
          </div>
          <div className="cslider__ctrl">
            <button onClick={() => go(-1)} disabled={active === 0} aria-label="Previous">‹</button>
            <span className="mono">{cur.no} / {String(C.length).padStart(2, "0")}</span>
            <button onClick={() => go(1)} disabled={active === C.length - 1} aria-label="Next">›</button>
          </div>
        </div>
        <div className="cslider__dots">
          {C.map((c, i) => (
            <button key={c.id} className={`cdot ${i === active ? "on" : ""}`} onClick={() => setActive(i)} aria-label={c.title}>
              <span style={{ width: i === active ? "46px" : "20px" }}></span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- 03 · Artist Story ------------------------------------------------ */
function ArtistStory() {
  return (
    <section className="section story" id="story">
      <div className="wrap story__grid">
        <div className="story__col-img">
          <Reveal clip>
            <ArtFrame hue={44} ratio={1.22} parallax={8} label="kobit gurung · portrait" sub="studio, patan" />
          </Reveal>
          <Reveal delay={2} className="story__cap meta">Kobit in the courtyard studio, Patan — 2025</Reveal>
        </div>
        <div className="story__col-txt">
          <Reveal><Eyebrow idx="03">The Artist</Eyebrow></Reveal>
          <Reveal delay={1}>
            <h2 className="display h-md" style={{ marginTop: "1.2rem" }}>
              No school taught these hands. The mountains did.
            </h2>
          </Reveal>
          <Reveal delay={2} className="story__body">
            <p className="serif-body">
              Kobit Gurung never sat in an art academy. He learned to paint the way the rivers of his country learned to carve stone — slowly, by returning to the same place again and again.
            </p>
            <p className="serif-body">
              Born in the hills above Pokhara, he traded a first brush for a week's wages and taught himself the patience that watercolour demands: that light cannot be added, only protected; that the medium rewards the honest and humbles the rest.
            </p>
            <Reveal className="story__quote" as="blockquote">
              <span className="story__mark">“</span>
              I am not painting the mountain. I am painting the morning the mountain let me see it.
            </Reveal>
            <p className="serif-body">
              Two decades on, his works hang in collections from Kathmandu to Zürich — yet each begins the same way, with torn paper and a glass of clean water at dawn.
            </p>
            <div className="story__stats">
              <div><span className="display" style={{ fontSize: "2.6rem" }}>17</span><span className="meta">Years painting</span></div>
              <div><span className="display" style={{ fontSize: "2.6rem" }}>130<span style={{ fontSize: "1.4rem" }}>+</span></span><span className="meta">Works in collections</span></div>
              <div><span className="display" style={{ fontSize: "2.6rem" }}>9</span><span className="meta">Solo exhibitions</span></div>
            </div>
            <div className="story__sign">Kobit Gurung</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Featured, CollectionsPreview, ArtistStory, artIndex });
