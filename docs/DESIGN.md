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

## 2026-11-05 — Stronger hero and saturated palette (local review)
User rejected the live hero and overall pale palette. Replaced the introduction with a deep teal split composition, clear builder copy and two actual project previews. The overlapping previews stay aligned, lift on hover/focus and link directly to case studies. Retained the open reel below the hero. No decorative arrows or starburst.

Palette: teal #123f42, yellow #f5d77e, sage #c9dcb9, coral #ed9376, warm white #fff7dc, muted green #435952. Schibsted Grotesk remains the sole typeface. Teal header/hero/services/contact, yellow canvas, restored per-project preview framing; coral personal panel. Reduced motion suppresses entrance/transition motion. Local only; do not push automatic-deploy branches without explicit deployment request.

Validation: 16-page build; Astro check zero errors/warnings, one existing hint; 3 content checks; 60 responsive route checks and existing interactions. Focus lift and reduced-motion hero behavior verified. Desktop/mobile screenshots in chat outputs/Marv_New_Hero.png and Marv_New_Hero_Mobile.png. Existing résumé PDF and social image remain the prior exported assets.

## 2026-11-05 — Approved research direction implemented locally
Supersedes the rejected teal/yellow revision. Black #101010 canvas, charcoal #202020 surfaces, white #f5f5f5 type, grey #a6a6a6 supporting text. Actual project screenshots provide the colour. Name/role introduction leads directly into the existing keyboard-accessible draggable reel. Removed overlapping hero previews and duplicated homepage project grid; the archive remains one click away. Applied dark surfaces to all routes, with a light printable résumé. Refreshed social preview. No decorative arrows/starburst, no copied reference assets. Build and content checks pass; desktop/mobile visually reviewed. Local preview only pending explicit deployment request.

## Mobile audit
2026-11-05: 150 layout checks across 15 routes, 5 widths (320–768), Chromium/WebKit pass. Emulated touch swipe/Next and WebKit project links, navigation, filters, FAQ and contact brief tested. Enlarged mobile navigation heights and reel markers to 44px, wrapped reel steps to separate row, enlarged footer link height. No physical-device test. Evidence: scripts/mobile-audit.mjs and adjacent mobile-audit/results.json.

## Vendrato consultant revision, 2026-11-13
Requested by Gabriel Fordan: present Marv as a consultant at Vendrato and as more than an ecommerce page builder.

Brand: all routes take Vendrato's published tokens from vendrato.com. Black #000, paper #edebe6, studio orange #f05123, muted #a8a6a0. Manrope variable (self-hosted) replaces Schibsted Grotesk as the root family, with medium-weight headings tracked at -0.045em and 2px corners on buttons. Header and footer carry the Vendrato logo followed by Marv's name. The primary action everywhere is "Book a free call" at vendrato.com/book; Marv's own contact page remains.

Homepage: a scroll-told story in six first-person beats (aircraft maintenance, first builds, the Sweden-based brand, Vendrato, today) beside a sticky three.js scene. The scene is a page drawn in lines that is measured, separated into layers, joined by further pages and connected by an orange path as the story advances. It is decorative and hidden from assistive technology; every word is in the HTML. Hovering a part names the offer it stands for, a click redraws the page and dragging turns it. Native scroll is never intercepted, reduced motion removes idle movement and the draw-on, and without WebGL the canvas is hidden. The existing five-project reel follows the story unchanged.

Offers: "What I do at Vendrato" maps Marv's part to the studio's published services and prices (Websites from US$2,000, CRM systems, Automations, maintenance from US$100 a month) and its three-step process. Prices are quoted from vendrato.com and must be updated when the studio changes them.

Still honoured: no arrows or directional glyphs, no all-caps labels, no fabricated metrics. Unverified figures from older résumé drafts were left out.

To confirm with Marv before deployment: the automation and tracking claims in the Vendrato beat, and that he joins studio calls.

## Story set pieces, 2026-11-13 (later the same day)
The line-drawn blueprint scene was replaced at Gabriel's request with physical 3D set pieces, one per beat, in the spirit of gabrielfordan.com: each beat has an object you can poke and a short line saying what to do with it. Same six beats and copy.

Pieces: a push button (the click), a torque wrench that must be clicked twice (checked twice), page blocks that assemble over a laptop as you scroll and can be knocked down (built by hand), a parcel that moves along a line with three stops (one step of many), three meshing gears that drive each other (connected), and a desk bell (book the call). An orange marble, the visitor, rolls down a rail from piece to piece as the page scrolls.

Assets: the button, wrench, laptop, parcel and bell are meshes generated with Higgsfield (image to 3D), packed to public/models/*.bin (about 300 KB each, int16 positions, int8 normals, uint16 indices). Gears, page blocks, rail and marble are built in code. Materials are plaster, graphite, steel and the studio orange. src/scripts/story-scene.js replaces blueprint-scene.js.

Captions are sentence case and change after the visitor interacts. Pieces can be dragged to turn and spring back. Reduced motion removes idle movement. No sound.

Projects in the story: beats 2 to 4 each end with linked thumbnails of the real builds that back them (ORIAS Essentials, Gawang Diwa and Zenith; BALZY, ARTIN Athletics and Komforten; Vendrato). In the scene, the assembled page shows the actual screenshot of one of those builds and each knock-down rebuilds the next, and the three stops on the parcel line stand under screenshots of a real advertorial, product page and store. Names and kinds come from src/data/projects.json, so they stay in step with the work pages.

Projects on the set pieces: the screenshots are now part of the objects. Pressing the hero button deals out all eight builds as mounted panels, one per press. The laptop shows the build on its own screen (its position was measured from the mesh), after the page blocks assemble on it. The parcel line has a signpost per stop carrying a real advertorial, product page and store. Turning the gears lights a panel showing the Vendrato funnel.

Colour on the set pieces: each model is one mesh split into parts by position, so parts take brand materials. Base tones are paper (#edebe6), graphite, gunmetal, steel and black rubber. Orange (#f05123) is reserved for the part the visitor acts on or the part that drives the rest: the button cap, the wrench's torque collar, the laptop's front lip, the parcel tape, the driving gear and the bell plunger. No object is orange all over.

## Hero piece, small screens and loading, 2026-11-13 (evening)
The push button is gone: Gabriel found it too literal, a stack of the project screenshots that replaced it too generic, and a kitchen-style funnel not the right kind of funnel. The hero piece is now a sales funnel made physical: one cone cut into four floating tiers with open gaps between them, labelled Visit, Lead, Booking and Customer, over a dish. There is no stand; Gabriel did not want one. The last tier is orange. Orange marbles (visitors) trickle in while the funnel is on stage and some slip out sideways through each open gap. Tapping one of the top three tiers closes the gap under it: the tiers below rise to meet it, an orange seal appears on the joint, the two stage names turn orange and the caption says what closes that gap in real work (form into CRM; calendar, confirmations and reminders; follow-ups and ad attribution). With gaps closed, more marbles reach the dish, and the caption keeps a running "x of y made it". Tapping again reopens a gap; tapping the orange tier or the dish sends a burst of eight. The counts only describe the toy and are not a claimed conversion rate. It is made in code, so it needs no model.

Small screens: the set piece keeps the top 44% of the screen at full strength and the text scrolls up underneath it, so pieces are never covered and can be tapped. Captions show there too and say "Tap" on touch devices. Which piece is on stage is read from where each beat's text sits, so beats can be different heights. The wrench has an unseen box along its length so it is easy to hit.

Loading: the scene script loads only once the page is idle and is skipped for data-saver visitors. Each model and screenshot is fetched as its beat comes near, and the canvas fades in on its first frame. Source meshes live in assets-src/models; `npm run pack:scene` simplifies them into public/models (about 26,000 triangles down to 8,000 to 11,000, roughly 300 KB down to 110 KB each) and writes 800 px screenshot copies to public/images/shots/tex (10 to 32 KB each). netlify.toml sets cache headers for these and for the hashed build files.

Checks before the commit, 2026-11-14: every beat was screenshotted at 1920, 1440, 1024, 768, 390 and 320 wide. Fixed from that pass: captions now stay inside the part of the stage that is on screen (the hero caption ran under the fold at 1440); the laptop's loose page blocks no longer drift through the wrench beat; the funnel's stage names sit further from the rim so the top tier does not cover them; the running score waits for four results before it shows. Open questions for the copy: the "Vendrato maintenance" link points at vendrato.com/websites, and the automation and tracking claims still need Marv's confirmation.

## Individual offer framing, 2026-11-14
At Gabriel's direction the homepage now presents the offer as Marv's own, with Vendrato as backing rather than as the subject. No people are named. The fifth beat says what he builds behind the page and mentions Vendrato once as the studio he consults for. The offers section is headed "What I can build for you" and each card says what Marv does and why it matters to the client; prices are still Vendrato's published ones, and the intro says projects are scoped and priced through the studio. The Websites card lists three interactive sites built by Vendrato (Urdaneta Sacred Heart Hospital, Japanese 4x4, Create in Subic), labelled as studio work and linked to Vendrato's case studies. They are not presented as Marv's builds. Thumbnails are in public/images/studio.

Zenith now points at the night-cream landing page (lp.tryzenith.ph/lp-1-8) instead of a quiz page, with a new screenshot taken on 2026-11-14. The capture shows a dated 11.11 sale banner.

Later the same day: prices were removed from the offer cards at Gabriel's request, and the process line no longer mentions a fixed price. The studio's sites moved out of the Websites card into their own block under the cards, "Sites from the studio behind me": the three client sites, then eight Vendrato concept studies, one per trade (construction, landscaping, pest control, law, pool builders, concreting, tree services, architecture). Concept studies are design proposals for real businesses, so they are labelled as concepts and link to Vendrato's own pages. Their thumbnails are Vendrato's published previews.

Zenith is maintenance and update work, not Marv's build (Gabriel, 2026-11-14). Its entry now says so in its label, contribution and write-up, and its work page is headed "About the work". On the homepage it moved from the "make the thing myself" beat and the laptop screen to the upkeep beat ("A page is one step"); Cowmit took its place among the builds. The line under the reel says "Eight projects" instead of "Eight builds".

Partner framing and display, 2026-11-14: Marv is a partner in Vendrato as well as a consultant, so his role now reads "partner and consultant at Vendrato" in the header, footer, hero, page descriptions, About and Services. The work is framed as built with the studio, not on his own: the offers intro reads "This is the work I build with the studio", and the connect beat says he builds it with Vendrato. Each offer card gained a small line illustration (one orange element each) and a one-line outcome in larger type above the detail. The project lists inside the story beats changed from small thumbnails with text beside them to larger image tiles with the name underneath: three across, two by two when there are four, one wide tile when there is one. The studio block is now titled "More sites from our studio".

Concept picks reviewed, 2026-11-14: Vendrato lists 170 concept studies, newest first. For each trade the twelve newest were compared side by side and the strongest recent one chosen: Smiths Fencing and Gates (construction), Mountain Paradise Landscaping, Shearwater Pest Management, Nelson Keane & Hemingway Lawyers, Newcorp Pools, Deon Shaw Concreting, Hooper Trees and MCG Architects.
