"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Collection } from "@/types";
import { collectionData as mockCollections } from "@/lib/collection-data";
import "@/app/template.css";



export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const { api } = await import("@/lib/api");
      const response = await api.get("/collections/").catch(() => ({ data: mockCollections }));
      setCollections(response.data.results || response.data || mockCollections);
    } catch (error) {
      console.error("Failed to fetch collections, using mock data:", error);
      setCollections(mockCollections);
    } finally {
      setLoading(false);
    }
  };

  const filteredCollections = selectedCategory === 'all'
    ? collections
    : collections.filter(c => c.category === selectedCategory);

  if (loading) {
    return (
      <div className="galleria">
        <div className="min-h-screen flex items-center justify-center">
          <div className="g-eyebrow">Loading collections...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="galleria">
      {/* HEADER */}
      <header className="g-header">
        <Link href="/" className="g-logo">
          DULUWA-ART
        </Link>

        <nav className="g-nav">
          <Link href="/">Home</Link>
          <Link href="/collections" className="active">Collections</Link>
          <Link href="/commission">Commission</Link>
        </nav>

        <Link href="/commission" className="g-header-cta">
          <span>Commission Art</span>
          <span>&rarr;</span>
        </Link>
      </header>

      {/* HERO */}
      <section className="g-hero">
        <div className="g-hero-copy">
          <div className="g-eyebrow">
            <span>FINE ART COLLECTIONS</span>
            <span>&bull;</span>
            <span>NEPAL</span>
          </div>
          <h1 className="g-hero-title">
            Curated Works<br />of Mountain Soul.
          </h1>
          <div className="g-hero-bottom">
            <p className="g-hero-description">
              Explore our signature watercolor collections capturing Himalayan landscapes, cultural heritage, and wildlife studies.
            </p>
            <Link href="/shop" className="g-round-link">
              <span>Shop</span>
              <span>Art &rarr;</span>
            </Link>
          </div>
        </div>

        <div className="g-hero-image-wrap">
          <img
            src="/art/drawing-08.jpg"
            alt="Himalayan Watercolor Collection"
          />
          <div className="g-image-stamp">
            <i>&#9670;</i>
            <span>DULUWA</span>
          </div>
        </div>

        <div className="g-hero-side-note">
          {collections.length} COLLECTIONS
        </div>
      </section>

      {/* MARQUEE */}
      <div className="g-marquee">
        <div className="g-marquee-track">
          <span>HIMALAYAN COLLECTIONS</span>
          <span>CULTURAL HERITAGE</span>
          <span>WILDLIFE STUDIES</span>
          <span>PORTRAIT SERIES</span>
          <span>PLEIN AIR SKETCHES</span>
          <span>HIMALAYAN COLLECTIONS</span>
          <span>CULTURAL HERITAGE</span>
          <span>WILDLIFE STUDIES</span>
        </div>
      </div>

      {/* SECTION HEADING */}
      <section className="g-section">
        <div className="g-section-label">
          <span>BROWSE COLLECTIONS</span>
          <span>[ {collections.length} TOTAL ]</span>
        </div>

        <div className="g-works-heading">
          <h2 className="g-display">The Collections</h2>
          <p>Explore our curated watercolor series across themes and subjects.</p>
        </div>

        {/* FILTERS */}
        <div className="g-filters">
          {['all', 'himalaya', 'culture', 'portrait', 'wildlife', 'sketches'].map((cat) => (
            <button
              key={cat}
              className={selectedCategory === cat ? 'active' : ''}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      {/* COLLECTIONS GRID */}
      <section className="g-section g-works">
        <div className="g-art-grid">
          {filteredCollections.map((collection, index) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.id}`}
              className="g-art-card"
            >
              <div className="g-art-image">
                <img src={collection.cover} alt={collection.title} />
                <div className="g-art-view">
                  <span>VIEW COLLECTION</span>
                  <b>&rarr;</b>
                </div>
              </div>
              <div className="g-art-meta">
                <div>
                  <h3>{collection.title}</h3>
                  <p>{collection.blurb}</p>
                </div>
                <span>{collection.count} works</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="g-footer">
        <div className="g-footer-top">
          <div>
            <div className="g-footer-logo">
              DULUWA-ART
            </div>
            <p>
              Preserving mountain souls through water & pigment.
            </p>
          </div>
          <a
            href="#"
            className="g-back-top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            BACK TO TOP &uarr;
          </a>
        </div>

        <div className="g-footer-bottom">
          <div>
            <Link href="/">Home</Link>
            <Link href="/collections">Collections</Link>
            <Link href="/commission">Commission</Link>
          </div>
          <span>&copy; {new Date().getFullYear()} DULUWA ART GALLERY. ALL RIGHTS RESERVED.</span>
        </div>
      </footer>
    </div>
  );
}
