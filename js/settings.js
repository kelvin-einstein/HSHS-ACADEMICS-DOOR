/**
 * HSHS Settings panel — theme, profile, notifications, data
 * Accent colour picker removed for a single clear professional palette.
 */
(function () {
  "use strict";

  var NOTIF_KEY = "hshs-notifications";
  var COMPACT_KEY = "hshs-compact";
  var REDUCE_MOTION_KEY = "hshs-reduce-motion";

  function toast(msg, type) {
    var c = document.getElementById("hshs-toast-container");
    if (!c) {
      c = document.createElement("div");
      c.id = "hshs-toast-container";
      c.style.cssText = "position:fixed;bottom:1.5rem;right:1.5rem;z-index:10000;display:flex;flex-direction:column;gap:0.5rem;pointer-events:none";
      document.body.appendChild(c);
    }
    var t = document.createElement("div");
    t.textContent = msg;
    var bg = type === "error" ? "#b91c1c" : type === "info" ? "#1d4ed8" : "#15803d";
    t.style.cssText = "background:" + bg + ";color:#fff;padding:0.75rem 1.1rem;border-radius:12px;font-size:0.9rem;font-weight:500;box-shadow:0 10px 25px rgba(0,0,0,.25);opacity:0;transform:translateY(12px);transition:0.3s";
    c.appendChild(t);
    requestAnimationFrame(function () { t.style.opacity = "1"; t.style.transform = "none"; });
    setTimeout(function () { t.style.opacity = "0"; setTimeout(function () { t.remove(); }, 300); }, 2600);
  }

  function getBool(key, fallback) {
    var v = localStorage.getItem(key);
    if (v === null) return fallback;
    return v === "1" || v === "true";
  }

  function ensureStyles() {
    if (document.getElementById("hshs-enhancements-css")) return;
    var link = document.createElement("link");
    link.id = "hshs-enhancements-css";
    link.rel = "stylesheet";
    link.href = "css/enhancements.css";
    document.head.appendChild(link);
  }

  function injectSettingsUI() {
    if (document.getElementById("settingsOverlay")) return;

    var actions = document.querySelector(".header-actions");
    if (actions && !document.getElementById("settingsBtn")) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "settings-btn";
      btn.id = "settingsBtn";
      btn.title = "Settings";
      btn.setAttribute("aria-label", "Open settings");
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
      var themeBtn = document.getElementById("themeToggle");
      if (themeBtn) actions.insertBefore(btn, themeBtn);
      else actions.insertBefore(btn, actions.firstChild);
    }

    var overlay = document.createElement("div");
    overlay.className = "settings-overlay";
    overlay.id = "settingsOverlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", "Settings");
    overlay.innerHTML =
      '<div class="settings-panel">' +
      '  <div class="settings-panel-header">' +
      '    <h2>Settings</h2>' +
      '    <button type="button" class="settings-close" id="settingsClose" aria-label="Close settings">' +
      '      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
      '    </button>' +
      '  </div>' +
      '  <div class="settings-body">' +
      '    <div class="settings-section">' +
      '      <h3>Profile photo</h3>' +
      '      <div class="settings-profile-drop" id="settingsProfileDrop" tabindex="0" role="button" aria-label="Upload profile photo">' +
      '        <img class="settings-profile-preview" id="settingsProfilePreview" alt="" hidden />' +
      '        <p>Drag & drop a photo here<br/>or click to browse</p>' +
      '      </div>' +
      '      <input type="file" id="settingsProfileInput" accept="image/*" class="visually-hidden" />' +
      '      <div class="settings-row" style="margin-top:0.75rem">' +
      '        <div><div class="settings-row-label">Remove photo</div></div>' +
      '        <button type="button" class="btn btn-outline btn-sm" id="settingsClearPhoto">Clear</button>' +
      '      </div>' +
      '    </div>' +
      '    <div class="settings-section">' +
      '      <h3>Appearance</h3>' +
      '      <div class="settings-row">' +
      '        <div><div class="settings-row-label">Dark mode</div><div class="settings-row-desc">Toggle light / dark theme</div></div>' +
      '        <button type="button" class="settings-toggle" id="settingsDarkToggle" aria-label="Toggle dark mode"></button>' +
      '      </div>' +
      '      <div class="settings-row">' +
      '        <div><div class="settings-row-label">Reduce motion</div><div class="settings-row-desc">Minimise animations</div></div>' +
      '        <button type="button" class="settings-toggle" id="settingsMotionToggle" aria-label="Reduce motion"></button>' +
      '      </div>' +
      '      <div class="settings-row">' +
      '        <div><div class="settings-row-label">Compact mode</div><div class="settings-row-desc">Tighter spacing</div></div>' +
      '        <button type="button" class="settings-toggle" id="settingsCompactToggle" aria-label="Compact mode"></button>' +
      '      </div>' +
      '    </div>' +
      '    <div class="settings-section">' +
      '      <h3>Notifications</h3>' +
      '      <div class="settings-row">' +
      '        <div><div class="settings-row-label">Study reminders</div><div class="settings-row-desc">Exam countdown alerts</div></div>' +
      '        <button type="button" class="settings-toggle" id="settingsNotifToggle" aria-label="Notifications"></button>' +
      '      </div>' +
      '    </div>' +
      '    <div class="settings-section">' +
      '      <h3>Account & data</h3>' +
      '      <div class="settings-row">' +
      '        <div><div class="settings-row-label">Export my data</div><div class="settings-row-desc">Download comments & chats JSON</div></div>' +
      '        <button type="button" class="btn btn-outline btn-sm" id="settingsExport">Export</button>' +
      '      </div>' +
      '      <div class="settings-row">' +
      '        <div><div class="settings-row-label">Clear chat history</div></div>' +
      '        <button type="button" class="btn btn-outline btn-sm" id="settingsClearChats">Clear</button>' +
      '      </div>' +
      '      <div class="settings-row">' +
      '        <div><div class="settings-row-label">Clear comments</div></div>' +
      '        <button type="button" class="btn btn-outline btn-sm" id="settingsClearComments">Clear</button>' +
      '      </div>' +
      '      <div class="settings-row">' +
      '        <div><div class="settings-row-label">Sign out</div></div>' +
      '        <button type="button" class="btn btn-outline btn-sm" id="settingsLogout">Log out</button>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div>';
    document.body.appendChild(overlay);
  }

  function openSettings() {
    var o = document.getElementById("settingsOverlay");
    if (o) o.classList.add("is-open");
    syncUI();
  }
  function closeSettings() {
    var o = document.getElementById("settingsOverlay");
    if (o) o.classList.remove("is-open");
  }

  function syncUI() {
    var theme = document.documentElement.getAttribute("data-theme") || "light";
    var darkBtn = document.getElementById("settingsDarkToggle");
    if (darkBtn) darkBtn.classList.toggle("is-on", theme === "dark");

    var notif = document.getElementById("settingsNotifToggle");
    if (notif) notif.classList.toggle("is-on", getBool(NOTIF_KEY, true));
    var motion = document.getElementById("settingsMotionToggle");
    if (motion) motion.classList.toggle("is-on", getBool(REDUCE_MOTION_KEY, false));
    var compact = document.getElementById("settingsCompactToggle");
    if (compact) compact.classList.toggle("is-on", getBool(COMPACT_KEY, false));

    var photo = localStorage.getItem("hshs-profile-photo");
    var prev = document.getElementById("settingsProfilePreview");
    if (prev) {
      if (photo) {
        prev.src = photo;
        prev.hidden = false;
      } else {
        prev.hidden = true;
        prev.removeAttribute("src");
      }
    }
  }

  function applyReduceMotion(on) {
    localStorage.setItem(REDUCE_MOTION_KEY, on ? "1" : "0");
    document.documentElement.classList.toggle("reduce-motion", on);
    if (on) {
      var style = document.getElementById("hshs-reduce-motion-style");
      if (!style) {
        style = document.createElement("style");
        style.id = "hshs-reduce-motion-style";
        style.textContent = ".reduce-motion *, .reduce-motion *::before, .reduce-motion *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }";
        document.head.appendChild(style);
      }
    }
  }

  function applyCompact(on) {
    localStorage.setItem(COMPACT_KEY, on ? "1" : "0");
    document.documentElement.classList.toggle("compact-mode", on);
    var style = document.getElementById("hshs-compact-style");
    if (on && !style) {
      style = document.createElement("style");
      style.id = "hshs-compact-style";
      style.textContent = ".compact-mode section { padding-block: 2.5rem; } .compact-mode .card { padding: 1.1rem; } .compact-mode .header-inner { block-size: 64px; }";
      document.head.appendChild(style);
    }
  }

  function wire() {
    ensureStyles();
    injectSettingsUI();

    // Always use the single clear default palette (no accent switching)
    document.documentElement.removeAttribute("data-accent");
    localStorage.removeItem("hshs-accent");

    if (getBool(REDUCE_MOTION_KEY, false)) applyReduceMotion(true);
    if (getBool(COMPACT_KEY, false)) applyCompact(true);

    document.getElementById("settingsBtn") && document.getElementById("settingsBtn").addEventListener("click", openSettings);
    document.getElementById("settingsClose") && document.getElementById("settingsClose").addEventListener("click", closeSettings);
    document.getElementById("settingsOverlay") && document.getElementById("settingsOverlay").addEventListener("click", function (e) {
      if (e.target.id === "settingsOverlay") closeSettings();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeSettings();
    });

    document.getElementById("settingsDarkToggle") && document.getElementById("settingsDarkToggle").addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme") || "light";
      var next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("hshs-theme", next);
      this.classList.toggle("is-on", next === "dark");
      toast(next === "dark" ? "Dark mode on" : "Light mode on", "info");
    });

    document.getElementById("settingsMotionToggle") && document.getElementById("settingsMotionToggle").addEventListener("click", function () {
      var on = !this.classList.contains("is-on");
      this.classList.toggle("is-on", on);
      applyReduceMotion(on);
      toast(on ? "Motion reduced" : "Motion restored", "info");
    });
    document.getElementById("settingsCompactToggle") && document.getElementById("settingsCompactToggle").addEventListener("click", function () {
      var on = !this.classList.contains("is-on");
      this.classList.toggle("is-on", on);
      applyCompact(on);
      toast(on ? "Compact mode on" : "Comfortable spacing", "info");
    });
    document.getElementById("settingsNotifToggle") && document.getElementById("settingsNotifToggle").addEventListener("click", function () {
      var on = !this.classList.contains("is-on");
      this.classList.toggle("is-on", on);
      localStorage.setItem(NOTIF_KEY, on ? "1" : "0");
      toast(on ? "Reminders enabled" : "Reminders off", "info");
    });

    var drop = document.getElementById("settingsProfileDrop");
    var input = document.getElementById("settingsProfileInput");
    if (drop && input) {
      drop.addEventListener("click", function () { input.click(); });
      input.addEventListener("change", function () {
        if (input.files && input.files[0] && window.HSHSProfile) {
          window.HSHSProfile.handleFile(input.files[0]);
          syncUI();
        }
        input.value = "";
      });
      ["dragenter", "dragover"].forEach(function (ev) {
        drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("is-dragover"); });
      });
      ["dragleave", "drop"].forEach(function (ev) {
        drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("is-dragover"); });
      });
      drop.addEventListener("drop", function (e) {
        var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f && window.HSHSProfile) {
          window.HSHSProfile.handleFile(f);
          syncUI();
        }
      });
    }
    document.getElementById("settingsClearPhoto") && document.getElementById("settingsClearPhoto").addEventListener("click", function () {
      if (window.HSHSProfile) window.HSHSProfile.clear();
      syncUI();
      toast("Profile photo removed", "info");
    });

    document.getElementById("settingsExport") && document.getElementById("settingsExport").addEventListener("click", function () {
      var data = {
        comments: JSON.parse(localStorage.getItem("hshs-comments") || "[]"),
        chats: JSON.parse(localStorage.getItem("hshs-chats") || "[]"),
        session: JSON.parse(localStorage.getItem("hshs-session") || "null"),
        exportedAt: new Date().toISOString()
      };
      var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "hshs-data-export.json";
      a.click();
      URL.revokeObjectURL(a.href);
      toast("Data exported", "success");
    });
    document.getElementById("settingsClearChats") && document.getElementById("settingsClearChats").addEventListener("click", function () {
      if (!confirm("Clear all saved chat history?")) return;
      localStorage.removeItem("hshs-chats");
      toast("Chat history cleared", "info");
    });
    document.getElementById("settingsClearComments") && document.getElementById("settingsClearComments").addEventListener("click", function () {
      if (!confirm("Clear all comments?")) return;
      localStorage.removeItem("hshs-comments");
      toast("Comments cleared", "info");
      if (typeof window.renderComments === "function") window.renderComments();
      else location.reload();
    });
    document.getElementById("settingsLogout") && document.getElementById("settingsLogout").addEventListener("click", function () {
      if (window.HSHSAuth && typeof window.HSHSAuth.logout === "function") {
        window.HSHSAuth.logout();
      } else {
        localStorage.removeItem("hshs-session");
        location.reload();
      }
      closeSettings();
      toast("Signed out", "info");
    });

    window.addEventListener("hshs:profile", syncUI);
  }

  window.HSHSSettings = { open: openSettings, close: closeSettings };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
  else wire();
})();
