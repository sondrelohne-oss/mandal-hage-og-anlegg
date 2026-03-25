# Oddernes Gartneri — Website Redesign

## Project Overview
Premium website for Oddernes Gartneri, Southern Norway's largest garden center (Hageland chain). Family-owned since 1930, 4th generation. Kristiansand.

**Philosophy: Oddernes is a DESTINATION, not just a shop.**

## Tech Stack
- HTML — Static pages, no framework
- Tailwind CSS v4 — `@theme` tokens, OKLCH colors
- GSAP + ScrollTrigger — Scroll animations
- Lenis — Smooth scroll
- Vanilla JS

## Design References
1. **Petersham Nurseries** — serif typography, deep green, extreme restraint, destination positioning
2. **Ferm Living** — warm off-white (#faf8f5), charcoal text (#383838), room-based navigation
3. **Terrain by Anthropologie** — editorial-first homepage, seasonal stories, lifestyle photography
4. **Aesop** — asymmetrical layouts, integrated education, calm animations
5. **Kinfolk** — dramatic type scale contrast, consistent image ratios, asymmetric spacing

## Anti-AI Rules (NEVER break)
- NO symmetric centered-everything layouts
- NO Inter, Roboto, system fonts — we use Libre Baskerville + DM Sans
- NO uniform card grids — vary sizes, break the grid deliberately
- NO pure white backgrounds — always warm off-white (--color-paper)
- NO pure black text — always charcoal (--color-ink)
- NO rounded-full buttons with gradients
- NO generic "Learn More" CTAs
- NO even color distribution — neutral base, plants ARE the color
- NO stock-photo heroes — editorial lifestyle imagery only

## Typography System
- **Serif (display)**: Libre Baskerville — heritage, editorial trust
- **Sans (body/UI)**: DM Sans — clean, Scandinavian clarity
- **Labels**: DM Sans, 11px, 500 weight, 0.14em tracking, uppercase
- **Scale**: Dramatic contrast — large serif headings (clamp) vs refined body (16-18px)

## Color System
- **Paper**: warm off-white (oklch 0.985) — dominant
- **Ink**: charcoal (oklch 0.22) — NOT black
- **Green-deep**: #314540 Petersham green — nav, footer, accents
- **Green-mid**: muted sage — labels, links
- **Terra**: warm terracotta — sparingly, for warmth

## Layout Principles
- Asymmetric grids (7/5, 4/4/4, 4+7-offset)
- Variable spacing between sections (rhythm through asymmetry)
- Content blocks alternate: hero > editorial text > image grid > quote > journal
- Generous whitespace — Kinfolk-level restraint
- Consistent image aspect ratios per section (4:5 for cards, 4:3 for features)

## Animation Philosophy
- Gentle fade-in reveals (0.8s, translateY 1.5rem)
- Image scale 1.03x on hover (not 1.1 — subtle)
- Parallax only on hero/feature images
- Ghost button line extends on hover
- NO decorative bounce, NO flashy transitions

## File Structure
```
oddernes-gartneri/
├── dist/              # Built output + HTML pages
│   ├── css/style.css
│   ├── index.html
│   └── [other pages].html
├── src/
│   ├── css/main.css   # Tailwind + design tokens
│   ├── js/main.js     # GSAP, Lenis, interactions
│   └── data/content.json
├── CLAUDE.md
└── package.json
```

## Content
All scraped content in `src/data/content.json`. Use as source of truth.

## Build
- `npm run dev` — Tailwind watch
- `npm run build` — Minified CSS
- `npm run serve` — Dev server :3000
