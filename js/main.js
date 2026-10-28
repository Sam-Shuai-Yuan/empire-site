/* Empire Square Group — interactions (GSAP + ScrollTrigger) */
(function () {
  var root = document.documentElement;
  if (!window.gsap || !window.ScrollTrigger) { root.classList.remove('js'); return; }
  gsap.registerPlugin(ScrollTrigger);

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) root.classList.add('reduced');

  var nav = document.querySelector('[data-nav]');
  var isHome = document.body.classList.contains('is-home');

  /* ---------------- Nav ---------------- */
  var burger = document.querySelector('[data-burger]');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open);
    });
    document.querySelectorAll('[data-mobile-menu] a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', false); });
    });
  }

  /* ---------------- Mega-menu ---------------- */
  var dds = document.querySelectorAll('[data-dd]');
  var openDd = null, closeTimer = null;
  function setDd(dd) {
    clearTimeout(closeTimer);
    if (openDd === dd) return;
    if (openDd) { openDd.classList.remove('is-open'); openDd.querySelector('.dd__toggle').setAttribute('aria-expanded', false); }
    openDd = dd;
    if (dd) {
      dd.classList.add('is-open');
      dd.querySelector('.dd__toggle').setAttribute('aria-expanded', true);
      nav.style.setProperty('--nav-tint', dd.style.getPropertyValue('--tint'));
    }
    nav.classList.toggle('is-dd-open', !!dd);
  }
  dds.forEach(function (dd) {
    dd.addEventListener('mouseenter', function () { setDd(dd); });
    dd.addEventListener('mouseleave', function () { closeTimer = setTimeout(function () { setDd(null); }, 160); });
    dd.addEventListener('focusin', function () { setDd(dd); });
    dd.addEventListener('focusout', function (e) { if (!dd.contains(e.relatedTarget)) setDd(null); });
    dd.querySelectorAll('.dd__panel a').forEach(function (a) { a.addEventListener('click', function () { setDd(null); }); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setDd(null); });

  var lastY = 0;
  function onScroll() {
    var y = window.scrollY;
    var solidAt = isHome ? window.innerHeight * 1.15 : 10;
    nav.classList.toggle('is-solid', y > solidAt);
    // hide while scrolling down through content, show on scroll up
    var hideAt = isHome ? window.innerHeight * 2.4 : window.innerHeight * 0.8;
    if (openDd && Math.abs(y - lastY) > 4) setDd(null);
    if (!nav.classList.contains('is-open')) nav.classList.toggle('is-hidden', y > hideAt && y > lastY);
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------------- Split-line headings ---------------- */
  function splitLines(el) {
    var words = [];
    var nodes = Array.prototype.slice.call(el.childNodes);
    el.innerHTML = '';
    nodes.forEach(function (n) {
      if (n.nodeType === 3) {
        n.textContent.split(/\s+/).filter(Boolean).forEach(function (w) {
          var s = document.createElement('span');
          s.textContent = w;
          s.style.display = 'inline-block';
          el.appendChild(s); el.appendChild(document.createTextNode(' '));
          words.push(s);
        });
      } else if (n.nodeName === 'BR') {
        el.appendChild(document.createElement('br'));
        words.push('br');
      }
    });
    // group words by rendered line
    var lines = [], current = [], top = null;
    words.forEach(function (w) {
      if (w === 'br') { if (current.length) lines.push(current); current = []; top = null; return; }
      var t = w.offsetTop;
      if (top !== null && Math.abs(t - top) > 4) { lines.push(current); current = []; }
      top = t; current.push(w.textContent);
    });
    if (current.length) lines.push(current);
    el.innerHTML = lines.map(function (l) {
      return '<span class="split-line"><span>' + l.join(' ') + '</span></span>';
    }).join('');
    return el.querySelectorAll('.split-line > span');
  }

  /* ---------------- Home hero ---------------- */
  function heroIntro() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) return;
    var art = hero.querySelector('[data-hero-art]');
    var svg = hero.querySelector('.hero__svg');
    var paper = hero.querySelector('.hero__paper');
    var title = hero.querySelector('[data-hero-title]');
    var cue = hero.querySelector('[data-hero-cue]');
    var cueIn = hero.querySelector('.hero__cue-in');
    var lines = hero.querySelectorAll('.sketch__line');
    var markParts = hero.querySelectorAll('.logo-draw__mark .ld');
    var typeParts = hero.querySelectorAll('.logo-draw__type .ld');

    // portrait screens: fit the logo instead of cropping it (lines overflow the viewBox)
    function fitArt() {
      var portrait = window.innerWidth / window.innerHeight < 1;
      svg.setAttribute('viewBox', portrait ? '300 0 1000 900' : '0 0 1600 900');
      svg.setAttribute('preserveAspectRatio', portrait ? 'xMidYMid meet' : 'xMidYMid slice');
    }
    fitArt();
    window.addEventListener('resize', fitArt);

    // prime every stroke for a "pencil drawing" reveal
    hero.querySelectorAll('.sketch__line, .ld').forEach(function (p) {
      var len = p.getTotalLength ? p.getTotalLength() : 1000;
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = reduced ? 0 : len;
    });

    // always start the intro film from the top
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    if (reduced) {
      gsap.set(cueIn, { opacity: 1 });
      gsap.set([markParts, typeParts], { fillOpacity: 0.9 });
      gsap.set(title, { opacity: 1, y: 0 });
      gsap.set(art, { opacity: 0 });
      gsap.set(nav, { opacity: 1 });
      return;
    }

    gsap.set(title, { opacity: 0, y: () => window.innerHeight * 0.62 });

    // 1. intro film: slow camera push + lines sketched in, then the mark is shaded and the type drawn
    var intro = gsap.timeline({ defaults: { ease: 'power2.inOut' }, onComplete: function () { document.body.classList.remove('is-loading'); } });
    intro
      .fromTo(nav, { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }, 0.2)
      .fromTo([svg, paper], { scale: 1.18 }, { scale: 1, duration: 7.5, ease: 'power2.out', transformOrigin: '50% 50%' }, 0)
      .to(lines, { strokeDashoffset: 0, duration: 1.8, stagger: 0.16 }, 0.1)
      .to(markParts, { strokeDashoffset: 0, duration: 1.6, stagger: 0.25 }, 1.1)
      .to(markParts, { fillOpacity: 0.92, duration: 1.4, ease: 'power1.out' }, 2.4)
      .to(typeParts, { strokeDashoffset: 0, duration: 1.1, stagger: 0.05 }, 2.5)
      .to(typeParts, { fillOpacity: 0.88, duration: 1, stagger: 0.03, ease: 'power1.out' }, 3.2)
      .to(lines, { opacity: function (i, el) { return parseFloat(getComputedStyle(el).opacity) * 0.55; }, duration: 1.6 }, 3.6)
      .to(cueIn, { opacity: 1, duration: 1 }, 4.2);

    // 2. scroll: pin the hero, fade the drawing away and raise the statement into place
    var scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.9,
        invalidateOnRefresh: true,
        onUpdate: function (self) { if (self.progress > 0.02 && intro.isActive()) intro.progress(1); }
      }
    });
    scrollTl
      .to(cue, { opacity: 0, duration: 0.1, ease: 'none' }, 0)
      .to(art, { opacity: 0, scale: 1.04, duration: 0.35, ease: 'power1.in' }, 0)
      .to(title, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.3)
      .to({}, { duration: 0.35 }); // hold the statement before releasing the pin
  }

  /* ---------------- Section reveals ---------------- */
  function reveals() {
    document.querySelectorAll('[data-split]').forEach(function (el) {
      var parts = splitLines(el);
      if (reduced) return;
      gsap.from(parts, {
        yPercent: 110, duration: 1.2, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });

    if (reduced) return;

    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 88%',
      onEnter: function (batch) {
        gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12, overwrite: true });
      }
    });

    document.querySelectorAll('[data-count]').forEach(function (el) {
      var end = parseFloat(el.dataset.count), pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
      var o = { v: 0 };
      el.textContent = pre + '0' + suf;
      gsap.to(o, {
        v: end, duration: 1.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
        onUpdate: function () { el.textContent = pre + Math.round(o.v) + suf; }
      });
    });

    // parallax banner (Why Empire)
    var banner = document.querySelector('[data-parallax]');
    if (banner) {
      gsap.fromTo(banner.querySelector('img'), { yPercent: -8 }, {
        yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: banner, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }
  }

  /* ---------------- Sub-nav active state (Why Empire) ---------------- */
  function subnav() {
    var links = document.querySelectorAll('[data-subnav] a');
    if (!links.length) return;
    links.forEach(function (a) {
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      ScrollTrigger.create({
        trigger: target, start: 'top 45%', end: 'bottom 45%',
        onToggle: function (self) { if (self.isActive) { links.forEach(function (l) { l.classList.toggle('is-active', l === a); }); } }
      });
    });
  }

  function init() {
    heroIntro();
    reveals();
    subnav();
    ScrollTrigger.refresh();
  }

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(init); else window.addEventListener('load', init);
})();
