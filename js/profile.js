/**
 * HSHS Profile photo — click + drag-and-drop upload
 */
(function () {
  "use strict";
  var PROFILE_KEY = "hshs-profile-photo";
  var MAX_SIZE = 2 * 1024 * 1024;

  function toast(msg, type) {
    if (window.HSHSAuth && typeof window.showToast === "function") {
      /* no-op */
    }
    var c = document.getElementById("hshs-toast-container");
    if (!c) {
      c = document.createElement("div");
      c.id = "hshs-toast-container";
      c.style.cssText = "position:fixed;bottom:1.5rem;right:1.5rem;z-index:10000;display:flex;flex-direction:column;gap:0.5rem;pointer-events:none";
      document.body.appendChild(c);
    }
    var t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText = "background:" + (type === "error" ? "#b91c1c" : "#15803d") + ";color:#fff;padding:0.75rem 1.1rem;border-radius:12px;font-size:0.9rem;font-weight:500;box-shadow:0 10px 25px rgba(0,0,0,.25);opacity:0;transform:translateY(12px);transition:0.3s";
    c.appendChild(t);
    requestAnimationFrame(function () { t.style.opacity = "1"; t.style.transform = "none"; });
    setTimeout(function () { t.style.opacity = "0"; setTimeout(function () { t.remove(); }, 300); }, 2600);
  }

  function applyPhoto(dataUrl) {
    localStorage.setItem(PROFILE_KEY, dataUrl);
    document.querySelectorAll("#profilePreview, .settings-profile-preview").forEach(function (img) {
      img.src = dataUrl;
      img.hidden = false;
      img.removeAttribute("hidden");
    });
    document.querySelectorAll("#profilePlaceholder").forEach(function (el) {
      el.hidden = true;
    });
    window.dispatchEvent(new CustomEvent("hshs:profile", { detail: { photo: dataUrl } }));
  }

  function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      toast("Please choose an image file", "error");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast("Image must be under 2 MB", "error");
      return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      applyPhoto(reader.result);
      toast("Profile photo updated", "success");
    };
    reader.readAsDataURL(file);
  }

  function initHeaderProfile() {
    var input = document.getElementById("profileUpload");
    var btn = document.getElementById("profileBtn");
    var preview = document.getElementById("profilePreview");
    var placeholder = document.getElementById("profilePlaceholder");
    var wrap = document.querySelector(".profile-upload-wrap");
    if (!btn) return;

    var saved = localStorage.getItem(PROFILE_KEY);
    if (saved && preview) {
      preview.src = saved;
      preview.hidden = false;
      if (placeholder) placeholder.hidden = true;
    }

    if (wrap && !wrap.querySelector(".profile-drop-hint")) {
      var hint = document.createElement("span");
      hint.className = "profile-drop-hint";
      hint.textContent = "Click or drop photo";
      wrap.appendChild(hint);
    }

    if (input) {
      btn.addEventListener("click", function () { input.click(); });
      input.addEventListener("change", function () {
        if (input.files && input.files[0]) handleFile(input.files[0]);
        input.value = "";
      });
    }

    // Drag and drop on profile button
    ["dragenter", "dragover"].forEach(function (ev) {
      btn.addEventListener(ev, function (e) {
        e.preventDefault();
        e.stopPropagation();
        btn.classList.add("is-dragover");
      });
    });
    ["dragleave", "drop"].forEach(function (ev) {
      btn.addEventListener(ev, function (e) {
        e.preventDefault();
        e.stopPropagation();
        btn.classList.remove("is-dragover");
      });
    });
    btn.addEventListener("drop", function (e) {
      var files = e.dataTransfer && e.dataTransfer.files;
      if (files && files[0]) handleFile(files[0]);
    });
  }

  window.HSHSProfile = {
    applyPhoto: applyPhoto,
    handleFile: handleFile,
    getPhoto: function () { return localStorage.getItem(PROFILE_KEY); },
    clear: function () {
      localStorage.removeItem(PROFILE_KEY);
      document.querySelectorAll("#profilePreview").forEach(function (img) {
        img.src = "";
        img.hidden = true;
      });
      document.querySelectorAll("#profilePlaceholder").forEach(function (el) {
        el.hidden = false;
      });
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeaderProfile);
  } else {
    initHeaderProfile();
  }
})();
