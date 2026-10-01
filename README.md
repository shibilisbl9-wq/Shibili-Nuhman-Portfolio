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

## Project pages

Each project page (`#p-dulight`, `#p-zee`, …) is a full-bleed cover image, the client / sector / role summary, then a stack of blocks defined in the `CASE` object in `assets/js/main.js`:

| Block | Use it for |
|---|---|
| `text` | A section label and one paragraph (brief, approach) |
| `full` | One wide image |
| `grid` | Images in a row; `scroll:true` turns it into a swipe strip on phones |
| `ba` | Before / after pair (rebrands) |
| `phones` | Stories and Reels in phone frames |
| `palette` | Brand colours with hex codes |
| `split` | Image beside text |
| `post` | An Instagram caption beside text |

**All current project media and the case-study copy are demo placeholders.** The images are AI-generated with Higgsfield (Z Image) and hosted on Higgsfield's CDN (`assets/js/media.js`). Pages with `demo:true` show a "Demo media" tag in the top bar. To swap in real work:

1. Export the real image as `assets/img/projects/<key>.webp` (about 1600px on the long side), using the same key as in `media.js`, for example `dulight-cover.webp`.
2. Delete that key's line from `assets/js/media.js`. The page falls back to the local file automatically.
3. Rewrite the `text` copy for that project in `CASE`, then set `demo:false`.

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
- Project pages use AI demo images and demo copy (see **Project pages** above). Don't publish them as client work.
