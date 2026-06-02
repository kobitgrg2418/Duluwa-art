"use client";

import { useState, useRef } from "react";
import { ArtFrame, Reveal, Eyebrow } from "./atoms";

export function VideoShowcase() {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    setPlaying(true);
    videoRef.current?.play();
  };

  return (
    <section className="section video" id="video">
      <div className="wrap">
        <div className="video__head">
          <Reveal><Eyebrow idx="06">In Motion</Eyebrow></Reveal>
          <Reveal delay={1}><h2 className="display h-lg">The studio, at work</h2></Reveal>
        </div>
      </div>
      <Reveal clip className="video__stage-wrap">
        <div className={`video__stage ${playing ? "playing" : ""}`}>
          {!playing ? (
            <>
              <ArtFrame hue={30} fill style={{ height: "100%" }} label="studio film · poster" sub="1920 × 1080" parallax={4}
                        image="/assets/IMG_9195.jpeg" />
              <div className="video__overlay" />
              <button className="video__play" onClick={handlePlay} aria-label="Play film">
                <span className="video__play-ring"><span className="video__play-tri">▶</span></span>
                <span className="meta" style={{ color: "var(--paper)", letterSpacing: ".22em" }}>Watch · 3:48</span>
              </button>
            </>
          ) : (
            <video
              ref={videoRef}
              src="/assets/1733206571917552.mov"
              controls
              autoPlay
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
          {!playing && (
            <div className="video__caption">
              <span className="meta" style={{ color: "rgba(250,248,243,0.7)" }}>From paper to painting</span>
              <span className="meta" style={{ color: "rgba(250,248,243,0.5)" }}>A film by the studio</span>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
