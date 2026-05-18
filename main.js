/* =========================================================================
   ERASED — scroll behaviors
   ========================================================================= */

(() => {
  const docEl = document.documentElement;
  const body  = document.body;

  /* ---------- 1. generic reveal observer ---------- */
  const reveals = document.querySelectorAll('.reveal');

  // apply data-delay → CSS custom property
  reveals.forEach(el => {
    const d = el.getAttribute('data-delay');
    if (d) el.style.setProperty('--reveal-delay', d + 'ms');
  });

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

  reveals.forEach(el => revealObs.observe(el));

  /* ---------- 2. show margin nav after the cover ---------- */
  const cover = document.getElementById('cover');
  const nav   = document.querySelector('.margin-nav');

  const navObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // when the cover is less than 30% visible, show nav
      if (entry.intersectionRatio < 0.3) nav.classList.add('is-visible');
      else                                nav.classList.remove('is-visible');
    });
  }, { threshold: [0, 0.3, 1] });

  if (cover && nav) navObs.observe(cover);

  /* ---------- 3. paper vs dark body class (for nav contrast) ---------- */
  const paperSections = document.querySelectorAll('.section--paper');
  const paperObs = new IntersectionObserver((entries) => {
    // count how many paper sections currently intersect the viewport center
    let anyPaperCentered = false;
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
        anyPaperCentered = true;
      }
    });
    // We need a wider check — use a re-scan rather than relying on a single observer's entries
    requestAnimationFrame(rescanPaper);
  }, { threshold: [0, 0.4, 0.8] });
  paperSections.forEach(s => paperObs.observe(s));

  function rescanPaper() {
    const midline = window.innerHeight * 0.5;
    let onPaper = false;
    paperSections.forEach(s => {
      const r = s.getBoundingClientRect();
      if (r.top <= midline && r.bottom >= midline) onPaper = true;
    });
    body.classList.toggle('over-paper', onPaper);
  }
  window.addEventListener('scroll', rescanPaper, { passive: true });
  window.addEventListener('resize', rescanPaper);
  rescanPaper();

  /* ---------- 4. tofu → glyph swap ---------- */
  const tofu = document.querySelector('.tofu-demo');
  if (tofu) {
    const tofuObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          // small dramatic delay so it feels intentional
          setTimeout(() => tofu.classList.add('is-revealed'), 600);
          tofuObs.unobserve(tofu);
        }
      });
    }, { threshold: [0, 0.5, 1] });
    tofuObs.observe(tofu);
  }

  /* ---------- 5. maya strike ---------- */
  const mayaSection = document.querySelector('.section--maya');
  if (mayaSection) {
    const mayaObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.45) {
          setTimeout(() => mayaSection.classList.add('is-struck'), 900);
          mayaObs.unobserve(mayaSection);
        }
      });
    }, { threshold: [0, 0.45, 1] });
    mayaObs.observe(mayaSection);
  }

  /* ---------- 6. smooth anchor scroll for nav (instant if user prefers reduced motion) ---------- */
  document.querySelectorAll('.margin-nav a').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || !id.startsWith('#')) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  });
})();
