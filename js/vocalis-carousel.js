/* =========================================================
   vocalis-carousel.js
   Minimal, self-contained controller for the Vocalis product
   carousel inside the "Our Products" section
   (sections/products.html → [data-vocalis-carousel]).

   Exposed as window.initVocalisCarousel() so it can be called
   AFTER the section HTML has been injected into the page by
   include.js (same pattern as initHeader()/initMain()).
   ========================================================= */

function initVocalisCarousel() {
  var root = document.querySelector('[data-vocalis-carousel]');
  if (!root) return;

  var frame = root.querySelector('.vocalis-carousel-frame');
  var slides = Array.prototype.slice.call(root.querySelectorAll('[data-vs-slide]'));
  var dots = Array.prototype.slice.call(root.querySelectorAll('[data-vocalis-dot]'));
  var prevBtn = root.querySelector('[data-vocalis-prev]');
  var nextBtn = root.querySelector('[data-vocalis-next]');
  var counterEl = root.querySelector('[data-vocalis-current]');
  var liveEl = root.querySelector('[data-vocalis-live]');

  if (!slides.length) return;

  var AUTOPLAY_MS = 5500;
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var index = 0;
  var timer = null;

  function setSlideFocusability(slide, active) {
    var focusables = slide.querySelectorAll('a, button, [tabindex]');
    for (var i = 0; i < focusables.length; i++) {
      if (active) {
        focusables[i].removeAttribute('tabindex');
      } else {
        focusables[i].setAttribute('tabindex', '-1');
      }
    }
  }

  function goTo(nextIndex, silent) {
    index = (nextIndex + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
      var isActive = i === index;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      setSlideFocusability(slide, isActive);
    });

    dots.forEach(function (dot, i) {
      var isActive = i === index;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    if (counterEl) {
      counterEl.textContent = String(index + 1).length < 2 ? '0' + (index + 1) : String(index + 1);
    }

    if (liveEl && !silent) {
      var title = slides[index].getAttribute('data-vs-title') || 'Slide ' + (index + 1);
      liveEl.textContent = title + ' — slide ' + (index + 1) + ' of ' + slides.length;
    }
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function stopAutoplay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function startAutoplay() {
    stopAutoplay();
    if (reducedMotion) return;
    timer = setInterval(next, AUTOPLAY_MS);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      prev();
      startAutoplay();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      next();
      startAutoplay();
    });
  }
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      goTo(i);
      startAutoplay();
    });
  });

  // Pause while the user is interacting/hovering.
  root.addEventListener('mouseenter', stopAutoplay);
  root.addEventListener('mouseleave', startAutoplay);
  root.addEventListener('focusin', stopAutoplay);
  root.addEventListener('focusout', function (e) {
    if (!root.contains(e.relatedTarget)) startAutoplay();
  });

  // Keyboard navigation when the carousel itself has focus.
  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      next();
      startAutoplay();
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      prev();
      startAutoplay();
      e.preventDefault();
    }
  });

  // Lightweight swipe support on touch devices.
  if (frame) {
    var touchStartX = null;
    frame.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
      stopAutoplay();
    }, { passive: true });
    frame.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) next(); else prev();
      }
      touchStartX = null;
      startAutoplay();
    }, { passive: true });
  }

  goTo(0, true);
  startAutoplay();
}

if (typeof window !== 'undefined') {
  window.initVocalisCarousel = initVocalisCarousel;
}
