# Premium Website Development Process

> Systematisert arbeidsflyt for å bygge nettsider av agency-kvalitet med Claude Code.
> Utviklet mars 2026. Oppdateres løpende.

---

## Oversikt

```
RESEARCH → DESIGN SYSTEM → SKILLS → BUILD → DEBUG → SUBPAGES → POLISH
  (1)         (2)           (3)     (4)     (5)      (6)        (7)
```

---

## Fase 1: Research (ALDRI hopp over)

**Regel:** Den eksisterende siden er kilde for innhold, IKKE for design.

### 1.1 Scrape eksisterende innhold
```
Agent → WebFetch alle sider → lagre i src/data/content.json
```
Hent: all tekst, bilder-URLer, kontaktinfo, åpningstider, team, tjenester.

### 1.2 Research premium referanser
```
Agent → Søk Awwwards, SiteInspire, bransjespesifikke premium-sider
```
Identifiser 3-5 referanser med spesifikke teknikker:
- Typografi-valg og skala-kontrast
- Fargepalett og dominansforhold
- Layout-mønstre (asymmetrisk, editorial, split)
- Animasjon-filosofi (rolig vs. dramatisk)
- Navigasjon-arkitektur

### 1.3 Definer design-retning
Én setning som oppsummerer: *"[Referanse A] estetikk møter [Referanse B] innholdsstrategi"*

---

## Fase 2: Design System

Sett opp ALT dette FØR noen HTML skrives:

### 2.1 Typografi
- **2 fonter** med distinkte roller (serif display + sans body)
- ALDRI: Inter, Roboto, Arial, Open Sans, system defaults
- Dramatisk skala-kontrast: store overskrifter (clamp) vs. raffinert brødtekst (16-18px)
- Labels: sans, 11px, 500 weight, 0.14em tracking, uppercase

### 2.2 Farger (OKLCH)
```css
--color-ink: oklch(0.22 ...);        /* charcoal — ALDRI pure black */
--color-paper: oklch(0.985 ...);     /* warm off-white — ALDRI pure white */
--color-primary: oklch(0.30 ...);    /* 1 sterk primærfarge */
--color-accent: oklch(0.55 ...);     /* 1 muted aksent */
```
Nøytral-dominant. Innholdet (bilder, planter, produkter) ER fargen.

### 2.3 Spacing
- Seksjoner: minimum `py-28 lg:py-40` (7rem / 10rem)
- ALDRI under `py-20` mellom visuelt tunge seksjoner
- Variér rytme mellom seksjoner — ikke identisk padding overalt

### 2.4 Easing og animasjon
```css
--ease-expo: cubic-bezier(0.16, 1, 0.3, 1);
```
- Reveals: `translateY(16px)` + `opacity`, 0.65s, `power2.out`
- Image hover: `scale(1.03)` — subtilt, aldri 1.1
- ALDRI bounce/elastic easing

### 2.5 Tailwind v4 oppsett
```
npm init -y
npm install -D tailwindcss @tailwindcss/cli
```
CSS med `@theme { }` for alle tokens. Build: `npx @tailwindcss/cli -i src/css/main.css -o dist/css/style.css`

---

## Fase 3: Invokér Design Skills

**Kjør `/frontend-design` med full kontekst FØR koding starter.**

Gi skillen:
- Målgruppe og merke-personlighet
- Referanse-sider og ønsket stil
- Tekniske krav (framework, enheter)
- Hva som gjør denne siden UFORGLEMMELIG

### Nyttige skills å ha installert:
```
npx skills add pbakaus/impeccable --yes
```
Gir: `/polish`, `/audit`, `/typeset`, `/overdrive`, `/animate`, `/bolder`, `/critique`

---

## Fase 4: Build (Progressive Enhancement)

### KRITISK REGEL: Alt synlig uten JavaScript

```
CSS = baseline (alt synlig)
JS  = enhancement (animerer FRA skjult TIL synlig)
```

**Feil:**
```css
.line-reveal span { transform: translateY(110%); }  /* USYNLIG uten JS */
[data-img-reveal] { clip-path: inset(100% 0 0 0); } /* SKJULT uten JS */
```

**Riktig:**
```css
.line-reveal span { display: block; }  /* synlig default */
[data-img-reveal].unrevealed { clip-path: inset(100% 0 0 0); }  /* JS legger til klasse */
```

```js
// JS setter skjult-state, ScrollTrigger avslører
el.classList.add('unrevealed');
ScrollTrigger.create({
  trigger: el,
  onEnter: () => el.classList.remove('unrevealed'),
});
```

### Loader
- Bare på forsiden
- Animert tekst + progress bar
- `onComplete: initPage` — resten av siden initialiseres FØR loader er borte
- Fallback: `if (!loader) { initPage(); return; }`

### Navbar-mønster
CSS-variabler som flippes:
```css
[data-nav] {
  --nav-color: oklch(1 0 0 / 0.6);           /* hvit over hero */
  background: linear-gradient(to bottom, oklch(0.12 0.03 160 / 0.75), transparent);
}
[data-nav].is-scrolled {
  --nav-color: var(--color-ink-light);         /* mørk etter scroll */
  background: oklch(0.985 0.006 85 / 0.95);
  backdrop-filter: blur(20px);
}
```
- Alle nav-elementer bruker `color: var(--nav-color)`
- Undersider: `<nav data-nav class="is-scrolled">` direkte

### Typografi-felle: nedstikkere
```css
.line-reveal {
  overflow: hidden;
  padding-bottom: 0.15em;   /* plass til g, j, p, y */
  margin-bottom: -0.15em;   /* kompenserer layout */
}
```

### Horisontal karusell
ALDRI scroll-pinning. Bruk drag + piler:
```js
// Pointer drag + arrow buttons
track.addEventListener('pointerdown', startDrag);
track.addEventListener('pointermove', onDrag);
prevBtn.addEventListener('click', () => setPosition(pos - cardWidth));
nextBtn.addEventListener('click', () => setPosition(pos + cardWidth));
```

---

## Fase 5: Visuell Debugging

### Installer Puppeteer fra start
```
npm install -D puppeteer
```

### Screenshot-script
```js
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('file:///path/to/dist/index.html', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 4000)); // vent på animasjoner

  for (let i = 0; i < 9; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), i * 900);
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: `ss-${i}.png` });
  }
  await browser.close();
})();
```

Bruk Read-tool på png-filene for å se resultatet direkte.

---

## Fase 6: Parallelle Undersider

Bygg 8 sider med 4 agenter parallelt. Gi HVER agent:

1. **Eksakt `<head>`-blokk** med fonts, CSS, scripts
2. **Eksakt nav HTML** (med `is-scrolled` for undersider)
3. **Eksakt footer HTML**
4. **Design-system regler**: klasser, spacing, animasjons-attributter
5. **Spesifikt innhold** og sidestruktur
6. **Alle tilgjengelige bilde-URLer**

---

## Fase 7: Polish

- Verifiser alle sider med Puppeteer-screenshots
- Sjekk bildeinnhold — undersider trenger flere bilder enn man tror
- Kjør `/polish` og `/audit` skills
- Test responsivitet (viewport 375px, 768px, 1440px)
- Sjekk at alle lenker mellom sider fungerer

---

## Anti-AI Sjekkliste

Før levering — gå gjennom:

- [ ] Ingen symmetrisk sentrert layout overalt
- [ ] Ingen uniform card-grid (variér størrelse og aspekt)
- [ ] Ingen pure black/white
- [ ] Ingen generiske "Les mer" CTA-er
- [ ] Ingen rounded-full knapper med gradienter
- [ ] Ingen identisk spacing mellom alle seksjoner
- [ ] Innhold synlig uten JavaScript
- [ ] Nedstikkere (g, j, p, y) ikke klippet
- [ ] Navbar leselig over alle bakgrunner
- [ ] Bilder på alle undersider — ikke bare tekst

---

## Teknisk Stack (anbefalt)

```
HTML + Tailwind CSS v4 + GSAP + Lenis + Vanilla JS
```

- Ingen tung framework (React/Next) med mindre nødvendig
- Tailwind v4 med `@theme` design tokens
- GSAP + ScrollTrigger via CDN
- Lenis for smooth scroll via CDN
- Puppeteer for debugging
- Live-server for utvikling
