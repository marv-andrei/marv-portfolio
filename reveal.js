// Hero work row: make it scrollable by mouse wheel and click-drag
// (trackpad two-finger already scrolls it natively).
(function () {
  var row = document.querySelector('.hero-grid');
  if (!row) return;

  // vertical wheel -> horizontal scroll, until the row hits its end (then let the page scroll)
  row.addEventListener('wheel', function (e) {
    if (!e.deltaY) return;
    var max = row.scrollWidth - row.clientWidth;
    if (max <= 0) return;
    var atStart = row.scrollLeft <= 0;
    var atEnd = row.scrollLeft >= max - 1;
    if ((e.deltaY > 0 && !atEnd) || (e.deltaY < 0 && !atStart)) {
      e.preventDefault();
      row.scrollLeft += e.deltaY;
    }
  }, { passive: false });

  // click-and-drag to scroll (mouse), without triggering the card link on a drag
  var down = false, startX = 0, startLeft = 0, moved = false;
  row.addEventListener('pointerdown', function (e) {
    down = true; moved = false; startX = e.clientX; startLeft = row.scrollLeft;
  });
  row.addEventListener('pointermove', function (e) {
    if (!down) return;
    var dx = e.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    row.scrollLeft = startLeft - dx;
  });
  window.addEventListener('pointerup', function () { down = false; });
  row.addEventListener('click', function (e) {
    if (moved) { e.preventDefault(); e.stopPropagation(); }
  }, true);

  // arrow buttons
  var prevBtn = document.getElementById('heroPrev');
  var nextBtn = document.getElementById('heroNext');
  function step(dir) {
    var card = row.querySelector('.hero-card');
    var amount = card ? card.offsetWidth + 18 : 340;
    row.scrollBy({ left: dir * amount, behavior: 'smooth' });
  }
  function updateArrows() {
    if (!prevBtn || !nextBtn) return;
    var max = row.scrollWidth - row.clientWidth;
    prevBtn.disabled = row.scrollLeft <= 2;
    nextBtn.disabled = row.scrollLeft >= max - 2;
  }
  if (prevBtn) prevBtn.addEventListener('click', function () { step(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { step(1); });
  row.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows, { passive: true });
  updateArrows();
})();

// Nav: transparent over the dark hero, light bar once scrolled past it (homepage only).
(function () {
  if (!document.body.classList.contains('home-dark')) return;
  var nav = document.querySelector('nav');
  var hero = document.querySelector('.hero');
  if (!nav || !hero) return;
  var onScroll = function () {
    var threshold = Math.max(60, hero.offsetHeight - 72);
    if (window.scrollY > threshold) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
})();

// Subtle scroll-reveal + scroll-linked 3D tilt for an editorial feel.
// Progressive enhancement: if JS / IntersectionObserver is unavailable, nothing is hidden.
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ---- generic fade-up reveal ---- */
  var selector = [
    '.kicker', '.section-title', '.section-intro',
    '.help-card', '.case-study',
    '.about-text', '.fast-facts', '.timeline-item',
    '.skills-row', '.pull', '.service-card',
    '.contact-method', '.work-mini .item'
  ].join(', ');

  var els = [].slice.call(document.querySelectorAll(selector)).filter(function (el) {
    return !el.closest('.hero');
  });
  els.forEach(function (el) { el.classList.add('fx'); });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('fx-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  els.forEach(function (el) { io.observe(el); });

  /* ---- scroll-linked 3D tilt for work cards (desktop only) ----
     Each card pitches back when it enters from the bottom and flattens as it
     scrolls up, then is released to CSS so the :hover lift still works.
     This mirrors the ContainerScroll component's useScroll -> rotateX/scale. */
  if (!window.matchMedia('(min-width: 769px)').matches) return;

  var cards = [].slice.call(document.querySelectorAll('.work-card'));
  if (!cards.length) return;

  cards.forEach(function (c) { c.style.willChange = 'transform, opacity'; });

  var ticking = false;
  function tick() {
    ticking = false;
    var vh = window.innerHeight;
    var start = vh * 0.96;  // begin tilting when the card's top crosses 96% of the viewport
    var end = vh * 0.62;    // fully flat by the time its top reaches 62%
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i];
      if (c._done) continue;
      var top = c.getBoundingClientRect().top;
      var p = (start - top) / (start - end);
      if (p < 0) p = 0; else if (p > 1) p = 1;
      if (p >= 1) {
        // settled: hand control back to CSS (so hover works) and stop tracking it
        c.style.transition = '';
        c.style.transform = '';
        c.style.opacity = '';
        c.style.willChange = '';
        c._done = true;
        continue;
      }
      var rot = (15 * (1 - p)).toFixed(2);
      var sc = (0.93 + 0.07 * p).toFixed(3);
      var ty = (40 * (1 - p)).toFixed(1);
      c.style.transition = 'none'; // scrub directly with scroll, no easing lag
      c.style.transform = 'perspective(1200px) rotateX(' + rot + 'deg) scale(' + sc + ') translateY(' + ty + 'px)';
      c.style.opacity = (0.2 + 0.8 * p).toFixed(2);
    }
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(tick); }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  tick(); // set initial state for below-the-fold cards
})();
