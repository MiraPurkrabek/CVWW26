# CVWW 2025 — Simple Static Website

A minimal, responsive landing page for the Computer Vision Winter Workshop 2025 in Jindřichův Hradec, Czech Republic.

## Structure

- `index.html` — Main page with sections and placeholders
- `assets/css/styles.css` — Styles (dark/light support, responsive)
- `assets/js/main.js` — Small interactivity (mobile nav, smooth scroll)
- `assets/favicon.svg` — The site icon

## Editing content

Open `index.html` and update placeholders:
- Dates in the hero and Important Dates section
- Venue address/map link
- Registration link and fees when ready
- Submission portal link and any format rules (double-blind, page limits, etc.)
- Contact email: replace `cvww2025@organizers.example`

## Run locally

Just open `index.html` in a browser. For best results (and to avoid CORS issues with some features), serve it with a tiny local HTTP server:

```bash
# Option A: Python 3
python3 -m http.server 8000 --directory .

# Option B: Node (if installed)
npx serve -l 8000 .
```

Then visit http://localhost:8000/

## Deploy

Any static hosting will work (GitHub Pages, Netlify, Vercel, Surge, your own server). No build step is required.

## Accessibility & Performance

- Keyboard-accessible nav with a visible focus ring
- High-contrast colors and prefers-color-scheme support
- Lightweight: no frameworks, only one external font (Inter)

---
Feel free to adjust colors and typography in `assets/css/styles.css` under the `:root` variables.