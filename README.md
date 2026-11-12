# Shibili Nuhman — Portfolio

Static site. No build step, no dependencies to install.

- `index.html` — the portfolio
- `resume/` — résumé as a web page and `Shibili-Nuhman-Resume.pdf`
- `HIRING-MANAGER-NOTES.md` — what a hiring manager would reject, shortlist, and what is still missing
- `css/`, `js/`, `assets/` — styles, the animation engine, images and fonts

## Put it online (GitHub Pages)

Settings → Pages → Source: **Deploy from a branch** → Branch: **main**, folder **/ (root)** → Save.
It will be live at `https://shibilisbl9-wq.github.io/Shibili-Nuhman-Portfolio/` in about a minute.

## Run locally

```
python3 -m http.server 8000
```

## How it works

Everything sits on a grid of square units (`--u`): 24 columns on desktop, 8 on mobile.
One blue cursor draws the loader, resizes the portrait as you scroll (slow drag, pause, snap to grid),
then draws each cell. `js/main.js` holds the choreography; all positions are in grid units.
Visitors with reduced-motion enabled get the finished layout with no animation.

## Change content

- Text: edit `index.html` directly.
- Project images: `assets/img/*.webp`. Each `<figure class="shot">` sets its size in grid units with
  `--c` (columns) and `--r` (rows); `--rn` is rows on mobile.
- Résumé: edit `resume/index.html`, open it in Chrome, Print → Save as PDF (A4, background graphics on).

## Credits

Fonts are open source (SIL OFL): Inter Tight, Instrument Serif, JetBrains Mono, Bebas Neue, Playfair Display,
Syne, Caveat, Fraunces, Space Grotesk. Animation uses GSAP (free standard licence).
