/* =========================================================================
   Hero — three directions, switchable via Tweaks
   A: Immersion (full-bleed)   B: Editorial split   C: Museum wall
   ========================================================================= */
const { useState: _hUseState } = React; // (hero uses no state; placeholder)

function ScrollCue({ dark }) {
  return (
    <a href="#featured" className="hero-cue" style={{ color: dark ? "var(--paper)" : "var(--ink)" }}>
      <span className="meta" style={{ color: "inherit", opacity: .7 }}>Scroll</span>
      <span className="hero-cue__line" />
    </a>
  );
}

/* ---- A · Immersion ---------------------------------------------------- */
function HeroImmersion({ hero }) {
  return (
    <header className="hero hero--imm" id="top">
      <ArtFrame hue={hero.hue} fill parallax={14} className="hero--imm__bg"
                label={hero.title.toLowerCase()} sub={hero.size} />
      <div className="hero--imm__scrim" />
      <div className="wrap hero--imm__inner">
        <Reveal className="hero--imm__top"><Eyebrow idx="">Watercolour · Nepal · Est. 2009</Eyebrow></Reveal>
        <div className="hero--imm__btm">
          <Reveal delay={1}>
            <h1 className="display h-xl" style={{ color: "var(--paper)" }}>
              The Himalaya,<br/><em style={{ fontStyle: "italic", fontWeight: 300 }}>in water.</em>
            </h1>
          </Reveal>
          <Reveal delay={2} className="hero--imm__meta">
            <p className="serif-body" style={{ color: "rgba(250,248,243,0.82)", maxWidth: "34ch" }}>
              The watercolours of Kobit Gurung — a self-taught painter of Nepal's people, peaks and wild places.
            </p>
            <a href="#featured" className="btn" style={{ background: "var(--paper)", color: "var(--ink)" }}>
              Enter the gallery <span className="arr">→</span>
            </a>
          </Reveal>
        </div>
      </div>
      <ScrollCue dark />
    </header>
  );
}

/* ---- B · Editorial split --------------------------------------------- */
function HeroEditorial({ hero }) {
  return (
    <header className="hero hero--ed" id="top">
      <div className="wrap hero--ed__grid">
        <div className="hero--ed__copy">
          <Reveal><Eyebrow idx="">Self-taught Watercolourist · Kathmandu</Eyebrow></Reveal>
          <Reveal delay={1}>
            <h1 className="display h-xl">Kobit<br/>Gurung</h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="lede" style={{ maxWidth: "30ch" }}>
              Paintings of Nepal — its faces, its festivals, its impossible mountains — built layer by transparent layer in water.
            </p>
          </Reveal>
          <Reveal delay={3} className="hero--ed__row">
            <a href="#featured" className="btn">View works <span className="arr">→</span></a>
            <a href="#story" className="link-u">The artist <span className="arr">→</span></a>
          </Reveal>
        </div>
        <Reveal clip className="hero--ed__art">
          <ArtFrame hue={hero.hue} ratio={1.34} parallax={6} fill style={{ height: "100%" }}
                    label={hero.title.toLowerCase()} sub={hero.size} />
        </Reveal>
      </div>
      <ScrollCue />
    </header>
  );
}

/* ---- C · Museum wall -------------------------------------------------- */
function HeroMuseum({ hero }) {
  return (
    <header className="hero hero--mus" id="top">
      <div className="wrap hero--mus__inner">
        <Reveal><Eyebrow idx="">Now showing · The Collected Watercolours</Eyebrow></Reveal>
        <Reveal delay={1}>
          <h1 className="display" style={{ fontSize: "clamp(2.4rem,6vw,5.2rem)", textAlign: "center", maxWidth: "16ch", margin: "1.2rem auto 0" }}>
            A self-taught hand, <em style={{ fontStyle: "italic" }}>a country in water</em>
          </h1>
        </Reveal>
        <Reveal delay={2} clip className="hero--mus__art">
          <ArtFrame hue={hero.hue} ratio={0.74} parallax={5} fill style={{ height: "100%" }}
                    label={hero.title.toLowerCase()} sub={hero.size} />
        </Reveal>
        <Reveal delay={3} className="hero--mus__plate">
          <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.15rem" }}>{hero.title}</span>
          <span className="meta">Kobit Gurung · {hero.medium} · {hero.year}</span>
        </Reveal>
      </div>
      <ScrollCue />
    </header>
  );
}

function Hero({ dir = "immersion" }) {
  const A = window.GALLERY.ARTWORKS;
  const hero = A[2]; // Machhapuchhre, First Light
  if (dir === "editorial") return <HeroEditorial hero={hero} />;
  if (dir === "museum") return <HeroMuseum hero={hero} />;
  return <HeroImmersion hero={hero} />;
}

Object.assign(window, { Hero });
