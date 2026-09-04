/* =========================================================
   header.js
   RatNawn Tech — Header interactions

   - Scroll-based floating navbar animation
   - Mobile hamburger menu
   - Desktop dropdown support
   - Dark / Light mode
   - Theme preference saved in localStorage
   ========================================================= */


/* =========================================================
   1. HEADER INITIALIZATION
   ========================================================= */

function initHeader() {

  const header = document.querySelector('.site-header');
  const menuBtn = document.getElementById('menu-btn');
  const mobileNav = document.getElementById('mobile-nav');


  /* =======================================================
     2. SCROLL NAVBAR ANIMATION
     ======================================================= */

  if (header && !header.dataset.scrollBound) {

    header.dataset.scrollBound = 'true';

    let ticking = false;

    function updateHeader() {

      const scrollY = window.scrollY;

      if (scrollY > 45) {

        header.classList.add('is-scrolled');

      } else {

        header.classList.remove('is-scrolled');

      }

      ticking = false;
    }


    window.addEventListener(
      'scroll',
      () => {

        if (!ticking) {

          window.requestAnimationFrame(updateHeader);

          ticking = true;

        }

      },
      { passive: true }
    );


    /* Initial state */

    updateHeader();

  }


  /* =======================================================
     3. MOBILE MENU
     ======================================================= */

  if (
    menuBtn &&
    mobileNav &&
    !menuBtn.dataset.bound
  ) {

    menuBtn.dataset.bound = 'true';


    menuBtn.addEventListener('click', () => {

      const isOpen =
        mobileNav.classList.toggle('open');


      menuBtn.setAttribute(
        'aria-expanded',
        String(isOpen)
      );


      document.body.classList.toggle(
        'mobile-menu-open',
        isOpen
      );

    });


    /* Close mobile menu when link is clicked */

    mobileNav
      .querySelectorAll('a')
      .forEach((link) => {

        link.addEventListener('click', () => {

          mobileNav.classList.remove('open');


          menuBtn.setAttribute(
            'aria-expanded',
            'false'
          );


          document.body.classList.remove(
            'mobile-menu-open'
          );

        });

      });

  }


  /* =======================================================
     4. DESKTOP DROPDOWN
     ======================================================= */

  document
    .querySelectorAll('.has-dropdown')
    .forEach((item) => {

      const toggle =
        item.querySelector('.nav-toggle');


      if (
        !toggle ||
        toggle.dataset.bound
      ) {

        return;

      }


      toggle.dataset.bound = 'true';


      toggle.addEventListener(
        'click',
        (event) => {

          event.preventDefault();
          event.stopPropagation();


          const expanded =
            toggle.getAttribute(
              'aria-expanded'
            ) === 'true';


          /* Close all other dropdowns */

          document
            .querySelectorAll('.nav-toggle')
            .forEach((otherToggle) => {

              if (
                otherToggle !== toggle
              ) {

                otherToggle.setAttribute(
                  'aria-expanded',
                  'false'
                );


                otherToggle
                  .closest('.has-dropdown')
                  ?.classList.remove(
                    'dropdown-open'
                  );

              }

            });


          /* Toggle current dropdown */

          toggle.setAttribute(
            'aria-expanded',
            String(!expanded)
          );


          item.classList.toggle(
            'dropdown-open',
            !expanded
          );

        }
      );

    });


  /* =======================================================
     5. CLOSE DROPDOWN OUTSIDE
     ======================================================= */

  if (
    !document.body.dataset.dropdownOutsideClickBound
  ) {

    document.body.dataset.dropdownOutsideClickBound =
      'true';


    document.addEventListener(
      'click',
      (event) => {

        if (
          !event.target.closest(
            '.has-dropdown'
          )
        ) {

          document
            .querySelectorAll('.nav-toggle')
            .forEach((toggle) => {

              toggle.setAttribute(
                'aria-expanded',
                'false'
              );

            });


          document
            .querySelectorAll('.has-dropdown')
            .forEach((item) => {

              item.classList.remove(
                'dropdown-open'
              );

            });

        }

      }
    );

  }


  /* =======================================================
     6. ESC KEY
     ======================================================= */

  if (
    !document.body.dataset.escapeBound
  ) {

    document.body.dataset.escapeBound =
      'true';


    document.addEventListener(
      'keydown',
      (event) => {

        if (event.key !== 'Escape') {

          return;

        }


        /* Close dropdowns */

        document
          .querySelectorAll('.nav-toggle')
          .forEach((toggle) => {

            toggle.setAttribute(
              'aria-expanded',
              'false'
            );

          });


        document
          .querySelectorAll('.has-dropdown')
          .forEach((item) => {

            item.classList.remove(
              'dropdown-open'
            );

          });


        /* Close mobile menu */

        if (
          mobileNav &&
          menuBtn
        ) {

          mobileNav.classList.remove(
            'open'
          );


          menuBtn.setAttribute(
            'aria-expanded',
            'false'
          );


          document.body.classList.remove(
            'mobile-menu-open'
          );

        }

      }
    );

  }


  /* =======================================================
     7. DARK / LIGHT MODE
     ======================================================= */

  initTheme();

}


/* =========================================================
   8. THEME INITIALIZATION
   ========================================================= */

function initTheme() {

  const themeToggle =
    document.getElementById(
      'theme-toggle'
    );


  /* Button not loaded yet */

  if (!themeToggle) {

    return;

  }


  /* Prevent duplicate initialization */

  if (
    themeToggle.dataset.themeBound === 'true'
  ) {

    return;

  }


  themeToggle.dataset.themeBound =
    'true';


  const html =
    document.documentElement;


  /* =======================================================
     LOAD SAVED THEME
     ======================================================= */

  const savedTheme =
    localStorage.getItem(
      'ratnawn-theme'
    );


  if (
    savedTheme === 'light'
  ) {

    html.classList.add(
      'light-mode'
    );

  } else {

    html.classList.remove(
      'light-mode'
    );

  }


  /* =======================================================
     UPDATE BUTTON
     ======================================================= */

  function updateThemeButton() {

    const isLight =
      html.classList.contains(
        'light-mode'
      );


    if (isLight) {

      themeToggle.setAttribute(
        'aria-label',
        'Switch to dark mode'
      );

      themeToggle.setAttribute(
        'title',
        'Switch to dark mode'
      );

    } else {

      themeToggle.setAttribute(
        'aria-label',
        'Switch to light mode'
      );

      themeToggle.setAttribute(
        'title',
        'Switch to light mode'
      );

    }

  }


  /* Initial button state */

  updateThemeButton();


  /* =======================================================
     THEME TOGGLE CLICK
     ======================================================= */

  themeToggle.addEventListener(
    'click',
    () => {

      const isLight =
        html.classList.toggle(
          'light-mode'
        );


      /* Save selected theme */

      localStorage.setItem(
        'ratnawn-theme',
        isLight
          ? 'light'
          : 'dark'
      );


      /* Update button */

      updateThemeButton();

    }
  );

}


/* =========================================================
   9. DOM READY
   ========================================================= */

document.addEventListener(
  'DOMContentLoaded',
  initHeader
);