/* =========================================================
   header.js
   RatNawn Tech — Header interactions

   - Scroll-based floating navbar
   - Mobile hamburger menu
   - Mobile accordion navigation
   - Desktop dropdown support
   - Dark / Light mode
   - Theme preference saved in localStorage
   - Accessibility support
   ========================================================= */


/* =========================================================
   1. HEADER INITIALIZATION
   ========================================================= */

function initHeader() {

  const header = document.querySelector(".site-header");
  const menuBtn = document.getElementById("menu-btn");
  const mobileNav = document.getElementById("mobile-nav");


  /* =======================================================
     2. SCROLL NAVBAR ANIMATION
     ======================================================= */

  if (header && !header.dataset.scrollBound) {

    header.dataset.scrollBound = "true";

    let ticking = false;

    function updateHeader() {

      const scrollY =
        window.scrollY || window.pageYOffset || 0;

      if (scrollY > 45) {

        header.classList.add("is-scrolled");

      } else {

        header.classList.remove("is-scrolled");

      }

      ticking = false;
    }


    window.addEventListener(
      "scroll",
      () => {

        if (!ticking) {

          window.requestAnimationFrame(
            updateHeader
          );

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

    menuBtn.dataset.bound = "true";


    /* =====================================================
       OPEN MOBILE MENU
       ===================================================== */

    function openMobileMenu() {

      mobileNav.classList.add("open");

      menuBtn.setAttribute(
        "aria-expanded",
        "true"
      );

      menuBtn.setAttribute(
        "aria-label",
        "Close menu"
      );

      menuBtn.setAttribute(
        "title",
        "Close menu"
      );

      document.body.classList.add(
        "mobile-menu-open"
      );

    }


    /* =====================================================
       CLOSE MOBILE MENU
       ===================================================== */

    function closeMobileMenu() {

      mobileNav.classList.remove("open");

      menuBtn.setAttribute(
        "aria-expanded",
        "false"
      );

      menuBtn.setAttribute(
        "aria-label",
        "Open menu"
      );

      menuBtn.setAttribute(
        "title",
        "Open menu"
      );

      document.body.classList.remove(
        "mobile-menu-open"
      );

    }


    /* =====================================================
       TOGGLE MOBILE MENU
       ===================================================== */

    function toggleMobileMenu() {

      const isOpen =
        mobileNav.classList.contains("open");


      if (isOpen) {

        closeMobileMenu();

      } else {

        openMobileMenu();

      }

    }


    /* Hamburger click */

    menuBtn.addEventListener(
      "click",
      toggleMobileMenu
    );


    /* =====================================================
       4. MOBILE NAVIGATION GROUPS
       ===================================================== */

    mobileNav
      .querySelectorAll(".mobile-group")
      .forEach((group) => {

        const groupTitle =
          group.querySelector(":scope > span");

        const submenu =
          group.querySelector(":scope > ul");


        if (
          !groupTitle ||
          !submenu
        ) {

          return;

        }


        /* -------------------------------------------------
           ACCESSIBILITY
           ------------------------------------------------- */

        groupTitle.setAttribute(
          "role",
          "button"
        );

        groupTitle.setAttribute(
          "tabindex",
          "0"
        );

        groupTitle.setAttribute(
          "aria-expanded",
          "false"
        );


        /* -------------------------------------------------
           IMPORTANT:
           ALL SUBMENUS START CLOSED
           ------------------------------------------------- */

        submenu.hidden = true;

        group.classList.remove(
          "is-open"
        );


        /* -------------------------------------------------
           TOGGLE GROUP
           ------------------------------------------------- */

        function toggleGroup() {

          const isOpen =
            groupTitle.getAttribute(
              "aria-expanded"
            ) === "true";


          /* -----------------------------------------------
             CLOSE ALL OTHER GROUPS
             ----------------------------------------------- */

          mobileNav
            .querySelectorAll(".mobile-group")
            .forEach((otherGroup) => {

              if (
                otherGroup === group
              ) {

                return;

              }


              const otherTitle =
                otherGroup.querySelector(
                  ":scope > span"
                );

              const otherSubmenu =
                otherGroup.querySelector(
                  ":scope > ul"
                );


              if (
                otherTitle &&
                otherSubmenu
              ) {

                otherTitle.setAttribute(
                  "aria-expanded",
                  "false"
                );

                otherSubmenu.hidden = true;

                otherGroup.classList.remove(
                  "is-open"
                );

              }

            });


          /* -----------------------------------------------
             OPEN / CLOSE CURRENT GROUP
             ----------------------------------------------- */

          const shouldOpen =
            !isOpen;


          groupTitle.setAttribute(
            "aria-expanded",
            String(shouldOpen)
          );


          submenu.hidden =
            !shouldOpen;


          group.classList.toggle(
            "is-open",
            shouldOpen
          );

        }


        /* -------------------------------------------------
           CLICK
           ------------------------------------------------- */

        groupTitle.addEventListener(
          "click",
          (event) => {

            event.preventDefault();

            toggleGroup();

          }
        );


        /* -------------------------------------------------
           KEYBOARD ACCESSIBILITY
           ------------------------------------------------- */

        groupTitle.addEventListener(
          "keydown",
          (event) => {

            if (
              event.key === "Enter" ||
              event.key === " "
            ) {

              event.preventDefault();

              toggleGroup();

            }

          }
        );

      });


    /* =====================================================
       5. CLOSE MOBILE MENU WHEN LINK IS CLICKED
       ===================================================== */

    mobileNav
      .querySelectorAll("a")
      .forEach((link) => {

        link.addEventListener(
          "click",
          () => {

            closeMobileMenu();

          }
        );

      });


    /* =====================================================
       6. RESET MOBILE MENU WHEN GOING TO DESKTOP
       ===================================================== */

    window.addEventListener(
      "resize",
      () => {

        if (
          window.innerWidth > 980
        ) {

          closeMobileMenu();


          /* Reset all mobile groups */

          mobileNav
            .querySelectorAll(".mobile-group")
            .forEach((group) => {

              const title =
                group.querySelector(
                  ":scope > span"
                );

              const submenu =
                group.querySelector(
                  ":scope > ul"
                );


              if (
                title &&
                submenu
              ) {

                title.setAttribute(
                  "aria-expanded",
                  "false"
                );

                submenu.hidden = true;

                group.classList.remove(
                  "is-open"
                );

              }

            });

        }

      }
    );

  }


  /* =======================================================
     7. DESKTOP DROPDOWNS
     ======================================================= */

  document
    .querySelectorAll(".has-dropdown")
    .forEach((item) => {

      const toggle =
        item.querySelector(".nav-toggle");


      if (
        !toggle ||
        toggle.dataset.bound
      ) {

        return;

      }


      toggle.dataset.bound = "true";


      toggle.addEventListener(
        "click",
        (event) => {

          event.preventDefault();

          event.stopPropagation();


          const expanded =
            toggle.getAttribute(
              "aria-expanded"
            ) === "true";


          /* -----------------------------------------------
             CLOSE OTHER DROPDOWNS
             ----------------------------------------------- */

          document
            .querySelectorAll(".nav-toggle")
            .forEach((otherToggle) => {

              if (
                otherToggle !== toggle
              ) {

                otherToggle.setAttribute(
                  "aria-expanded",
                  "false"
                );


                const otherItem =
                  otherToggle.closest(
                    ".has-dropdown"
                  );


                if (otherItem) {

                  otherItem.classList.remove(
                    "dropdown-open"
                  );

                }

              }

            });


          /* -----------------------------------------------
             CURRENT DROPDOWN
             ----------------------------------------------- */

          const shouldOpen =
            !expanded;


          toggle.setAttribute(
            "aria-expanded",
            String(shouldOpen)
          );


          item.classList.toggle(
            "dropdown-open",
            shouldOpen
          );

        }
      );

    });


  /* =======================================================
     8. CLOSE DESKTOP DROPDOWN OUTSIDE
     ======================================================= */

  if (
    !document.body.dataset.dropdownOutsideClickBound
  ) {

    document.body.dataset.dropdownOutsideClickBound =
      "true";


    document.addEventListener(
      "click",
      (event) => {

        if (
          !event.target.closest(
            ".has-dropdown"
          )
        ) {

          document
            .querySelectorAll(".nav-toggle")
            .forEach((toggle) => {

              toggle.setAttribute(
                "aria-expanded",
                "false"
              );

            });


          document
            .querySelectorAll(".has-dropdown")
            .forEach((item) => {

              item.classList.remove(
                "dropdown-open"
              );

            });

        }

      }
    );

  }


  /* =======================================================
     9. ESC KEY
     ======================================================= */

  if (
    !document.body.dataset.escapeBound
  ) {

    document.body.dataset.escapeBound =
      "true";


    document.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key !== "Escape"
        ) {

          return;

        }


        /* -----------------------------------------------
           CLOSE DESKTOP DROPDOWNS
           ----------------------------------------------- */

        document
          .querySelectorAll(".nav-toggle")
          .forEach((toggle) => {

            toggle.setAttribute(
              "aria-expanded",
              "false"
            );

          });


        document
          .querySelectorAll(".has-dropdown")
          .forEach((item) => {

            item.classList.remove(
              "dropdown-open"
            );

          });


        /* -----------------------------------------------
           CLOSE MOBILE MENU
           ----------------------------------------------- */

        const currentMenuBtn =
          document.getElementById(
            "menu-btn"
          );

        const currentMobileNav =
          document.getElementById(
            "mobile-nav"
          );


        if (
          currentMenuBtn &&
          currentMobileNav
        ) {

          currentMobileNav.classList.remove(
            "open"
          );


          currentMenuBtn.setAttribute(
            "aria-expanded",
            "false"
          );


          currentMenuBtn.setAttribute(
            "aria-label",
            "Open menu"
          );


          currentMenuBtn.setAttribute(
            "title",
            "Open menu"
          );


          document.body.classList.remove(
            "mobile-menu-open"
          );

        }

      }
    );

  }


  /* =======================================================
     10. DARK / LIGHT MODE
     ======================================================= */

  initTheme();

}


/* =========================================================
   11. THEME INITIALIZATION
   ========================================================= */

function initTheme() {

  const themeToggle =
    document.getElementById(
      "theme-toggle"
    );


  if (!themeToggle) {

    return;

  }


  /* Prevent duplicate initialization */

  if (
    themeToggle.dataset.themeBound === "true"
  ) {

    return;

  }


  themeToggle.dataset.themeBound =
    "true";


  const html =
    document.documentElement;


  /* =======================================================
     LOAD SAVED THEME
     ======================================================= */

  const savedTheme =
    localStorage.getItem(
      "ratnawn-theme"
    );


  if (
    savedTheme === "light"
  ) {

    html.classList.add(
      "light-mode"
    );

  } else {

    html.classList.remove(
      "light-mode"
    );

  }


  /* =======================================================
     UPDATE THEME BUTTON
     ======================================================= */

  function updateThemeButton() {

    const isLight =
      html.classList.contains(
        "light-mode"
      );


    if (isLight) {

      themeToggle.setAttribute(
        "aria-label",
        "Switch to dark mode"
      );

      themeToggle.setAttribute(
        "title",
        "Switch to dark mode"
      );

    } else {

      themeToggle.setAttribute(
        "aria-label",
        "Switch to light mode"
      );

      themeToggle.setAttribute(
        "title",
        "Switch to light mode"
      );

    }

  }


  /* Initial state */

  updateThemeButton();


  /* =======================================================
     THEME TOGGLE CLICK
     ======================================================= */

  themeToggle.addEventListener(
    "click",
    () => {

      const isLight =
        html.classList.toggle(
          "light-mode"
        );


      /* Save selected theme */

      localStorage.setItem(
        "ratnawn-theme",
        isLight
          ? "light"
          : "dark"
      );


      /* Update button */

      updateThemeButton();

    }
  );

}


/* =========================================================
   12. DOM READY
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initHeader
);