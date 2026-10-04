/**
 * HSHS resource actions — Download, Preview, Save
 */
(function () {
  function toast(msg, type) {
    let c = document.getElementById("hshs-toast-container");
    if (!c) {
      c = document.createElement("div");
      c.id = "hshs-toast-container";
      c.style.cssText = "position:fixed;bottom:1.5rem;right:1.5rem;z-index:10000;display:flex;flex-direction:column;gap:0.5rem;pointer-events:none";
      document.body.appendChild(c);
    }
    const t = document.createElement("div");
    t.textContent = msg;
    const bg = type === "error" ? "#b91c1c" : type === "info" ? "#1d4ed8" : "#15803d";
    t.style.cssText = "background:" + bg + ";color:#fff;padding:0.75rem 1.1rem;border-radius:12px;font-size:0.9rem;font-weight:500;box-shadow:0 10px 25px rgba(0,0,0,.25);opacity:0;transform:translateY(12px);transition:0.3s";
    c.appendChild(t);
    requestAnimationFrame(function () { t.style.opacity = "1"; t.style.transform = "none"; });
    setTimeout(function () { t.style.opacity = "0"; setTimeout(function () { t.remove(); }, 300); }, 2800);
  }

  function enhanceCards() {
    document.querySelectorAll(".paper-actions .btn-primary").forEach(function (btn) {
      if (btn.dataset.wired) return;
      btn.dataset.wired = "1";
      var isDownload = /download/i.test(btn.textContent);
      var isView = /view/i.test(btn.textContent);
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var card = btn.closest(".paper-card, .card");
        var title = card ? (card.querySelector("h3") || {}).textContent || "Resource" : "Resource";
        if (isDownload) {
          toast('Downloading "' + title + '"…', "success");
          var blob = new Blob(["HSHS Academics Door\n\n" + title + "\n\n(Demo download — replace with real PDF in production.)\n"], { type: "text/plain" });
          var a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = title.replace(/\s+/g, "_") + ".txt";
          a.click();
          URL.revokeObjectURL(a.href);
        } else if (isView) {
          if (window.HSHSAdvanced && window.HSHSAdvanced.openViewer) {
            window.HSHSAdvanced.openViewer({ title: title, kind: "note" });
          } else {
            toast('Opening "' + title + '"', "info");
          }
        }
      });
    });
    document.querySelectorAll(".paper-actions .btn-outline").forEach(function (btn) {
      if (btn.dataset.wired) return;
      btn.dataset.wired = "1";
      var isPreview = /preview/i.test(btn.textContent);
      var isSave = /save/i.test(btn.textContent);
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var card = btn.closest(".paper-card, .card");
        var title = card ? (card.querySelector("h3") || {}).textContent || "Resource" : "Resource";
        if (isPreview) {
          if (window.HSHSAdvanced && window.HSHSAdvanced.openViewer) {
            window.HSHSAdvanced.openViewer({ title: title, kind: "paper" });
          } else {
            toast('Preview: "' + title + '"', "info");
          }
        } else if (isSave) {
          var key = "hshs-saved-notes";
          var list = [];
          try { list = JSON.parse(localStorage.getItem(key)) || []; } catch (err) {}
          if (!list.find(function (x) { return x.title === title; })) {
            list.push({ title: title, savedAt: new Date().toISOString() });
            localStorage.setItem(key, JSON.stringify(list));
            toast('Saved "' + title + '"', "success");
          } else {
            toast("Already saved", "info");
          }
        }
      });
    });
  }

  function boot() {
    enhanceCards();
    var obs = new MutationObserver(function () { enhanceCards(); });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
