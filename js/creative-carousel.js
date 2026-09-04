/* =========================================================
   creative-carousel.js
   RatNawnAI Creative (Product 03) showcase carousel controller.

   Modelled on js/saral-carousel.js's structure (find-or-create
   controls, dots, counter, keyboard, swipe) but intentionally
   different in one important way: this carousel has NO
   autoplay — the user must move between slides manually.

   It also syncs the Slide 04 video with the active slide:
   the video plays only while its slide is active, and pauses
   the moment another slide becomes active.
   ========================================================= */

function initCreativeCarousel() {
  var root = document.querySelector('[data-creative-carousel]');
  if (!root) return;

  var frame = root.querySelector('.creative-carousel-frame');

  var slides = Array.prototype.slice.call(
    root.querySelectorAll('[data-cr-slide]')
  );

  if (!slides.length) return;

  var controls = root.querySelector('.creative-carousel-controls');
  var prevBtn = controls.querySelector('[data-creative-prev]');
  var nextBtn = controls.querySelector('[data-creative-next]');
  var dotsContainer = controls.querySelector('.creative-carousel-dots');
  var dots = Array.prototype.slice.call(
    dotsContainer.querySelectorAll('[data-creative-dot]')
  );
  var counterEl = controls.querySelector('[data-creative-current]');
  var liveEl = root.querySelector('[data-creative-live]');

  var video = root.querySelector('.creative-reel-video');

  var index = 0;

  /* =======================================================
     SLIDE FOCUS
     ======================================================= */

  function setSlideFocusability(slide, active) {
    var focusables = slide.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]'
    );

    for (var i = 0; i < focusables.length; i++) {
      if (active) {
        focusables[i].removeAttribute('tabindex');
      } else {
        focusables[i].setAttribute('tabindex', '-1');
      }
    }
  }

  /* =======================================================
     VIDEO SYNC — plays only while Slide 04 is active
     ======================================================= */

  function syncVideo(activeIndex) {
    if (!video) return;

    var videoSlide = video.closest('[data-cr-slide]');
    var videoIndex = slides.indexOf(videoSlide);

    if (activeIndex === videoIndex) {
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          /* autoplay can be blocked before user interaction;
             video stays paused/muted, no error surfaced */
        });
      }
    } else if (!video.paused) {
      video.pause();
    }
  }

  /* =======================================================
     GO TO SLIDE
     ======================================================= */

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
      var current = String(index + 1);
      counterEl.textContent = current.length < 2 ? '0' + current : current;
    }

    if (liveEl && !silent) {
      var title = slides[index].getAttribute('data-cr-title') || 'Slide ' + (index + 1);
      liveEl.textContent = title + ' — slide ' + (index + 1) + ' of ' + slides.length;
    }

    syncVideo(index);
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  /* =======================================================
     ARROWS
     ======================================================= */

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  /* =======================================================
     DOTS
     ======================================================= */

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      goTo(i);
    });
  });

  /* =======================================================
     KEYBOARD
     ======================================================= */

  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      next();
      e.preventDefault();
    }

    if (e.key === 'ArrowLeft') {
      prev();
      e.preventDefault();
    }
  });

  /* =======================================================
     TOUCH SWIPE
     ======================================================= */

  if (frame) {
    var touchStartX = null;

    frame.addEventListener(
      'touchstart',
      function (e) {
        touchStartX = e.touches[0].clientX;
      },
      { passive: true }
    );

    frame.addEventListener(
      'touchend',
      function (e) {
        if (touchStartX === null) return;

        var dx = e.changedTouches[0].clientX - touchStartX;

        if (Math.abs(dx) > 40) {
          if (dx < 0) {
            next();
          } else {
            prev();
          }
        }

        touchStartX = null;
      },
      { passive: true }
    );
  }

  /* =======================================================
     INITIALIZE — no autoplay: carousel only moves when the
     user clicks an arrow/dot, uses arrow keys, or swipes.
     ======================================================= */

  goTo(0, true);
}

/* =========================================================
   GLOBAL EXPOSE
   ========================================================= */

if (typeof window !== 'undefined') {
  window.initCreativeCarousel = initCreativeCarousel;
}
