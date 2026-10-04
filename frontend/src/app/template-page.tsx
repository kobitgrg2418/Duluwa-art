'use client'

import { useEffect, useState, useRef } from 'react'
import { FlowButton } from '@/components/ui/flow-button'

export default function TemplatePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const [cursor, setCursor] = useState({ x: -100, y: -100 })
  const [loaded, setLoaded] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const TOTAL = 300

  useEffect(() => {
    const move = (event: MouseEvent) => setCursor({ x: event.clientX, y: event.clientY })
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  // Load parallax frames
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    let W = 0, H = 0, dpr = 1
    const imgs: HTMLImageElement[] = new Array(TOTAL)

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = canvas.clientWidth
      H = canvas.clientHeight
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
    }

    function cover(img: HTMLImageElement, alpha: number) {
      const iw = img.naturalWidth, ih = img.naturalHeight
      if (!iw) return
      const s = Math.max(canvas.width / iw, canvas.height / ih)
      const w = iw * s, h = ih * s
      ctx.globalAlpha = alpha
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h)
    }

    async function loadImages() {
      const PATH = (i: number) => `/hero-frames/frame_${String(i).padStart(3, "0")}.jpg`
      
      const load = (i: number): Promise<void> =>
        new Promise((res) => {
          const im = new Image()
          im.decoding = 'async'
          im.src = PATH(i + 1)
          im.onload = im.onerror = () => {
            setLoadProgress((prev) => prev + 1)
            res()
          }
          imgs[i] = im
        })

      resize()
      await load(0)
      
      const rest = [...Array(TOTAL - 1).keys()].map((i) => i + 1)
      const pool = 8
      await Promise.all(
        Array.from({ length: pool }, async () => {
          while (rest.length) await load(rest.shift()!)
        })
      )

      setLoaded(true)
    }

    loadImages()
  }, [TOTAL])

  // Sample artworks - replace with your API data
  const works = [
    { title: 'Himalayan Serenity', meta: 'Watercolor · 2024', image: '/assets/IMG_9965.jpg' },
    { title: 'Mountain Reflection', meta: 'Watercolor · 2023', image: '/assets/auth-brushes.png' },
    { title: 'Cultural Heritage', meta: 'Watercolor · 2024', image: '/assets/IMG_9965.jpg' },
  ]

  return (
    <main className={dark ? 'site dark' : 'site'}>
      {/* Custom cursor */}
      <div className="cursor" style={{ left: cursor.x, top: cursor.y }} />
      
      {/* Loading screen */}
      {!loaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[#f1f0ee]">
          <span className="text-xs uppercase tracking-widest text-gray-600">
            Loading Gallery
          </span>
          <div className="w-60 h-px bg-gray-300">
            <div
              className="h-full bg-black transition-all duration-150"
              style={{ width: `${(loadProgress / TOTAL) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Top bar */}
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Duluwa Art home">DULUWA</a>
        <span className="topbar-mark" aria-hidden="true" />
        <div className="details">
          <span>LOCATION:<b>KATHMANDU, NEPAL</b></span>
          <span>OPEN HOURS:<b>DAILY: 10 AM — 6 PM</b></span>
        </div>
        <button 
          className="menu-button" 
          aria-label={menuOpen ? 'Close menu' : 'Open menu'} 
          aria-expanded={menuOpen}
          aria-controls="menu-overlay"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i /><i />
        </button>
      </header>

      {/* Menu overlay */}
      {menuOpen && (
        <nav id="menu-overlay" className="menu-overlay">
          <button className="menu-close" onClick={() => setMenuOpen(false)}>CLOSE ×</button>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#exhibitions" onClick={() => setMenuOpen(false)}>Exhibitions</a>
          <a href="#gallery" onClick={() => setMenuOpen(false)}>Gallery</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
      )}

      {/* Hero with parallax */}
      <section id="top" className="hero section-frame">
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s' }}
        />
        <div className="absolute inset-0 bg-black/10" />
        <h1 className="text-foreground" style={{ textShadow: '0 2px 20px rgba(255,255,255,0.3)' }}>
          DULUWA ART SHOWCASES<br />
          WATERCOLOR MASTERPIECES<br />
          THAT CAPTURE THE RAW<br />
          BEAUTY OF NEPAL
        </h1>
      </section>

      {/* Exhibitions */}
      <section id="exhibitions" className="exhibitions section-frame">
        <div className="section-heading">
          <h2>GALLERY<br />EXHIBITIONS</h2>
          <FlowButton text="View All" onClick={() => window.location.href = '/gallery'} />
        </div>
        <div className="work-grid">
          {works.map((work, index) => (
            <article className={`work work-${index}`} key={work.title}>
              <img src={work.image} alt={work.title} />
              <div>
                <h3>{work.title}</h3>
                <p>{work.meta}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="about section-frame">
        <div className="about-title">
          <p className="eyebrow">ABOUT DULUWA</p>
          <h2>ART THAT<br />MOVES<br />FORWARD.</h2>
        </div>
        <p className="about-copy">
          Duluwa Art Gallery is a contemporary space built around the artists who capture the essence of Nepal's landscapes, wildlife, and cultural heritage. We showcase breathtaking watercolor masterpieces that stay with you long after you leave.
        </p>
      </section>

      {/* Events */}
      <section id="events" className="events section-frame">
        <p className="eyebrow">UP NEXT</p>
        <div className="event-row">
          <h2>Opening Night<br /><em>Himalayan Dreams</em></h2>
          <div className="event-meta">
            <p>Thursday, November 15<br />6:00 — 9:00 PM</p>
            <FlowButton text="Get Directions" variant="outline" onClick={() => window.location.href = '/contact'} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer section-frame">
        <div className="footer-art">
          <img src="/assets/IMG_9965.jpg" alt="Watercolor artwork in the gallery" />
          <img src="/assets/auth-brushes.png" alt="Abstract artwork in the gallery" />
        </div>
        <nav>
          <a href="#about">About</a>
          <a href="#exhibitions">Exhibitions</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
        </nav>
        <small>2025 © DULUWA ART GALLERY</small>
        <button className="theme-toggle" onClick={() => setDark(!dark)}>
          {dark ? 'LIGHT' : 'DARK'} MODE
        </button>
        <div className="footer-word">DULUWA</div>
      </footer>
    </main>
  )
}
