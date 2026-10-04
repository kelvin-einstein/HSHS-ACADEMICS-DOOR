/**
 * HSHS welcome: loading screen + curtain open + home reveal animations
 */
(function () {
  "use strict";

  var LOADER_MS = 900;
  var CURTAIN_DELAY = 200;
  var CURTAIN_MS = 1200;

  function prefersReduced() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function ensureMarkup() {
    if (!document.getElementById("siteLoader")) {
      var loader = document.createElement("div");
      loader.id = "siteLoader";
      loader.className = "site-loader";
      loader.setAttribute("role", "status");
      loader.setAttribute("aria-live", "polite");
      loader.innerHTML =
        '<div class="site-loader-ring" aria-hidden="true"></div>' +
        '<div class="site-loader-text">Loading Academics Door</div>' +
        '<div class="site-loader-bar" aria-hidden="true"><span></span></div>';
      document.body.prepend(loader);
    }
    if (!document.getElementById("siteCurtains")) {
      var curtains = document.createElement("div");
      curtains.id = "siteCurtains";
      curtains.className = "site-curtains";
      curtains.setAttribute("aria-hidden", "true");
      curtains.innerHTML =
        '<div class="curtain curtain-left"></div>' +
        '<div class="curtain curtain-right"></div>';
      document.body.prepend(curtains);
    }
  }

  function runIntro() {
    ensureMarkup();
    document.body.classList.add("is-intro-locked");

    var loader = document.getElementById("siteLoader");
    var curtains = document.getElementById("siteCurtains");

    if (prefersReduced()) {
      if (loader) loader.classList.add("is-done");
      if (curtains) curtains.classList.add("is-open");
      document.body.classList.remove("is-intro-locked");
      return;
    }

    // Only play full curtains on home page
    var isHome = /index\.html?$/.test(location.pathname) || location.pathname.endsWith("/") || location.pathname === "" || !location.pathname.split("/").pop();

    setTimeout(function () {
      if (loader) loader.classList.add("is-done");
      setTimeout(function () {
        if (curtains && isHome) curtains.classList.add("is-open");
        else if (curtains) curtains.classList.add("is-open");
        setTimeout(function () {
          document.body.classList.remove("is-intro-locked");
          if (curtains) {
            setTimeout(function () {
              curtains.style.display = "none";
            }, 100);
          }
        }, isHome ? CURTAIN_MS : 400);
      }, CURTAIN_DELAY);
    }, LOADER_MS);
  }

  function wireReveal() {
    var nodes = document.querySelectorAll(
      ".cards-grid .card, .papers-grid .paper-card, .notes-grid .paper-card, .subjects-grid .subject-card, .planner-card, .showcase-grid > *, .rec-row > *, .community-stat, .chart-card, .learn-feature, .course-card"
    );
    nodes.forEach(function (el, i) {
      el.classList.add("reveal-ai");
      el.style.transitionDelay = (i % 8) * 0.05 + "s";
    });
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    nodes.forEach(function (el) { io.observe(el); });
  }

  function init() {
    runIntro();
    wireReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
