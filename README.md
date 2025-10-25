# CVWW 2026 Website — Developer Guide

Internal handbook for maintaining the static landing page for the Computer Vision Winter Workshop 2026 (Jindřichův Hradec, Czech Republic).

## Project snapshot

- **Stack:** Plain HTML/CSS/JS (no build tooling). Fonts are loaded from Google Fonts.
- **Entry point:** `index.html` renders all content; there are no additional pages yet.
- **Status:** Content placeholders for registration, submissions, program, and committee are still missing. Navigation is ready for future sections.
- **Intended hosting:** Any static host (GitHub Pages/Netlify/Vercel) – no build step required.

## Directory layout

- `index.html` — Single-page layout with sections for About, Dates, Venue, Registration, Call for Papers, and Contact.
- `assets/css/styles.css` — Global styling, design tokens (dark/light via `:root`), responsive breakpoints, navigation/component styling.
- `assets/js/main.js` — Minor interactions: mobile nav toggle, smooth scrolling with sticky-header offset, back-to-top visibility, and forced copyright year.
- `assets/imgs/` — Hero photograph (`jindrichuv-hradec-photo.jpg`). Replace here if you swap imagery.
- `assets/logos/` — Organizer logos and the snowflake icon used for the favicon & brand mark.

## How to work on content

All copy lives directly in `index.html`. When editing:

1. **Hero block:** Update workshop year, dates (`February 9 – 11, 2026` placeholder), and CTA destinations once registration/submission links exist.
2. **About section:** Review the partnerships paragraph before publishing (currently highlights VRG & CIIRC).
3. **Important Dates:** Replace `TBA` rows with concrete deadlines as soon as they are confirmed.
4. **Venue:** Confirm hotel name, address, and map links; lodging info is stated as part of registration.
5. **Registration & CFP:** Buttons are disabled via `aria-disabled="true"`. Swap the `href` and remove the attribute once live.
6. **Contact:** Email still points to `chum@fel.cvut.cz`; replace with the official organizing committee inbox once available.
7. **Program:** HTML scaffold is commented out (`<!-- program -->`). Uncomment when the schedule page (possibly gated) is ready.

## Styling guidelines

- Color palette, typography, shadows, and spacing tokens are defined near the top of `styles.css`. Adjusting `:root` variables propagates throughout the design.
- Navigation becomes a slide-down menu under 860px width; keep link text concise for mobile.
- Organizer logos are sized by height only. Supply transparent backgrounds where possible to keep the bar clean.

## JavaScript behaviours

- Mobile navigation toggles the `.open` class on the `<nav>` element and auto-closes when a link is selected.
- Smooth scrolling adjusts offsets for the sticky header and updates the URL hash manually.
- The back-to-top button appears after ~320px of scroll; `main.js` also forces the footer year to `2026`—adjust once the site rolls over to 2027+.

## Local preview

Open `index.html` directly or serve the folder for cleaner URL handling:

```bash
python3 -m http.server 8000 --directory .
```

Visit <http://localhost:8000/>. No additional dependencies are required.

## Deploying

Push the contents to any static host. Remember to:

- Set the canonical URL in the `<meta property="og:url">` tag.
- Upload the same assets to the hosting provider (no build artifacts are generated).
- Configure custom domain/HTTPS if using GitHub Pages.

## Launch checklist

- [ ] Verify all dates, pricing, and venue logistics with the organizing team.
- [ ] Confirm CTA buttons point to live forms (registration & submission).
- [ ] Provide the final contact email and update mailto links.
- [ ] Test navigation and smooth-scroll behaviour on iOS/Android (especially after adding more sections).
- [ ] Re-run accessibility checks (tab order, contrast) after any design tweak.

## TODOs for the next iteration

- [ ] Replace placeholder contact address with the official organizing committee email (see comment replacing `chum@fel.cvut.cz`).
- [ ] Add a dedicated page or section that lists the organizing and program committees (link from navigation).
- [ ] Publish submission instructions: format guidelines, template download, and submission portal URL.
- [ ] Publish registration instructions: pricing tiers, deadlines, payment method, and policy notes.
- [ ] Implement the detailed program view guarded by a password (restore the Program nav link / section once ready).
- [ ] Re-enable favicon/meta references if the snowflake icon changes (currently `assets/logos/cvww25-snowflake.svg`).
- [ ] Update Open Graph URL and ensure social previews have correct summary text and image.
- [ ] Automate year handling in `main.js` instead of hard-coding `2026` once the event concludes.

Feel free to add issues/PRs for anything that needs discussion.