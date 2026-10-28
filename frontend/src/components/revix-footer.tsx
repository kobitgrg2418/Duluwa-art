"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function RevixFooter() {
  return (
    <footer className="rx-footer">
      <div className="rx-footer-inner">
        {/* Main 4-column footer */}
        <div className="rx-footer-grid">
          <div>
            <div className="rx-footer-brand">
              Duluwa<span className="text-[#ff2a2a]">•</span>Art
            </div>
            <p className="rx-footer-desc">
              A contemporary space showcasing original Himalayan watercolour, fine portraiture,
              and modern expressions. Dedicated to preserving Nepal&apos;s heritage while fostering
              contemporary artistic dialogue.
            </p>
            <div className="mt-8 flex gap-4">
              <Link href="/shop" className="rx-btn rx-btn-white">
                Explore Gallery <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="rx-footer-col">
            <h4>Exhibitions</h4>
            <ul>
              <li><Link href="/shop">Himalayan Landscapes</Link></li>
              <li><Link href="/shop">Portraits of Nepal</Link></li>
              <li><Link href="/shop">Sacred Heritage</Link></li>
              <li><Link href="/collections">Curated Collections</Link></li>
              <li><Link href="/commission">Custom Commissions</Link></li>
            </ul>
          </div>

          <div className="rx-footer-col">
            <h4>Information</h4>
            <ul>
              <li><Link href="/about">About Duluwa Art</Link></li>
              <li><Link href="/about#story">The Artist&apos;s Journey</Link></li>
              <li><Link href="/contact">Visit the Gallery</Link></li>
              <li><Link href="/contact#faq">Frequently Asked Questions</Link></li>
              <li><Link href="/contact">Inquiries &amp; Press</Link></li>
            </ul>
          </div>

          <div className="rx-footer-col">
            <h4>Location &amp; Hours</h4>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Thamel Marg, Kathmandu 44600, Nepal<br />
              Open Daily: 10:00 AM – 7:00 PM NPT
            </p>
            <p className="text-white/70 text-sm mb-4">
              Phone: +977 1 4700000<br />
              Email: info@duluwaart.com
            </p>
            <div className="flex gap-4 text-xs tracking-wider uppercase text-white/50 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
              <span>/</span>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>
              <span>/</span>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>
            </div>
          </div>
        </div>

        {/* Footer Bottom copyright */}
        <div className="rx-footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} Duluwa Art Gallery. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="/contact" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
