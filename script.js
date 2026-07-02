/* Griffin's Tree Service — interactions */
(function () {
  'use strict';

  var header = document.getElementById('siteHeader');
  var toggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Shrink / solidify header on scroll ---- */
  var lastScrolled = null;
  function onScroll() {
    var scrolled = window.scrollY > 24;
    if (scrolled !== lastScrolled) {
      header.classList.toggle('scrolled', scrolled);
      lastScrolled = scrolled;
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile menu ---- */
  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    mobileMenu.hidden = true;
  }
  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    mobileMenu.hidden = false;
  }
  toggle.addEventListener('click', function () {
    if (toggle.getAttribute('aria-expanded') === 'true') closeMenu();
    else openMenu();
  });
  mobileMenu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });

  /* ---- Scroll reveal ---- */
  var revealSelector = '.svc-row, .step, .fact, .rev, .why-lead, .section-head, .g, .estimate-copy, .estimate-form';
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(revealSelector));
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- Real-photo swap: if a dropped photo exists, use it in place of the placeholder ---- */
  function tryPhoto(el) {
    var src = el.getAttribute('data-photo');
    if (!src) return;
    // data-photo may include a descriptive suffix; take the path up to the first space
    var path = src.split(' ')[0];
    if (!/\.(jpe?g|png|webp|avif)$/i.test(path)) return;
    var img = new Image();
    img.onload = function () {
      el.style.setProperty('--bg', 'url("' + path + '")');
      el.classList.add('has-photo');
    };
    img.src = path;
  }
  document.querySelectorAll('.svc-photo[data-photo], .g[data-photo]').forEach(tryPhoto);

  // Hero background photo (if hero.jpg dropped)
  (function () {
    var heroMedia = document.querySelector('.hero-media');
    if (!heroMedia) return;
    var img = new Image();
    img.onload = function () {
      heroMedia.style.backgroundImage =
        'linear-gradient(180deg, rgba(15,25,18,.35), rgba(15,22,16,.8)), url("assets/photos/hero.jpg")';
      heroMedia.style.backgroundSize = 'cover';
      heroMedia.style.backgroundPosition = 'center';
    };
    img.src = 'assets/photos/hero.jpg';
  })();

  /* ---- Estimate form (real client-side inquiry; not wired to a fake backend) ---- */
  var form = document.getElementById('estimateForm');
  var note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var required = form.querySelectorAll('[required]');
      var firstBad = null;
      required.forEach(function (f) {
        var ok = f.value && f.value.trim().length > 0;
        if (f.type === 'tel') ok = ok && /\d/.test(f.value);
        f.classList.toggle('invalid', !ok);
        if (!ok && !firstBad) firstBad = f;
      });
      if (firstBad) {
        note.textContent = 'Please fill in the highlighted fields so we can reach you.';
        note.className = 'form-note error';
        firstBad.focus();
        return;
      }
      var name = form.querySelector('#name').value.trim().split(' ')[0];
      note.textContent = 'Thanks' + (name ? ', ' + name : '') +
        '! Your request is ready — a Griffin’s crew member will reach out shortly. Prefer to talk now? Call (225) 445-8733.';
      note.className = 'form-note success';
      form.querySelectorAll('input, select, textarea').forEach(function (f) {
        f.value = ''; f.classList.remove('invalid');
      });
    });
    // clear invalid state as the user fixes fields
    form.addEventListener('input', function (e) {
      if (e.target.classList.contains('invalid') && e.target.value.trim()) {
        e.target.classList.remove('invalid');
      }
    });
  }

  /* ---- Footer year ---- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
