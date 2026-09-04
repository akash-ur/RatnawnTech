/* =========================================================
   include.js
   Loads shared/section HTML fragments (declared via
   data-include="path/to/file.html" in each page) and injects
   them into the DOM, so the same header/footer/section
   markup can be reused across the Home Page and every
   standalone page under /pages/<name>/index.html.

   PATH AWARENESS:
   The project has exactly two levels a page can live at:
     - the site root:            /index.html
     - a standalone subpage:     /pages/<name>/index.html
   Files referenced by data-include (e.g. "sections/header.html"
   from root, or "../../sections/header.html" from a subpage)
   are always given as the correct relative path for that
   specific file already, so fetch() just works as-is.

   ROOT-TOKEN RESOLUTION:
   sections/header.html and sections/footer.html are injected
   at BOTH depths, so their own internal links (Home, Vocalis,
   About, Contact, etc.) can't hardcode a single relative path.
   Those links use a "{{ROOT}}" placeholder instead
   (e.g. href="{{ROOT}}pages/vocalis/index.html"), and this
   file resolves that placeholder to "" at the site root or
   "../../" inside /pages/<name>/index.html, based on the
   current page's URL, before the fragment is injected.

   IMPORTANT: fetch() needs pages to be served over http(s).
   Opening index.html directly by double-clicking it (file://)
   will NOT load the sections due to browser CORS rules.
   Run a local server instead, e.g.:
     python -m http.server 8000
   then open http://localhost:8000/index.html
   (Deploying to Vercel/Netlify/GitHub Pages works fine too,
   since those always serve over http(s).)
   ========================================================= */

function getRootPrefix() {
  // Any page living under /pages/<name>/index.html is two
  // directories below the project root; every other page
  // (currently just /index.html) IS the project root.
  return window.location.pathname.indexOf('/pages/') !== -1 ? '../../' : '';
}

document.addEventListener('DOMContentLoaded', function () {
  var placeholders = document.querySelectorAll('[data-include]');
  var rootPrefix = getRootPrefix();

  var loaders = Array.prototype.map.call(placeholders, function (el) {
    var file = el.getAttribute('data-include');
    return fetch(file)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load ' + file);
        return res.text();
      })
      .then(function (html) {
        // Resolve {{ROOT}} in shared fragments (header/footer)
        // to the correct relative prefix for this page's depth.
        el.outerHTML = html.split('{{ROOT}}').join(rootPrefix);
      })
      .catch(function (err) {
        console.error(err);
        el.outerHTML = '<!-- failed to load ' + file + ' -->';
      });
  });

  Promise.all(loaders).then(function () {
    // Now that every section's real markup exists in the DOM,
    // wire up the interactive bits that depend on it.
    if (typeof initHeader === 'function') initHeader();
    if (typeof initMain === 'function') initMain();
  });
});
