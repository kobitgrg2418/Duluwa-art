"use client"

import { useState, useEffect } from 'react'
import GenZGlassyFooter from '@/components/genz-footer'
import DuluwaNavbar from '@/components/duluwa-navbar'
import DuluwaHero from '@/components/duluwa-hero'
import DuluwaWork from '@/components/duluwa-work'
import DuluwaServices from '@/components/duluwa-services'
import DuluwaStats from '@/components/duluwa-stats'

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

      {/* Duluwa Navbar */}
      <DuluwaNavbar />

      {/* Duluwa Hero */}
      <DuluwaHero />

      {/* Duluwa Work Section */}
      <DuluwaWork />

      {/* Duluwa Services */}
      <DuluwaServices />

      {/* Duluwa Stats */}
      <DuluwaStats />

      {/* Footer */}
      <GenZGlassyFooter />
    </main>
  )
}
