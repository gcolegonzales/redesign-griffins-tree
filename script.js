/* Griffin's Tree Service — interactions */
(function () {
  'use strict';

  var header = document.getElementById('siteHeader');
  var toggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  var scrim = document.getElementById('navScrim');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Header: solidify on scroll + hide-on-down / reveal-on-any-up ---- */
  var lastScrolled = null;
  var lastY = window.scrollY;
  function onScroll() {
    var y = window.scrollY;

    var scrolled = y > 24;
    if (scrolled !== lastScrolled) {
      header.classList.toggle('scrolled', scrolled);
      lastScrolled = scrolled;
    }

    // never hide the header while the menu is open
    var menuOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (!menuOpen) {
      if (y > lastY && y > 120) {
        // scrolling down past the header — hide it
        header.classList.add('nav-hidden');
      } else if (y < lastY) {
        // any upward scroll — reveal immediately
        header.classList.remove('nav-hidden');
      }
    }
    lastY = y;
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile menu (animated dropdown + scrim) ---- */
  var menuLinks = Array.prototype.slice.call(mobileMenu.querySelectorAll('a'));
  var mainEl = document.getElementById('top');

  // Keep the off-canvas links out of the tab order whenever the drawer is closed.
  function setMenuFocusable(on) {
    if (on) {
      mobileMenu.removeAttribute('inert');
      mobileMenu.removeAttribute('aria-hidden');
    } else {
      mobileMenu.setAttribute('inert', '');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  }
  setMenuFocusable(false); // start closed

  function isOpen() { return toggle.getAttribute('aria-expanded') === 'true'; }

  function closeMenu() {
    if (!isOpen()) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    mobileMenu.classList.remove('open');
    scrim.classList.remove('open');
    setMenuFocusable(false);
    // restore background: scroll + interactivity
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    if (mainEl) mainEl.removeAttribute('inert');
    // return focus to the toggle so keyboard users aren't stranded
    if (document.activeElement && mobileMenu.contains(document.activeElement)) toggle.focus();
    // remove the scrim from the layout after the fade-out
    window.setTimeout(function () {
      if (!scrim.classList.contains('open')) scrim.hidden = true;
    }, 320);
  }
  function openMenu() {
    header.classList.remove('nav-hidden'); // ensure header is visible
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    scrim.hidden = false;
    setMenuFocusable(true);
    // lock background scroll + make the rest of the page inert
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    if (mainEl) mainEl.setAttribute('inert', '');
    // force layout, then add .open on a timer so the fade-in transition runs
    // (setTimeout instead of rAF — rAF is throttled when the tab isn't focused)
    void scrim.offsetWidth;
    window.setTimeout(function () {
      mobileMenu.classList.add('open');
      scrim.classList.add('open');
      // move keyboard focus into the drawer once it's visible/focusable.
      // (the drawer transitions from visibility:hidden; focus after it flips)
      window.setTimeout(function () {
        if (!isOpen()) return;
        if (menuLinks[0]) menuLinks[0].focus();
      }, 60);
    }, 10);
  }
  toggle.addEventListener('click', function () {
    if (isOpen()) closeMenu();
    else openMenu();
  });
  menuLinks.forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
  scrim.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    if (e.key === 'Escape') {
      closeMenu();
      toggle.focus();
      return;
    }
    if (e.key === 'Tab') {
      // trap focus within the drawer (toggle + menu links cycle)
      var focusables = [toggle].concat(menuLinks);
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      var active = document.activeElement;
      if (e.shiftKey) {
        if (active === first || !mobileMenu.contains(active) && active !== toggle) {
          e.preventDefault(); last.focus();
        }
      } else {
        if (active === last) { e.preventDefault(); first.focus(); }
      }
    }
  });

  // Reset drawer + toggle state when crossing the desktop breakpoint.
  var desktopMq = window.matchMedia('(min-width: 981px)');
  function onBreakpoint(e) {
    if (e.matches && isOpen()) {
      closeMenu();
    }
  }
  if (desktopMq.addEventListener) desktopMq.addEventListener('change', onBreakpoint);
  else if (desktopMq.addListener) desktopMq.addListener(onBreakpoint);

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
