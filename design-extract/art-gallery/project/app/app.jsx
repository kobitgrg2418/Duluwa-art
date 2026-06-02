/* =========================================================================
   App root — composes the single-page experience + Tweaks
   ========================================================================= */
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroDir": "immersion",
  "palette": "verdant",
  "gold": "whisper",
  "captions": "on"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useParallaxEngine();
  useRevealEngine();

  useEffect(() => {
    const r = document.documentElement;
    r.setAttribute("data-palette", t.palette);
    r.setAttribute("data-gold", t.gold);
    r.setAttribute("data-captions", t.captions);
  }, [t.palette, t.gold, t.captions]);

  const onDark = t.heroDir === "immersion";

  return (
    <LightboxProvider items={window.GALLERY.ARTWORKS}>
      <Nav onDark={onDark} />
      <main>
        <Hero dir={t.heroDir} />
        <Featured />
        <CollectionsPreview />
        <ArtistStory />
        <Exhibition />
        <Process />
        <VideoShowcase />
        <Testimonials />
        <Commission />
      </main>
      <Footer />

      <TweaksPanel>
        <TweakSection label="Hero direction" />
        <TweakRadio label="Layout" value={t.heroDir}
          options={[{value:"immersion",label:"Immersion"},{value:"editorial",label:"Editorial"},{value:"museum",label:"Museum"}]}
          onChange={(v) => setTweak("heroDir", v)} />
        <TweakSection label="Palette" />
        <TweakRadio label="Mood" value={t.palette}
          options={[{value:"verdant",label:"Verdant"},{value:"plum",label:"Plum"},{value:"indigo",label:"Indigo"}]}
          onChange={(v) => setTweak("palette", v)} />
        <TweakSection label="Accent & detail" />
        <TweakRadio label="Gold accent" value={t.gold}
          options={[{value:"whisper",label:"Whisper"},{value:"bold",label:"Pronounced"}]}
          onChange={(v) => setTweak("gold", v)} />
        <TweakRadio label="Placeholder labels" value={t.captions}
          options={[{value:"on",label:"Show"},{value:"off",label:"Hide"}]}
          onChange={(v) => setTweak("captions", v)} />
      </TweaksPanel>
    </LightboxProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
