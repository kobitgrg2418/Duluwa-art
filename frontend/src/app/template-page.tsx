'use client'

import { useEffect, useState, useRef } from 'react'
import { FlowButton } from '@/components/ui/flow-button'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react'
import GenZGlassyFooter from '@/components/genz-footer'

export default function TemplatePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const [cursor, setCursor] = useState({ x: -100, y: -100 })
  const [loaded, setLoaded] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const TOTAL = 300

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

    const ctx2d = ctx
    const canvasEl = canvas
    let W = 0, H = 0, dpr = 1
    const imgs: HTMLImageElement[] = new Array(TOTAL)

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = canvasEl.clientWidth
      H = canvasEl.clientHeight
      canvasEl.width = Math.round(W * dpr)
      canvasEl.height = Math.round(H * dpr)
    }

    function cover(img: HTMLImageElement, alpha: number) {
      const iw = img.naturalWidth, ih = img.naturalHeight
      if (!iw) return
      const s = Math.max(canvasEl.width / iw, canvasEl.height / ih)
      const w = iw * s, h = ih * s
      ctx2d.globalAlpha = alpha
      ctx2d.drawImage(img, (canvasEl.width - w) / 2, (canvasEl.height - h) / 2, w, h)
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
      
      const rest = Array.from({ length: TOTAL - 1 }, (_, i) => i + 1)
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
        <a className="wordmark" href="#top" aria-label="Duluwa Art home">DULUWA-ART</a>
        <div className="details" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Link 
            href="/gallery"
            style={{ 
              fontSize: '13px', 
              fontWeight: 700, 
              letterSpacing: '.2px',
              color: pathname === '/gallery' ? 'var(--ink)' : 'var(--muted)',
              textDecoration: 'none'
            }}
          >
            GALLERY
          </Link>
          <Link 
            href="/collections"
            style={{ 
              fontSize: '13px', 
              fontWeight: 700, 
              letterSpacing: '.2px',
              color: pathname === '/collections' ? 'var(--ink)' : 'var(--muted)',
              textDecoration: 'none'
            }}
          >
            COLLECTIONS
          </Link>
          <Link 
            href="/commission"
            style={{ 
              fontSize: '13px', 
              fontWeight: 700, 
              letterSpacing: '.2px',
              color: pathname === '/commission' ? 'var(--ink)' : 'var(--muted)',
              textDecoration: 'none'
            }}
          >
            COMMISSION
          </Link>
          <Link 
            href="/cart"
            style={{ 
              color: pathname === '/cart' ? 'var(--ink)' : 'var(--muted)',
              textDecoration: 'none'
            }}
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </Link>
          <div ref={userMenuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--muted)',
                cursor: 'pointer',
                padding: 0
              }}
              aria-label="User menu"
            >
              <User className="w-5 h-5" />
            </button>
            {userMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: 'var(--paper)',
                  border: '1px solid var(--line)',
                  padding: '8px 0',
                  minWidth: '160px',
                  zIndex: 100
                }}
              >
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'block',
                        padding: '10px 16px',
                        fontSize: '13px',
                        fontWeight: 700,
                        letterSpacing: '.2px',
                        color: pathname === '/profile' ? 'var(--ink)' : 'var(--muted)',
                        textDecoration: 'none'
                      }}
                    >
                      Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: 'block',
                          padding: '8px 16px',
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '.2px',
                          color: pathname === '/admin' ? 'var(--ink)' : 'var(--muted)',
                          textDecoration: 'none'
                        }}
                      >
                      Admin
                    </Link>
                    )}
                    <button
                      onClick={() => {
                        logout()
                        setUserMenuOpen(false)
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '10px 16px',
                        fontSize: '13px',
                        fontWeight: 700,
                        letterSpacing: '.2px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--muted)',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'block',
                        padding: '10px 16px',
                        fontSize: '13px',
                        fontWeight: 700,
                        letterSpacing: '.2px',
                        color: pathname === '/login' ? 'var(--ink)' : 'var(--muted)',
                        textDecoration: 'none'
                      }}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'block',
                        padding: '10px 16px',
                        fontSize: '13px',
                        fontWeight: 700,
                        letterSpacing: '.2px',
                        color: pathname === '/register' ? 'var(--ink)' : 'var(--muted)',
                        textDecoration: 'none'
                      }}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
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
          <Link href="/gallery" onClick={() => setMenuOpen(false)}>Gallery</Link>
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
          DULUWA-ART<br />
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
      <GenZGlassyFooter />
    </main>
  )
}
