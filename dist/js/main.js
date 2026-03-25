// ============================================
// Oddernes Gartneri — Orchestrated Experience
// ============================================

gsap.registerPlugin(ScrollTrigger);

// ====== LENIS ======
const lenis = new Lenis({
  duration: 1.1,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// ====== PAGE LOADER ======
function initLoader() {
  const loader = document.querySelector('.loader');
  if (!loader) { initPage(); return; }

  const barFill = loader.querySelector('.loader__bar-fill');
  const textSpans = loader.querySelectorAll('.loader__text span');

  const tl = gsap.timeline({ onComplete: initPage });

  tl.fromTo(textSpans, { yPercent: 110 }, {
    yPercent: 0, duration: 0.6, stagger: 0.03, ease: 'power3.out'
  })
  .to(barFill, { scaleX: 1, duration: 1, ease: 'power2.inOut' }, 0.15)
  .to(loader, { yPercent: -100, duration: 0.8, ease: 'power4.inOut' }, '+=0.15')
  .set(loader, { display: 'none' });
}

// ====== HERO ENTRANCE ======
function initHeroEntrance() {
  const lines = document.querySelectorAll('.hero .line-reveal span');
  const sub = document.querySelector('.hero__sub');
  const ctas = document.querySelectorAll('.hero__cta');
  const media = document.querySelector('.hero__media img');

  const tl = gsap.timeline({ delay: 0.05 });

  if (media) {
    tl.fromTo(media, { scale: 1.15 }, { scale: 1, duration: 1.4, ease: 'power2.out' }, 0);
  }

  if (lines.length) {
    tl.fromTo(lines, { yPercent: 110 }, {
      yPercent: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out'
    }, 0.15);
  }

  if (sub) {
    tl.fromTo(sub, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.6);
  }

  if (ctas.length) {
    tl.fromTo(ctas, { opacity: 0, y: 8 }, {
      opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out'
    }, 0.75);
  }
}

// ====== PARALLAX ======
function initParallax() {
  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax) || 0.15;
    gsap.to(el, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('section') || el.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.4,
      },
    });
  });
}

// ====== IMAGE REVEALS ======
function initImageReveals() {
  document.querySelectorAll('[data-img-reveal]').forEach((el) => {
    // Set initial hidden state via JS, not CSS
    el.classList.add('unrevealed');

    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => el.classList.remove('unrevealed'),
    });
  });
}

// ====== SPLIT TEXT REVEALS ======
function initTextReveals() {
  // Skip hero — that's handled by initHeroEntrance
  document.querySelectorAll('[data-text-reveal]:not(.hero__title)').forEach((el) => {
    const spans = el.querySelectorAll('.line-reveal span');
    if (!spans.length) return;

    // Hide via JS
    gsap.set(spans, { yPercent: 100 });

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(spans, {
          yPercent: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out'
        });
      },
    });
  });
}

// ====== FADE-IN REVEALS ======
function initFadeReveals() {
  document.querySelectorAll('[data-fade]').forEach((el) => {
    const delay = parseFloat(el.dataset.fade) || 0;
    gsap.fromTo(el,
      { opacity: 0, y: 16 },
      {
        opacity: 1, y: 0, duration: 0.65, delay,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      }
    );
  });
}

// ====== DRAGGABLE CAROUSEL WITH ARROWS ======
function initHorizontalScroll() {
  document.querySelectorAll('.hscroll-section').forEach((section) => {
    const track = section.querySelector('.hscroll-track');
    const prevBtn = section.querySelector('[data-prev]');
    const nextBtn = section.querySelector('[data-next]');
    if (!track) return;

    let pos = 0;
    let startX = 0;
    let isDragging = false;
    let startPos = 0;

    const getMax = () => Math.max(0, track.scrollWidth - section.offsetWidth + 40);

    function setPosition(x, animate = true) {
      pos = Math.max(0, Math.min(x, getMax()));
      if (animate) {
        gsap.to(track, { x: -pos, duration: 0.6, ease: 'power3.out' });
      } else {
        gsap.set(track, { x: -pos });
      }
    }

    // Drag
    track.addEventListener('pointerdown', (e) => {
      if (e.target.closest('a')) e.preventDefault();
      isDragging = true;
      startX = e.clientX;
      startPos = pos;
      track.style.cursor = 'grabbing';
      track.setPointerCapture(e.pointerId);
    });

    track.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = startX - e.clientX;
      setPosition(startPos + dx, false);
    });

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      track.style.cursor = '';
      // Snap to nearest card
      setPosition(pos, true);
    };

    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);

    // Prevent link clicks after drag
    track.addEventListener('click', (e) => {
      if (Math.abs(pos - startPos) > 10) e.preventDefault();
    }, true);

    // Arrow buttons
    const cardWidth = () => {
      const card = track.querySelector('.hscroll-card');
      return card ? card.offsetWidth + 20 : 400;
    };

    if (prevBtn) prevBtn.addEventListener('click', () => setPosition(pos - cardWidth()));
    if (nextBtn) nextBtn.addEventListener('click', () => setPosition(pos + cardWidth()));

    // Set grab cursor
    track.style.cursor = 'grab';
  });
}

// ====== MARQUEE ======
function initMarquee() {
  document.querySelectorAll('[data-marquee]').forEach((el) => {
    const inner = el.querySelector('[data-marquee-inner]');
    if (!inner) return;
    inner.innerHTML += inner.innerHTML;
    gsap.to(inner, { xPercent: -50, ease: 'none', duration: 30, repeat: -1 });
  });
}

// ====== MAGNETIC BUTTONS ======
function initMagnetic() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('[data-magnetic]').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.35, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' });
    });
  });
}

// ====== NAVBAR (always visible, bg on scroll) ======
function initNav() {
  const nav = document.querySelector('[data-nav]');
  if (!nav) return;

  ScrollTrigger.create({
    onUpdate: (self) => {
      nav.classList.toggle('is-scrolled', self.scroll() > 80);
    }
  });
}

// ====== MOBILE MENU ======
function initMobileMenu() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
    open ? lenis.stop() : lenis.start();
  });
}

// ====== STAGGER GRIDS ======
function initStaggerGrids() {
  document.querySelectorAll('[data-stagger]').forEach((grid) => {
    gsap.from(grid.children, {
      y: 30, opacity: 0, duration: 0.6,
      ease: 'power3.out', stagger: 0.08,
      scrollTrigger: { trigger: grid, start: 'top 85%', once: true },
    });
  });
}

// ====== INIT ======
function initPage() {
  initHeroEntrance();
  initParallax();
  initImageReveals();
  initTextReveals();
  initFadeReveals();
  initHorizontalScroll();
  initMarquee();
  initMagnetic();
  initNav();
  initMobileMenu();
  initStaggerGrids();
}

document.addEventListener('DOMContentLoaded', initLoader);
