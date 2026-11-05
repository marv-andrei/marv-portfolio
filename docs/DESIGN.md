# Portfolio creative direction, 2026-11-05

The previous cobalt portfolio did not satisfy the requested whole-site redesign. This revision replaces its visual system and homepage composition rather than simply refreshing a template.

Audience: brands and agencies looking for a hands-on page builder. Lead with real work, clear contribution, and the person behind it.

Palette: lilac paper #f1edf7, aubergine ink #30223e, muted violet #74687e, lavender #d9c7ed, coral #ffb7a1, white #ffffff. Accent colors organize sections and project framing rather than implying results.

Typography: Schibsted Grotesk variable, self-hosted. Large tightly set display type, comfortable body text, small untracked navigation. No decorative all-caps labels.

Layout: broad typographic opener and asymmetric work wall, followed by a full-width featured project, paired supporting work, a plum service section and personal introduction. Inner routes each get a purpose-specific arrangement. Project images are the visual evidence; do not use generic stock art or fabricated metrics.

Motion: brief introductory text entrance, project hover image movement and native disclosure responses; respect reduced motion. Native navigation and content work without JavaScript.

Entire public site stays local until explicit deployment authorization.

## Recovered user guidance
Read Obsidian Frontend Design Skill and Vendrato Website design history, plus the verified local Vendrato docs/design/website-experience.md. Generic bundled skill omitted known user preferences. User now explicitly rejects arrows throughout this site. No decorative directional glyphs, no tilted collage or busy montage, no fabricated metrics. Use actual work as the experience, meaningful interaction and varied content structure; review complete mobile scrolls. The custom 63-site skill is documented on another Mac, not locally installed. Do not claim to have loaded it.

## Interactive neutral revision
User rejected lilac/plum on 2026-11-05 and requested modern, interactive design. Superseding palette: off-white #f7f7f5, graphite #202221, neutral grey #e8ebe7, muted text #666b68 and burnt orange #bf401f. All routes share the new palette. Removed pastel project framing and decorative arch shapes.

Added five-project keyboard-operable explorer with a native image-inspection dialog, Escape close and focus restoration; no autoplay or scroll capture. Added contact scope selection that prepares an editable mailto draft without transmitting anything. Keep native project links and contact methods available without JavaScript, reduced motion, and no decorative arrows. Updated social preview and résumé PDF.

## Scroll showcase and mark removal
User identified the orange starburst as resembling Claude's logo. Removed the mark from header, footer and contact close. Wordmark is now plain typography.

Read Obsidian's Vendrato Website scroll-choreography/experiential entries and the verified local `src/scripts/studio-experience.ts` in the Nov 3 Vendrato checkout. Adapted its natural-scroll theatre pattern using native sticky positioning and requestAnimationFrame rather than adding the original GSAP dependency. At desktop widths >=1000 and heights >=760, the stage remains visible as scrolling advances five real projects and pans the current screenshot within its bounds. Tabs and slider also select projects; a skip action exits the showcase. Native scroll is never intercepted.

Motion can be paused; live reduced-motion changes restore normal layout. Phones and short windows use manual tab/range navigation. Focus inside the active panel prevents scroll from hiding its focused link. Existing screenshot inspector remains available. Dedicated tests cover forward/reverse progress, pause/resume, live reduced motion, mobile range and short-window fallback; screenshot reviews cover desktop stage and mobile controls.

## Open reel replaces the rejected control panel
The user rejected the tabbed/pinned showcase as old and outdated. Replaced it completely with an unboxed horizontal project reel: large full preview images, adjacent projects visible at edges, mouse dragging with projected snap, native touch/trackpad scrolling, restrained perspective responding to reel position, pointer-following Drag cue, direct project links and understated position/previous/next controls. No tabs, range slider, inspector dialog, sticky scroll runway or motion-settings toolbar. Native overflow remains functional without JS; keyboard Home/End/directional navigation and reduced-motion fallback are supported.

Current reference pages reviewed: https://www.basicagency.com/ (project-led work and drag affordances) and https://www.instrument.com/ (recent-work presentation). Inspiration only; no copied design/assets or claim to reproduce their animation implementation. Dedicated test: scripts/verify-reel.mjs. Obsolete scroll/inspector test helpers archived outside repository alongside prior iteration backups.
