"use client"

import { useState, useEffect } from 'react'
import GenZGlassyFooter from '@/components/genz-footer'
import NorellNavbar from '@/components/norell-navbar'
import NorellHero from '@/components/norell-hero'
import NorellWork from '@/components/norell-work'
import NorellServices from '@/components/norell-services'
import NorellStats from '@/components/norell-stats'

export default function TemplatePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const [cursor, setCursor] = useState({ x: -100, y: -100 })

  useEffect(() => {
    const move = (event: MouseEvent) => setCursor({ x: event.clientX, y: event.clientY })
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <main className={dark ? 'site dark' : 'site'}>
      {/* Custom cursor */}
      <div className="cursor" style={{ left: cursor.x, top: cursor.y }} />

      {/* Norell Navbar */}
      <NorellNavbar />

      {/* Norell Hero */}
      <NorellHero />

      {/* Norell Work Section */}
      <NorellWork />

      {/* Norell Services */}
      <NorellServices />

      {/* Norell Stats */}
      <NorellStats />

      {/* Footer */}
      <GenZGlassyFooter />
    </main>
  )
}
