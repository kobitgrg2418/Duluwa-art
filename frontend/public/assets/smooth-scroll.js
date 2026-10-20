/**
 * DULUWA-ART - Lenis Smooth Scrolling & Framer Motion Bridge
 */

(function () {
  function initLenis() {
    if (typeof Lenis === 'undefined') {
      console.warn('Lenis not yet loaded, retrying...');
      setTimeout(initLenis, 100);
      return;
    }

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.5,
      infinite: false,
    });

    window.lenis = lenis;

    // Bridge Lenis with Framer Motion & window scroll listeners
    lenis.on('scroll', (e) => {
      // Trigger native scroll so Framer Motion useScroll and IntersectionObservers stay perfectly in sync
      window.dispatchEvent(new CustomEvent('lenis-scroll', { detail: e }));
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Smooth scroll for internal links
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href.length > 1) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -60, duration: 1.5 });
          }
        }
      }
    });

    console.log('✓ Lenis smooth scrolling initialized for DULUWA-ART');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLenis);
  } else {
    initLenis();
  }
})();
