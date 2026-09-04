/* =========================================================
   saral-carousel.js
   Saral Rojgar product carousel controller
   ========================================================= */

function initSaralCarousel() {
  var root = document.querySelector('[data-saral-carousel]');
  if (!root) return;

  var frame = root.querySelector('.saral-carousel-frame');

  var slides = Array.prototype.slice.call(
    root.querySelectorAll('[data-sr-slide]')
  );

  if (!slides.length) return;

  /* =======================================================
     FIND / CREATE CONTROLS
     ======================================================= */

  var controls = root.querySelector('.saral-carousel-controls');

  /*
     Agar controls HTML me nahi hai,
     JS automatically create karega.
  */
  if (!controls) {
    controls = document.createElement('div');
    controls.className = 'saral-carousel-controls';

    root.appendChild(controls);
  }

  /* =======================================================
     FIND / CREATE PREVIOUS BUTTON
     ======================================================= */

  var prevBtn = controls.querySelector('[data-saral-prev]');

  if (!prevBtn) {
    prevBtn = document.createElement('button');

    prevBtn.type = 'button';
    prevBtn.className = 'saral-arrow saral-arrow-prev';
    prevBtn.setAttribute('data-saral-prev', '');
    prevBtn.setAttribute('aria-label', 'Previous slide');

    prevBtn.innerHTML = `
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M10 3 5 8l5 5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    `;

    controls.appendChild(prevBtn);
  }

  /* =======================================================
     FIND / CREATE DOT CONTAINER
     ======================================================= */

  var dotsContainer = controls.querySelector(
    '.saral-carousel-dots'
  );

  if (!dotsContainer) {
    dotsContainer = document.createElement('div');

    dotsContainer.className = 'saral-carousel-dots';
    dotsContainer.setAttribute('role', 'tablist');
    dotsContainer.setAttribute(
      'aria-label',
      'Saral Rojgar interface slides'
    );

    /*
       Put dots after previous button.
    */
    controls.insertBefore(
      dotsContainer,
      controls.children[1] || null
    );
  }

  /* =======================================================
     CREATE DOTS AUTOMATICALLY
     ======================================================= */

  var dots = Array.prototype.slice.call(
    dotsContainer.querySelectorAll('[data-saral-dot]')
  );

  /*
     Agar dots nahi hain,
     slides ke according automatically create karo.
  */
  if (dots.length !== slides.length) {
    dotsContainer.innerHTML = '';

    slides.forEach(function (slide, i) {
      var dot = document.createElement('button');

      dot.type = 'button';
      dot.className = 'saral-dot';

      if (i === 0) {
        dot.classList.add('is-active');
      }

      dot.setAttribute('role', 'tab');
      dot.setAttribute('data-saral-dot', String(i));
      dot.setAttribute(
        'aria-selected',
        i === 0 ? 'true' : 'false'
      );

      var title =
        slide.getAttribute('data-sr-title') ||
        'Slide ' + (i + 1);

      dot.setAttribute(
        'aria-label',
        'Show ' + title + ' slide'
      );

      dotsContainer.appendChild(dot);
    });
  }

  dots = Array.prototype.slice.call(
    dotsContainer.querySelectorAll('[data-saral-dot]')
  );

  /* =======================================================
     COUNTER
     ======================================================= */

  var counterEl = controls.querySelector(
    '[data-saral-current]'
  );

  if (!counterEl) {
    var count = document.createElement('span');

    count.className = 'saral-carousel-count';
    count.setAttribute('aria-hidden', 'true');

    count.innerHTML = `
      <span data-saral-current>01</span>
      <span class="saral-count-sep">/</span>
      ${slides.length < 10 ? '0' + slides.length : slides.length}
    `;

    /*
       Counter ko dots ke baad insert karo.
    */
    controls.insertBefore(
      count,
      controls.children[controls.children.length - 0] || null
    );

    counterEl = count.querySelector(
      '[data-saral-current]'
    );
  }

  /*
     Existing counter ho to total slides update karo.
  */
  var existingTotal = controls.querySelector(
    '.saral-count-sep'
  );

  if (existingTotal) {
    var parent = existingTotal.parentElement;

    parent.innerHTML = `
      <span data-saral-current>01</span>
      <span class="saral-count-sep">/</span>
      ${slides.length < 10 ? '0' + slides.length : slides.length}
    `;

    counterEl = parent.querySelector(
      '[data-saral-current]'
    );
  }

  /* =======================================================
     NEXT BUTTON
     ======================================================= */

  var nextBtn = controls.querySelector('[data-saral-next]');

  if (!nextBtn) {
    nextBtn = document.createElement('button');

    nextBtn.type = 'button';
    nextBtn.className = 'saral-arrow saral-arrow-next';
    nextBtn.setAttribute('data-saral-next', '');
    nextBtn.setAttribute('aria-label', 'Next slide');

    nextBtn.innerHTML = `
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M6 3l5 5-5 5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    `;

    controls.appendChild(nextBtn);
  }

  /* =======================================================
     LIVE REGION
     ======================================================= */

  var liveEl = root.querySelector('[data-saral-live]');

  if (!liveEl) {
    liveEl = document.createElement('span');

    liveEl.className = 'saral-visually-hidden';
    liveEl.setAttribute('role', 'status');
    liveEl.setAttribute('aria-live', 'polite');
    liveEl.setAttribute('data-saral-live', '');

    root.appendChild(liveEl);
  }

  /* =======================================================
     VARIABLES
     ======================================================= */

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
     GO TO SLIDE
     ======================================================= */

  function goTo(nextIndex, silent) {
    index =
      (nextIndex + slides.length) %
      slides.length;

    slides.forEach(function (slide, i) {
      var isActive = i === index;

      slide.classList.toggle(
        'is-active',
        isActive
      );

      slide.setAttribute(
        'aria-hidden',
        isActive ? 'false' : 'true'
      );

      setSlideFocusability(
        slide,
        isActive
      );
    });

    /* ---------- Dots ---------- */

    dots.forEach(function (dot, i) {
      var isActive = i === index;

      dot.classList.toggle(
        'is-active',
        isActive
      );

      dot.setAttribute(
        'aria-selected',
        isActive ? 'true' : 'false'
      );
    });

    /* ---------- Counter ---------- */

    if (counterEl) {
      var current = String(index + 1);

      counterEl.textContent =
        current.length < 2
          ? '0' + current
          : current;
    }

    /* ---------- Screen reader ---------- */

    if (liveEl && !silent) {
      var title =
        slides[index].getAttribute(
          'data-sr-title'
        ) ||
        'Slide ' + (index + 1);

      liveEl.textContent =
        title +
        ' — slide ' +
        (index + 1) +
        ' of ' +
        slides.length;
    }
  }

  /* =======================================================
     NAVIGATION
     ======================================================= */

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  /* =======================================================
     NOTE: Saral Rojgar is manual-navigation only — no
     autoplay by design, so there is no timer/interval here.
     ======================================================= */

  /* =======================================================
     PREVIOUS
     ======================================================= */

  prevBtn.addEventListener('click', function () {
    prev();
  });

  /* =======================================================
     NEXT
     ======================================================= */

  nextBtn.addEventListener('click', function () {
    next();
  });

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

  root.addEventListener(
    'keydown',
    function (e) {
      if (e.key === 'ArrowRight') {
        next();
        e.preventDefault();
      }

      if (e.key === 'ArrowLeft') {
        prev();
        e.preventDefault();
      }
    }
  );

  /* =======================================================
     TOUCH SWIPE
     ======================================================= */

  if (frame) {
    var touchStartX = null;

    frame.addEventListener(
      'touchstart',
      function (e) {
        touchStartX =
          e.touches[0].clientX;
      },
      { passive: true }
    );

    frame.addEventListener(
      'touchend',
      function (e) {
        if (touchStartX === null) return;

        var dx =
          e.changedTouches[0].clientX -
          touchStartX;

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
     INITIALIZE
     ======================================================= */

  goTo(0, true);
}


/* =========================================================
   GLOBAL EXPOSE
   ========================================================= */

if (typeof window !== 'undefined') {
  window.initSaralCarousel =
    initSaralCarousel;
}