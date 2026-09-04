/* =========================================================
   main.js
   Global/common interactions used across the whole page:
   the footer's current-year stamp and the single orchestrated
   scroll-reveal pattern applied to cards across several
   sections (products, build cards, use cases, why cards,
   proof cards, portfolio cells, industry cards, timeline).

   Exposed as window.initMain() so it can be called AFTER all
   section HTML has been injected into the page by include.js
   (none of the target elements exist yet on plain
   DOMContentLoaded when sections load via fetch()).
   ========================================================= */

function initMain() {
  // ---- Footer year ----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Vocalis product carousel (Our Products section) ----
  if (typeof initVocalisCarousel === 'function') initVocalisCarousel();

  // ---- Saral Rojgar product carousel (Our Products section) ----
  if (typeof initSaralCarousel === 'function') initSaralCarousel();

  // ---- RatNawnAI Creative product carousel (Our Products section) ----
  if (typeof initCreativeCarousel === 'function') initCreativeCarousel();

  // ---- Scroll reveal (single lightweight pattern) ----
  const revealTargets = document.querySelectorAll(
    '.product-block, .build-card, .use-case-card, .why-card, .proof-card, .portfolio-cell, .industry-card, .timeline li'
  );

  revealTargets.forEach((el) => el.classList.add('reveal'));

  // Safety net: no matter what (an observer that never fires for an
  // element far down the page, a full-page screenshot tool that
  // resizes the viewport and captures before the callback runs, a
  // browser extension interfering, etc.), nothing should stay
  // permanently invisible. Anything not revealed by the observer
  // within a second is force-revealed here. Real/normal scrolling
  // is unaffected — the observer still reveals things the moment
  // they're actually scrolled into view, well before this timer.
  const forceRevealAll = () => {
    revealTargets.forEach((el) => el.classList.add('in-view'));
  };
  const forceRevealTimer = setTimeout(forceRevealAll, 1000);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      // Generous rootMargin so items reveal well before they
      // actually reach the viewport, not right at its edge.
      { threshold: 0.01, rootMargin: '0px 0px 200px 0px' }
    );
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    clearTimeout(forceRevealTimer);
    forceRevealAll();
  }
}

// Safety net for a non-split version of index.html — no-op when
// sections are loaded dynamically, since include.js calls
// initMain() itself after all sections are injected.
document.addEventListener('DOMContentLoaded', initMain);
