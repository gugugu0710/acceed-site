/* ==========================================================================
   acceed — interactions
   Vanilla JS, no dependencies. Everything degrades gracefully without JS.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  root.classList.add('js');

  /* ---------------------------------------------------------------- Nav */
  var nav = document.getElementById('nav');

  function onScrollNav() {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }

  /* -------------------------------------------------------- Mobile menu */
  var toggle = document.querySelector('.nav__toggle');
  var mobileMenu = document.getElementById('mobileMenu');

  function setMenu(open) {
    if (!toggle || !mobileMenu) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    if (open) {
      mobileMenu.hidden = false;
      requestAnimationFrame(function () { mobileMenu.classList.add('is-open'); });
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.classList.remove('is-open');
      document.body.style.overflow = '';
      window.setTimeout(function () { mobileMenu.hidden = true; }, 320);
    }
  }

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    mobileMenu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024) setMenu(false);
    });
  }

  /* ----------------------------------------------------------- Reveals */
  var revealables = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* -------------------------------------------------- Active nav item */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
  var sections = navLinks
    .map(function (link) { return document.getElementById(link.getAttribute('data-nav')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-current', link.getAttribute('data-nav') === entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* ------------------------------------------------------ Hero parallax */
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var ticking = false;

  function applyParallax() {
    var y = window.scrollY;
    parallaxEls.forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
      el.style.transform = 'translate(-50%, calc(-50% + ' + (y * speed).toFixed(1) + 'px))';
    });
    ticking = false;
  }

  function requestParallax() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(applyParallax);
  }

  /* ---------------------------------------------- Sticky story steps */
  var plate = document.querySelector('[data-plate]');
  var plateCaption = document.querySelector('[data-plate-caption]');
  var steps = Array.prototype.slice.call(document.querySelectorAll('.step'));

  if (steps.length && 'IntersectionObserver' in window) {
    var stepObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        steps.forEach(function (s) { s.classList.toggle('is-active', s === entry.target); });
        if (plate) plate.style.setProperty('--hue', entry.target.getAttribute('data-hue') || '34');
        if (plateCaption) plateCaption.textContent = entry.target.getAttribute('data-caption') || '';
      });
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });

    steps.forEach(function (step) { stepObserver.observe(step); });
  }

  /* -------------------------------------------- Gallery drag to scroll */
  var gallery = document.querySelector('.gallery');
  if (gallery) {
    var isDown = false, startX = 0, startScroll = 0;

    gallery.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return;
      isDown = true;
      startX = e.clientX;
      startScroll = gallery.scrollLeft;
      gallery.style.cursor = 'grabbing';
    });
    gallery.addEventListener('pointermove', function (e) {
      if (!isDown) return;
      gallery.scrollLeft = startScroll - (e.clientX - startX);
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (type) {
      gallery.addEventListener(type, function () {
        isDown = false;
        gallery.style.cursor = '';
      });
    });

    gallery.tabIndex = 0;
    gallery.setAttribute('aria-label', '空间展示，可左右滚动');
  }

  /* ------------------------------------------------------------- Year */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------------- Scroll loop */
  onScrollNav();
  window.addEventListener('scroll', function () {
    onScrollNav();
    if (parallaxEls.length && !reduceMotion.matches) requestParallax();
  }, { passive: true });
})();
