/* =========================================================================
   Chrome — Nav, mobile menu, Lightbox, Footer
   ========================================================================= */
const { useState, useEffect, useRef, useCallback } = React;

const NAV_LINKS = [
  { n: "01", label: "Works", href: "#featured" },
  { n: "02", label: "Collections", href: "collections.html" },
  { n: "03", label: "Story", href: "#story" },
  { n: "04", label: "Exhibition", href: "#exhibition" },
  { n: "05", label: "Process", href: "#process" },
];

function Nav({ onDark }) {
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { document.body.style.overflow = menu ? "hidden" : ""; }, [menu]);

  const dark = onDark && !solid;
  return (
    <React.Fragment>
      <nav className={`nav ${solid ? "nav--solid" : ""} ${dark ? "on-dark" : ""}`}>
        <a href="#top" className="nav__brand">Duluwa Art<small>Watercolours · Kobit Gurung</small></a>
        <div className="nav__links">
          {NAV_LINKS.map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}
          <a href="commission.html" className="nav__cta">Commission</a>
        </div>
        <button className="nav__burger" aria-label="Menu" onClick={() => setMenu(true)}>
          <span></span><span></span>
        </button>
      </nav>

      <div className={`mmenu ${menu ? "open" : ""}`}>
        <button className="mmenu__close" onClick={() => setMenu(false)}>Close ✕</button>
        <div className="col" style={{ gap: ".2rem" }}>
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setMenu(false)}>
              <span className="n">{l.n}</span>{l.label}
            </a>
          ))}
          <a href="commission.html" onClick={() => setMenu(false)}><span className="n">06</span>Commission</a>
        </div>
        <div className="mmenu__foot meta">
          <span>kobit.gurung@studio.np</span><span>Kathmandu · Nepal</span>
        </div>
      </div>
    </React.Fragment>
  );
}

/* ---- Lightbox provider ------------------------------------------------ */
function LightboxProvider({ items, children }) {
  const [idx, setIdx] = useState(-1);
  const open = useCallback((i) => setIdx(i), []);
  const close = useCallback(() => setIdx(-1), []);
  const go = useCallback((d) => setIdx((p) => (p + d + items.length) % items.length), [items.length]);

  useEffect(() => {
    const on = idx >= 0;
    if (on) document.body.setAttribute("data-lightbox-open", "");
    else document.body.removeAttribute("data-lightbox-open");
    const onKey = (e) => {
      if (idx < 0) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, close, go]);

  const cur = idx >= 0 ? items[idx] : null;
  return (
    <LightboxCtx.Provider value={{ open }}>
      {children}
      <div className={`lb ${idx >= 0 ? "open" : ""}`} onClick={(e) => { if (e.target.classList.contains("lb")) close(); }}>
        {cur && (
          <React.Fragment>
            <button className="lb__close" onClick={close}>Close ✕</button>
            <button className="lb__nav lb__nav--prev" onClick={() => go(-1)} aria-label="Previous">‹</button>
            <button className="lb__nav lb__nav--next" onClick={() => go(1)} aria-label="Next">›</button>
            <div className="lb__stage">
              <ArtFrame hue={cur.hue} fill style={{ height: "min(72vh,740px)", width: "100%" }}
                        label={cur.title.toLowerCase()} sub={cur.size} />
              <div className="lb__bar">
                <div>
                  <h3>{cur.title}</h3>
                  <div className="meta" style={{ marginTop: 6 }}>{cur.medium} · {cur.year}</div>
                </div>
                <div className="col" style={{ alignItems: "flex-end", gap: ".4rem" }}>
                  <span className="lb__count">{String(idx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
                  <span className="meta" style={{ maxWidth: 280, textAlign: "right", fontStyle: "italic", fontFamily: "var(--serif)", fontSize: "1rem" }}>{cur.note}</span>
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    </LightboxCtx.Provider>
  );
}

/* ---- Footer ----------------------------------------------------------- */
function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="wrap">
        <Reveal><Eyebrow idx="10">Studio</Eyebrow></Reveal>
        <Reveal delay={1}><h2 className="footer__word">Duluwa<br/>Art</h2></Reveal>
        <div className="footer__grid">
          <div>
            <h5>The Studio</h5>
            <p style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", lineHeight: 1.45, color: "rgba(250,248,243,0.82)" }}>
              Duluwa Art is the studio of Kobit Gurung — a self-taught watercolourist working from a Kathmandu courtyard, painting the people, peaks and wildlife of Nepal.
            </p>
          </div>
          <div>
            <h5>Explore</h5>
            <ul>
              <li><a href="#featured">Featured Works</a></li>
              <li><a href="collections.html">Collections</a></li>
              <li><a href="#story">Artist Story</a></li>
              <li><a href="#exhibition">Virtual Exhibition</a></li>
            </ul>
          </div>
          <div>
            <h5>Connect</h5>
            <ul>
              <li><a href="commission.html">Commission a Work</a></li>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Behance</a></li>
              <li><a href="#">Newsletter</a></li>
            </ul>
          </div>
          <div>
            <h5>Visit</h5>
            <p style={{ color: "rgba(250,248,243,0.78)" }}>
              Studio by appointment<br/>Patan, Lalitpur<br/>Kathmandu Valley, Nepal
            </p>
            <a href="commission.html" className="link-u" style={{ color: "var(--paper)", marginTop: ".4rem" }}>
              kobit.gurung@studio.np <span className="arr">→</span>
            </a>
          </div>
        </div>
        <div className="footer__fine">
          <span>© 2026 Duluwa Art — All works © Kobit Gurung.</span>
          <span>Watercolour on cotton rag · Kathmandu</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Nav, LightboxProvider, Footer, NAV_LINKS });
