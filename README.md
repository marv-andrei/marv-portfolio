# Marv Pacinabao portfolio

Full Astro rebuild with shared components, eight project pages, responsive project filtering, accessible showcase tabs, and a printable résumé with PDF download.

## Development

Use Node 24. Run `npm ci`, then `npm run dev`. Preview: http://127.0.0.1:8038/.

- `npm run build`: generate static production files in `dist/`.
- `npm run check`: Astro and TypeScript checks.
- `npm test`: built content and internal-link tests (build first).
- `npm run test:browser`: responsive and interaction tests against the running preview.
- `npm run render:assets`: regenerate the résumé PDF and social preview against the running preview.

## Editing

Project content lives in `src/data/projects.json`; routes in `src/pages/`; shared UI in `src/components/` and `src/layouts/`; styles in `src/styles/site.css`; static assets in `public/`. Canonical origin is configured in `astro.config.mjs`. Netlify builds with Node 24 and publishes `dist/`.

## Content rules

Describe contributions, not unverified outcomes. Vendrato demonstrates GHL-connected funnel support, not proof the entire website was built in GHL. Do not reintroduce representative conversion estimates as results. Zenith, ARTIN and BALZY previews were captured from public pages on 2026-11-05; other project previews are retained portfolio assets.

The recruiter rate remains private. Australian availability leaves the specific time zone to be agreed. Turnaround depends on complexity and a complete brief and access.

## Verification and status

2026-11-05: production build passed (15 pages); Astro check passed with no errors or warnings; three content tests passed; 56 responsive route checks at widths 1440, 768, 390 and 320 passed. Browser checks cover filters, keyboard tabs, case navigation, contact copying, skip link, reduced motion, no-JavaScript fallback, PDF and SEO assets. Résumé PDF is one A4 page and visually reviewed.

Local branch: `codex/portfolio-redesign`. No push or deployment performed.

## Studio direction revision, 2026-11-05

The user rejected the prior cobalt treatment as insufficiently redesigned. Replaced the full visual system with lilac/plum typography-led pages, a real ORIAS feature, asymmetric selected work, dedicated services route and native FAQs, revised about/contact/project layouts and a larger contact close. Removed decorative arrows throughout following explicit feedback and recovered Obsidian design guidance. Design rationale is in `docs/DESIGN.md`; the new palette is a proposed direction, not recorded as user-approved.

Latest verification: 16 built pages, zero Astro errors/warnings (one non-blocking async-style hint in test code), three content tests, 60 responsive checks plus interactions, and four final homepage checks after framing/footer polish. Complete homepage mobile and desktop screenshots reviewed, alongside services/about/contact and a representative project. Other project routes share the verified template; no all-state accessibility certification claimed. Local only, no push or deploy.

## Current revision: interactive neutral portfolio

User rejected lilac/plum. Current design uses off-white, graphite and burnt orange across the site. Homepage includes a five-project keyboard-operated explorer and native screenshot inspector. Contact has a scope selector that prepares an editable email draft, with no automatic submission. Retains no-JavaScript links and no decorative arrows. Latest build, three content tests and 60 responsive route checks pass, including project tabs, modal Escape/focus restoration, and draft-selection behavior. Desktop/mobile homepage, inspector and contact flow visually reviewed. Updated evidence: adjacent `interactive-qa/`. No push or deployment.

## Scroll showcase revision

Removed starburst marks after user feedback about resemblance to Claude. Added native sticky project theatre following the documented Vendrato motion pattern: scroll progress selects five projects and pans screenshots; tabs/range remain available with pause and skip controls. Mobile, short viewports and reduced motion have no sticky spacing. Run `node scripts/verify-scroll.mjs` against the preview for forward/reverse, pause/resume, reduced-motion and fallback checks. Dedicated scroll checks, production build, three content tests and 60 responsive route checks pass. Local only.

## Current showcase: open project reel

The pinned control panel was rejected and is superseded. Current homepage uses an open horizontal reel with native scrolling, mouse drag with projected snap, depth response, keyboard navigation, reduced motion and direct project links. Tabs, range slider, screenshot inspector and sticky-scroll section are removed. `node scripts/verify-reel.mjs` is the current focused interaction check; the earlier scroll/inspector helpers are archived outside the repo. Full-site test has been updated for the reel. Prior entries above document historical iterations.
