'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Artwork {
  id: string;
  title: string;
  category: string;
  year: string;
  medium: string;
  size: string;
  image: string;
  price: string;
  description: string;
}

const artworks: Artwork[] = [
  {
    id: 'a1',
    title: 'Machhapuchhre, First Light',
    category: 'himalaya',
    year: '2024',
    medium: 'Watercolour on cotton rag',
    size: '90 x 60 cm',
    image: '/art/drawing-09.jpg',
    price: 'Rs. 1,800',
    description: 'The iconic fishtail summit emerging from the cold sapphire blue of Himalayan dawn.'
  },
  {
    id: 'a2',
    title: 'Monsoon Valley',
    category: 'himalaya',
    year: '2023',
    medium: 'Watercolour on rag',
    size: '60 x 45 cm',
    image: '/art/drawing-07.jpg',
    price: 'Rs. 1,100',
    description: 'Dense mist and monsoon rain rolling across emerald terrace fields.'
  },
  {
    id: 'a4',
    title: "The Lama's Hands",
    category: 'culture',
    year: '2023',
    medium: 'Watercolour and graphite',
    size: '40 x 50 cm',
    image: '/art/drawing-03.jpg',
    price: 'Rs. 650',
    description: 'A study of stillness, prayer beads, and the quiet dignity of ninety mountain winters.'
  },
  {
    id: 'a7',
    title: 'Woman of Mustang',
    category: 'portrait',
    year: '2023',
    medium: 'Watercolour and graphite',
    size: '42 x 56 cm',
    image: '/art/drawing-02.jpg',
    price: 'Rs. 850',
    description: 'Raw coral, turquoise ornaments and a gaze that has crossed the windswept high plateau.'
  },
  {
    id: 'a10',
    title: 'Bengal Tiger, Bardiya',
    category: 'wildlife',
    year: '2023',
    medium: 'Watercolour on rag',
    size: '70 x 50 cm',
    image: '/art/drawing-10.jpg',
    price: 'Rs. 1,400',
    description: 'Wet-in-wet strokes blending seamlessly into the golden elephant grass.'
  },
  {
    id: 'a16',
    title: 'Boudhanath in Rain',
    category: 'sketches',
    year: '2024',
    medium: 'Watercolour sketch',
    size: '30 x 30 cm',
    image: '/art/drawing-16.jpg',
    price: 'Rs. 380',
    description: 'Fifteen minutes, one squirrel-hair brush, capturing the ancient stupa in heavy rain.'
  }
];

const exhibitions = [
  {
    num: '01',
    tag: 'SOLO / RECENT',
    title: 'Ephemeral Horizons',
    desc: 'Atmospheric watercolor explorations capturing the volatile alpine light across the Annapurna range.',
    date: 'OCT 2024 - POKHARA',
    thumb: '/art/drawing-08.jpg'
  },
  {
    num: '02',
    tag: 'CULTURAL',
    title: 'Living Traditions of Kathmandu',
    desc: 'Ceremonial red pigments, mask dancers, and centuries-old temple squares frozen in pigment washes.',
    date: 'NOV 2024 - PATAN',
    thumb: '/art/drawing-04.jpg'
  },
  {
    num: '03',
    tag: 'WILDLIFE',
    title: 'Wild Nepal: In Held Breath',
    desc: 'Endangered fauna of the Terai river basins and high snow passes rendered with organic fluidity.',
    date: 'DEC 2024 - THAMEL',
    thumb: '/art/drawing-11.jpg'
  },
  {
    num: '04',
    tag: 'SKETCHES',
    title: 'Marketplaces and Alleyways',
    desc: 'Spontaneous plein-air notebook studies from Asan Tole to lakeside alleys.',
    date: 'JAN 2025 - KATHMANDU',
    thumb: '/art/drawing-01.jpg'
  }
];

const artists = [
  {
    id: '1',
    name: 'Kobit Gurung',
    role: 'Principal Watercolorist',
    index: '01',
    count: '24',
    photo: '/art/dancer.jpeg'
  },
  {
    id: '2',
    name: 'Mustang Studio',
    role: 'High Altitude Studies',
    index: '02',
    count: '16',
    photo: '/art/drawing-02.jpg'
  },
  {
    id: '3',
    name: 'Patan Atelier',
    role: 'Heritage and Pigments',
    index: '03',
    count: '19',
    photo: '/art/child-with-bowl.png'
  },
  {
    id: '4',
    name: 'Pokhara Residency',
    role: 'Lakeside and Alpine',
    index: '04',
    count: '12',
    photo: '/art/guinea-pigs.jpeg'
  }
];

export default function GalleriaHome() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeArtwork, setActiveArtwork] = useState<Artwork | null>(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredArtworks = selectedCategory === 'all'
    ? artworks
    : artworks.filter(a => a.category === selectedCategory);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterDone(true);
    }
  };

  return (
    <div className="galleria">
      {/* 1. HEADER */}
      <header className={`g-header ${scrolled ? 'is-scrolled' : ''}`}>
        <Link href="/" className="g-logo">
          DULUWA-ART
        </Link>

        <button
          className={`g-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
          aria-label="Toggle Menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
        </button>

        <nav className={`g-nav ${mobileMenuOpen ? 'is-open' : ''}`}>
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link href="/collections" onClick={() => setMobileMenuOpen(false)}>Collections</Link>
          <Link href="/commission" onClick={() => setMobileMenuOpen(false)}>Commission</Link>
          <Link
            href="/commission"
            className="g-nav-mobile-cta"
            onClick={() => setMobileMenuOpen(false)}
          >
            Commission Art &rarr;
          </Link>
        </nav>

        <Link href="/commission" className="g-header-cta">
          <span>Commission Art</span>
          <span>&rarr;</span>
        </Link>
      </header>

      {/* 2. HERO */}
      <section className="g-hero">
        <div className="g-hero-copy">
          <div className="g-eyebrow">
            <span>FINE ART GALLERY</span>
            <span>&bull;</span>
            <span>NEPAL</span>
          </div>
          <h1 className="g-hero-title">
            Pure Atmosphere &amp; Pigment.
          </h1>
          <div className="g-hero-bottom">
            <p className="g-hero-description">
              Master watercolor works capturing Nepal&apos;s sacred peaks, mountain peoples, and fleeting light washes.
            </p>
            <Link href="/collections" className="g-round-link">
              <span>See</span>
              <span>Works &rarr;</span>
            </Link>
          </div>
        </div>

        <div className="g-hero-image-wrap">
          <img
            src="/art/drawing-09.jpg"
            alt="Machhapuchhre First Light Watercolor"
          />
          <div className="g-image-stamp">
            <i>&#9670;</i>
            <span>DULUWA</span>
          </div>
        </div>

        <div className="g-hero-side-note">
          POKHARA &bull; KATHMANDU
        </div>
      </section>

      {/* 3. MARQUEE */}
      <div className="g-marquee">
        <div className="g-marquee-track">
          <span>ORIGINAL WATERCOLORS</span>
          <span>HIMALAYAN LANDSCAPES</span>
          <span>BESPOKE COMMISSIONS</span>
          <span>CULTURAL HERITAGE</span>
          <span>PLEIN AIR STUDIES</span>
          <span>ORIGINAL WATERCOLORS</span>
          <span>HIMALAYAN LANDSCAPES</span>
          <span>BESPOKE COMMISSIONS</span>
        </div>
      </div>

      {/* 4. ABOUT & STATS */}
      <section className="g-section">
        <div className="g-section-label">
          <span>ABOUT DULUWA-ART</span>
          <span>[ EST. 2020 / NEPAL ]</span>
        </div>

        <div className="g-about-grid">
          <h2 className="g-display">
            Where water, paper and altitude collide.
          </h2>

          <div className="g-about-copy">
            <p className="g-lead">
              Every painting is a dance between precision and surrender. Using pure organic pigments on heavyweight cotton rag, each work captures the untamed spirit of the Himalayas.
            </p>

            <div className="g-stats">
              <div>
                <strong>200<span>+</span></strong>
                <small>ORIGINAL WORKS COMPLETED</small>
              </div>
              <div>
                <strong>18<span>+</span></strong>
                <small>CURATED PIECES IN ARCHIVE</small>
              </div>
              <div>
                <strong>100<span>%</span></strong>
                <small>HANDMADE COTTON RAG</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED MASTERPIECE */}
      <section className="g-featured">
        <div className="g-featured-image">
          <img
            src="/art/dancer.jpeg"
            alt="Himalayan Dancer in Gold Headdress"
          />
          <div className="g-featured-number">
            <span>FEATURED / </span>01
          </div>
        </div>

        <div className="g-featured-info">
          <div className="g-eyebrow">MASTER STUDY</div>
          <h2>Himalayan Dancer</h2>
          <p>
            An intimate portrait of a traditional dancer adorned in ceremonial gold jewelry and crimson textiles. Layered with delicate, transparent watercolor washes.
          </p>
          <div className="g-featured-meta">
            <span>Medium: Transparent Watercolor on 300gsm Rag</span>
            <span>Dimensions: 65 x 90 cm &bull; Year: 2024</span>
          </div>
          <Link href="/commission" className="g-button g-button-dark">
            <span>Commission Similar Piece</span>
            <span>&rarr;</span>
          </Link>
          <div className="g-featured-orbit">&#10022;</div>
        </div>
      </section>

      {/* 6. EXHIBITIONS */}
      <section className="g-section">
        <div className="g-section-heading">
          <h2 className="g-display">Selected Exhibitions</h2>
          <p>Curated solo and collective displays across gallery spaces in Pokhara and Kathmandu.</p>
        </div>

        <div className="g-exhibition-list">
          {exhibitions.map((item) => (
            <div key={item.num} className="g-exhibition-row">
              <span className="g-exhibition-num">{item.num}</span>
              <div className="g-exhibition-thumb">
                <img src={item.thumb} alt={item.title} />
              </div>
              <div className="g-exhibition-main">
                <span className="g-tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
              <span className="g-exhibition-date">{item.date}</span>
              <button
                className="g-arrow-button"
                onClick={() => setTicketModalOpen(true)}
                aria-label="View details"
              >
                &rarr;
              </button>
            </div>
          ))}
        </div>

        <div className="g-all-link">
          <Link href="/collections" className="g-button g-button-dark">
            <span>Explore All Collections</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </section>

      {/* 7. WORKS & FILTERS */}
      <section className="g-section g-works">
        <div className="g-works-heading">
          <h2 className="g-display">Curated Artworks</h2>
          <p>Browse signature pieces across our primary watercolor collections.</p>
        </div>

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

        <div className="g-art-grid">
          {filteredArtworks.map((art) => (
            <div
              key={art.id}
              className="g-art-card"
              onClick={() => setActiveArtwork(art)}
            >
              <div className="g-art-image">
                <img src={art.image} alt={art.title} />
                <div className="g-art-view">
                  <span>VIEW ARTWORK</span>
                  <b>&rarr;</b>
                </div>
              </div>
              <div className="g-art-meta">
                <div>
                  <h3>{art.title}</h3>
                  <p>{art.medium} &bull; {art.size}</p>
                </div>
                <span>{art.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. ARTISTS SECTION */}
      <section className="g-section">
        <div className="g-section-heading">
          <h2 className="g-display">The Artists</h2>
          <p>Dedicated painters and studio artisans bringing Nepal&apos;s culture to life.</p>
        </div>

        <div className="g-artist-grid">
          {artists.map((artist) => (
            <div key={artist.id} className="g-artist-card">
              <div className="g-artist-photo">
                <img src={artist.photo} alt={artist.name} />
                <span className="g-artist-index">{artist.index}</span>
                <div className="g-artist-count">
                  {artist.count}
                  <small>WORKS</small>
                </div>
              </div>
              <div className="g-artist-info">
                <div>
                  <h3>{artist.name}</h3>
                  <span>{artist.role}</span>
                </div>
                <div className="g-artist-arrow">&rarr;</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. VISIT / COMMISSION HERO */}
      <section className="g-visit">
        <div className="g-visit-bg">
          <img src="/art/drawing-08.jpg" alt="Mountain background" />
        </div>
        <div className="g-visit-content">
          <div className="g-eyebrow">BESPOKE STUDIO</div>
          <h2>
            Commission a Custom Piece.
          </h2>
          <p>
            Have a personal Himalayan memory or family heirloom you want captured in original watercolor? Work directly with Kobit Gurung to create a bespoke painting.
          </p>
          <Link href="/commission" className="g-button g-button-light">
            <span>Start a Commission</span>
            <span>&rarr;</span>
          </Link>
        </div>
        <div className="g-visit-vertical">
          LAKESIDE POKHARA &amp; THAMEL
        </div>
      </section>

      {/* 10. NEWSLETTER */}
      <section className="g-section g-newsletter">
        <div className="g-section-label">
          <span>GALLERY DISPATCHES</span>
          <span>[ QUARTERLY CATALOG ]</span>
        </div>
        <div className="g-news-grid">
          <div>
            <h2 className="g-display">Receive new releases first.</h2>
            <p>
              Subscribers get first access to newly completed paintings, studio notes, and exhibition previews.
            </p>
          </div>
          <div>
            {newsletterDone ? (
              <div className="g-success">
                Thank you for subscribing. <span>Welcome to Duluwa-Art.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="g-news-form">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
                <button type="submit" aria-label="Subscribe">
                  &rarr;
                </button>
              </form>
            )}
            <small className="g-privacy">We respect your privacy. Unsubscribe anytime.</small>
          </div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="g-footer">
        <div className="g-footer-top">
          <div>
            <div className="g-footer-logo">
              DULUWA-ART
            </div>
            <p>
              Preserving mountain souls through water &amp; pigment.
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

      {/* 12. ARTWORK MODAL */}
      {activeArtwork && (
        <div className="g-modal-backdrop" onClick={() => setActiveArtwork(null)}>
          <div className="g-art-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="g-modal-close"
              onClick={() => setActiveArtwork(null)}
              aria-label="Close modal"
            >
              &times;
            </button>
            <img src={activeArtwork.image} alt={activeArtwork.title} />
            <div className="g-modal-copy">
              <div className="g-eyebrow">{activeArtwork.category.toUpperCase()}</div>
              <h2>{activeArtwork.title}</h2>
              <p>{activeArtwork.description}</p>
              <div className="g-featured-meta">
                <span><strong>Medium:</strong> {activeArtwork.medium}</span>
                <span><strong>Size:</strong> {activeArtwork.size} ({activeArtwork.year})</span>
                <span><strong>Price:</strong> {activeArtwork.price}</span>
              </div>
              <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                <Link href="/contact" className="g-button g-button-dark">
                  <span>Inquire Now</span>
                  <span>&rarr;</span>
                </Link>
                <Link href="/commission" className="g-button">
                  <span>Custom Order</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 13. TICKET / EXHIBITION MODAL */}
      {ticketModalOpen && (
        <div className="g-modal-backdrop" onClick={() => setTicketModalOpen(false)}>
          <div className="g-ticket-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="g-modal-close"
              onClick={() => setTicketModalOpen(false)}
              aria-label="Close modal"
            >
              &times;
            </button>
            <div className="g-eyebrow">GALLERY ACCESS</div>
            <h2>Visit the Exhibition.</h2>
            <p>
              Our exhibitions are open to collectors, visitors, and art enthusiasts. Admission is complimentary.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px', color: 'var(--muted)', fontSize: '12px' }}>
              <span>&bull; Lakeside 6, Pokhara &amp; Thamel, Kathmandu</span>
              <span>&bull; Daily: 10:00 AM - 7:00 PM</span>
              <span>&bull; Contact: support@duluwa-art.com</span>
            </div>
            <Link
              href="/contact"
              className="g-button g-button-dark"
              onClick={() => setTicketModalOpen(false)}
            >
              <span>RSVP / Inquire</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
