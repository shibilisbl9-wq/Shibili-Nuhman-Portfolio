# Shibili Nuhman — Portfolio

Static portfolio site for Shibili Nuhman, brand & motion designer based in Dubai.
Plain HTML, CSS and JavaScript: no build step and no dependencies.

## Structure

```
index.html               page markup
assets/css/styles.css    all styles (light + dark theme tokens)
assets/js/main.js        slide navigation, headline animation, project shelf, project pages
assets/img/              profile-side.webp (intro cut-out), portrait.jpg (profile card)
.nojekyll                tells GitHub Pages to serve files as-is
```

Project data (names, clients, summaries, cover gradients) lives in the `P` array at the top of `assets/js/main.js`.

## Publish on GitHub Pages

1. Merge this into `main`.
2. Repo **Settings → Pages → Build and deployment**: Source **Deploy from a branch**, Branch **main**, folder **/ (root)**, Save.
3. The site goes live at `https://shibilisbl9-wq.github.io/Shibili-Nuhman-Portfolio/` after a minute or two.

All asset paths are relative, so the site also works as-is on Netlify, Vercel, Cloudflare Pages or any static host.

## Run locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Still placeholder

- Footer links (Instagram, LinkedIn, Behance) point to `#contact`. Replace them with the real profile URLs in `index.html`.
- Project pages show empty image slots ("Hero image", "Old logo", …). Real images need to be added to `renderProject()` in `assets/js/main.js`.
