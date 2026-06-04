"use client";

import Link from "next/link";
import { Reveal, Eyebrow } from "./atoms";

export function AboutSection() {
  return (
    <section className="section about" id="about">
      <div className="wrap about__grid">
        <div className="about__col-img">
          <Reveal clip>
            <div className="about__portrait">
              <img src="/assets/CF57082C-0CAD-4BBE-AA1B-090556A12968.JPG" alt="Kobit Gurung in his studio" />
            </div>
          </Reveal>
          <Reveal delay={2} className="about__img-label meta">
            The studio, Pokhara
          </Reveal>
        </div>

        <div className="about__col-txt">
          <Reveal><Eyebrow idx="06">About Us</Eyebrow></Reveal>
          <Reveal delay={1}>
            <h2 className="display h-md" style={{ marginTop: "1.2rem" }}>
              Duluwa Art Gallery
            </h2>
          </Reveal>
          <Reveal delay={2} className="about__body">
            <p className="serif-body">
              Duluwa Art is the home of Kobit Gurung&apos;s watercolour and sketch practice &mdash; a small gallery rooted in the lake city of Pokhara, Nepal. What began as a single table by a window has grown into six collections and over a hundred original works that travel the world.
            </p>
            <p className="serif-body">
              We believe art should carry the quiet truth of the place it was made. Every piece here begins with handmade paper, clean water, and the light of the Himalayan morning. No prints, no reproductions &mdash; only originals painted in the artist&apos;s own hand.
            </p>

            <div className="about__values">
              <div className="about__value">
                <span className="about__value-icon">&#9676;</span>
                <h4 className="about__value-title">Original Only</h4>
                <p className="meta">Every work is a one-of-one original. No prints, no copies.</p>
              </div>
              <div className="about__value">
                <span className="about__value-icon">&#9675;</span>
                <h4 className="about__value-title">Self-Taught Craft</h4>
                <p className="meta">Two decades of discipline, learned from water and mountain light.</p>
              </div>
              <div className="about__value">
                <span className="about__value-icon">&#9674;</span>
                <h4 className="about__value-title">From Nepal to the World</h4>
                <p className="meta">Collected in nine countries, rooted forever in the Himalaya.</p>
              </div>
            </div>

            <Reveal className="about__quote" as="blockquote">
              <span className="about__mark">&ldquo;</span>
              We don&apos;t sell paintings. We send a piece of Nepal home with you.
            </Reveal>

            <div className="about__cta">
              <Link href="/#story" className="btn">
                Read the artist&apos;s story <span className="arr">&rarr;</span>
              </Link>
              <Link href="/commission" className="link-u" style={{ color: "var(--ink-soft)" }}>
                Commission a work <span className="arr">&rarr;</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
