/**
 * HSHS Academics Door — Authentication
 * Professional Login / Sign Up modal with localStorage session.
 * Designed so it can later be swapped for Firebase / Supabase with minimal changes.
 */
(function () {
  "use strict";

  const USERS_KEY = "hshs-users";
  const SESSION_KEY = "hshs-session";

  const $ = (sel, root = document) => root.querySelector(sel);

  // ---------- Storage ----------
  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch {
      return null;
    }
  }

  function setSession(user) {
    if (!user) {
      localStorage.removeItem(SESSION_KEY);
      return;
    }
    const safe = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
  }

  // ---------- Helpers ----------
  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  function hashPassword(pw) {
    // Simple non-cryptographic hash for demo only.
    // Replace with real backend / Firebase in production.
    let h = 0;
    for (let i = 0; i < pw.length; i++) {
      h = (Math.imul(31, h) + pw.charCodeAt(i)) | 0;
    }
    return "h" + Math.abs(h).toString(16);
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showToast(message, type = "success") {
    let container = $("#hshs-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "hshs-toast-container";
      document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = "hshs-toast hshs-toast--" + type;
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // ---------- Modal HTML + CSS ----------
  function injectStyles() {
    if ($("#hshs-auth-styles")) return;
    const style = document.createElement("style");
    style.id = "hshs-auth-styles";
    style.textContent = `
      #hshs-auth-overlay {
        position: fixed; inset: 0; z-index: 9999;
        background: oklch(0 0 0 / 0.55);
        backdrop-filter: blur(6px);
        display: flex; align-items: center; justify-content: center;
        padding: 1rem; opacity: 0; visibility: hidden;
        transition: opacity 0.25s ease, visibility 0.25s ease;
      }
      #hshs-auth-overlay.open { opacity: 1; visibility: visible; }
      .hshs-auth-card {
        width: min(420px, 100%);
        background: var(--surface, #fff);
        color: var(--text, #0f172a);
        border-radius: 20px;
        box-shadow: 0 25px 50px -12px oklch(0 0 0 / 0.35);
        padding: 1.75rem 1.6rem 1.5rem;
        transform: translateY(12px) scale(0.98);
        transition: transform 0.25s ease;
        border: 1px solid var(--border, oklch(0.9 0 0));
      }
      #hshs-auth-overlay.open .hshs-auth-card { transform: none; }
      [data-theme="dark"] .hshs-auth-card {
        background: oklch(0.22 0.02 260);
        border-color: oklch(1 0 0 / 0.1);
      }
      .hshs-auth-header { text-align: center; margin-bottom: 1.35rem; }
      .hshs-auth-header h2 { font-size: 1.35rem; font-weight: 700; margin: 0 0 0.35rem; }
      .hshs-auth-header p { margin: 0; font-size: 0.9rem; color: var(--text-muted, #64748b); }
      .hshs-auth-tabs {
        display: flex; gap: 0.4rem; background: oklch(0.96 0.01 260);
        padding: 0.3rem; border-radius: 12px; margin-bottom: 1.25rem;
      }
      [data-theme="dark"] .hshs-auth-tabs { background: oklch(0.28 0.02 260); }
      .hshs-auth-tab {
        flex: 1; border: none; background: transparent; padding: 0.55rem;
        border-radius: 9px; font-weight: 600; font-size: 0.9rem;
        cursor: pointer; color: var(--text-muted, #64748b); transition: 0.2s;
      }
      .hshs-auth-tab.active {
        background: var(--primary, #6366f1); color: #fff;
        box-shadow: 0 2px 8px oklch(0.55 0.2 270 / 0.35);
      }
      .hshs-auth-field { margin-bottom: 0.95rem; }
      .hshs-auth-field label {
        display: block; font-size: 0.8rem; font-weight: 600;
        margin-bottom: 0.35rem; color: var(--text-muted, #64748b);
      }
      .hshs-auth-field input {
        width: 100%; padding: 0.7rem 0.85rem; border-radius: 10px;
        border: 1.5px solid var(--border, oklch(0.88 0 0));
        background: var(--bg, #fff); color: inherit; font-size: 0.95rem;
        outline: none; transition: border-color 0.2s, box-shadow 0.2s;
        box-sizing: border-box;
      }
      [data-theme="dark"] .hshs-auth-field input {
        background: oklch(0.18 0.02 260); border-color: oklch(1 0 0 / 0.12);
      }
      .hshs-auth-field input:focus {
        border-color: var(--primary, #6366f1);
        box-shadow: 0 0 0 3px oklch(0.55 0.2 270 / 0.2);
      }
      .hshs-auth-error {
        background: oklch(0.95 0.05 25); color: oklch(0.45 0.18 25);
        border-radius: 10px; padding: 0.65rem 0.85rem; font-size: 0.85rem;
        margin-bottom: 0.9rem; display: none;
      }
      [data-theme="dark"] .hshs-auth-error {
        background: oklch(0.3 0.06 25); color: oklch(0.85 0.08 25);
      }
      .hshs-auth-error.show { display: block; }
      .hshs-auth-submit {
        width: 100%; padding: 0.8rem; border: none; border-radius: 12px;
        background: var(--primary, #6366f1); color: #fff; font-weight: 700;
        font-size: 0.95rem; cursor: pointer; transition: 0.2s;
        margin-top: 0.25rem;
      }
      .hshs-auth-submit:hover { filter: brightness(1.08); }
      .hshs-auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }
      .hshs-auth-close {
        position: absolute; top: 0.9rem; right: 0.9rem;
        width: 36px; height: 36px; border: none; border-radius: 10px;
        background: transparent; font-size: 1.25rem; cursor: pointer;
        color: var(--text-muted, #64748b); display: flex;
        align-items: center; justify-content: center;
      }
      .hshs-auth-close:hover { background: oklch(0 0 0 / 0.06); }
      .hshs-auth-card { position: relative; }
      .hshs-auth-note {
        text-align: center; font-size: 0.78rem; color: var(--text-muted, #64748b);
        margin-top: 1rem; line-height: 1.4;
      }
      /* User chip in header */
      .hshs-user-chip {
        display: inline-flex; align-items: center; gap: 0.5rem;
        padding: 0.3rem 0.55rem 0.3rem 0.3rem; border-radius: 999px;
        background: oklch(0.96 0.02 270); border: 1px solid var(--border, oklch(0.9 0 0));
        font-size: 0.85rem; font-weight: 600; max-width: 180px;
      }
      [data-theme="dark"] .hshs-user-chip {
        background: oklch(0.28 0.03 270); border-color: oklch(1 0 0 / 0.12);
      }
      .hshs-user-chip img, .hshs-user-chip .chip-avatar {
        width: 28px; height: 28px; border-radius: 50%; object-fit: cover;
        background: var(--primary, #6366f1); color: #fff;
        display: flex; align-items: center; justify-content: center;
        font-size: 0.75rem; font-weight: 700; flex-shrink: 0;
      }
      .hshs-user-chip .chip-name {
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      }
      .hshs-logout-btn {
        border: none; background: transparent; cursor: pointer;
        color: var(--text-muted, #64748b); font-size: 0.8rem; padding: 0.2rem;
        border-radius: 6px; line-height: 1;
      }
      .hshs-logout-btn:hover { color: oklch(0.55 0.2 25); }
      /* Toasts */
      #hshs-toast-container {
        position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 10000;
        display: flex; flex-direction: column; gap: 0.5rem; pointer-events: none;
      }
      .hshs-toast {
        background: oklch(0.25 0.03 260); color: #fff; padding: 0.75rem 1.1rem;
        border-radius: 12px; font-size: 0.9rem; font-weight: 500;
        box-shadow: 0 10px 25px oklch(0 0 0 / 0.25);
        opacity: 0; transform: translateY(12px); transition: 0.3s ease;
        max-width: 320px;
      }
      .hshs-toast.show { opacity: 1; transform: none; }
      .hshs-toast--success { background: oklch(0.45 0.14 145); }
      .hshs-toast--error { background: oklch(0.5 0.18 25); }
      .hshs-toast--info { background: oklch(0.45 0.14 250); }
      @media (max-width: 480px) {
        .hshs-user-chip .chip-name { display: none; }
        .hshs-user-chip { padding: 0.25rem; }
      }
    `;
    document.head.appendChild(style);
  }

  function ensureModal() {
    if ($("#hshs-auth-overlay")) return;
    injectStyles();
    const overlay = document.createElement("div");
    overlay.id = "hshs-auth-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "hshs-auth-title");
    overlay.innerHTML = `
      <div class="hshs-auth-card">
        <button type="button" class="hshs-auth-close" id="hshsAuthClose" aria-label="Close">×</button>
        <div class="hshs-auth-header">
          <h2 id="hshs-auth-title">Welcome</h2>
          <p id="hshs-auth-subtitle">Sign in to access your study tools</p>
        </div>
        <div class="hshs-auth-tabs">
          <button type="button" class="hshs-auth-tab active" data-mode="login">Login</button>
          <button type="button" class="hshs-auth-tab" data-mode="signup">Sign Up</button>
        </div>
        <div class="hshs-auth-error" id="hshsAuthError"></div>
        <form id="hshsAuthForm" novalidate>
          <div class="hshs-auth-field" id="hshsNameField" hidden>
            <label for="hshsAuthName">Full name</label>
            <input type="text" id="hshsAuthName" name="name" placeholder="e.g. Jane Amina" autocomplete="name" maxlength="50" />
          </div>
          <div class="hshs-auth-field">
            <label for="hshsAuthEmail">Email</label>
            <input type="email" id="hshsAuthEmail" name="email" placeholder="you@example.com" autocomplete="email" required />
          </div>
          <div class="hshs-auth-field">
            <label for="hshsAuthPassword">Password</label>
            <input type="password" id="hshsAuthPassword" name="password" placeholder="At least 6 characters" autocomplete="current-password" required minlength="6" />
          </div>
          <button type="submit" class="hshs-auth-submit" id="hshsAuthSubmit">Login</button>
        </form>
        <p class="hshs-auth-note">Demo accounts are stored only on this device.<br/>You can later connect real Firebase Authentication.</p>
      </div>
    `;
    document.body.appendChild(overlay);

    // Events
    $("#hshsAuthClose").addEventListener("click", closeModal);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
    });

    overlay.querySelectorAll(".hshs-auth-tab").forEach((tab) => {
      tab.addEventListener("click", () => setMode(tab.dataset.mode));
    });

    $("#hshsAuthForm").addEventListener("submit", onSubmit);
  }

  let currentMode = "login";

  function setMode(mode) {
    currentMode = mode;
    const isSignup = mode === "signup";
    $$(".hshs-auth-tab").forEach((t) => t.classList.toggle("active", t.dataset.mode === mode));
    const nameField = $("#hshsNameField");
    if (nameField) nameField.hidden = !isSignup;
    $("#hshs-auth-title").textContent = isSignup ? "Create account" : "Welcome back";
    $("#hshs-auth-subtitle").textContent = isSignup
      ? "Join the HSHS Academics Door community"
      : "Sign in to access your study tools";
    $("#hshsAuthSubmit").textContent = isSignup ? "Create account" : "Login";
    $("#hshsAuthPassword").autocomplete = isSignup ? "new-password" : "current-password";
    clearError();
  }

  function $$(sel) {
    return [...document.querySelectorAll(sel)];
  }

  function openModal(mode = "login") {
    ensureModal();
    setMode(mode);
    $("#hshsAuthForm").reset();
    clearError();
    const overlay = $("#hshs-auth-overlay");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      const focusId = mode === "signup" ? "hshsAuthName" : "hshsAuthEmail";
      $(`#${focusId}`)?.focus();
    }, 50);
  }

  function closeModal() {
    const overlay = $("#hshs-auth-overlay");
    if (!overlay) return;
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  function showError(msg) {
    const el = $("#hshsAuthError");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
  }

  function clearError() {
    const el = $("#hshsAuthError");
    if (!el) return;
    el.textContent = "";
    el.classList.remove("show");
  }

  function onSubmit(e) {
    e.preventDefault();
    clearError();
    const name = $("#hshsAuthName")?.value.trim() || "";
    const email = $("#hshsAuthEmail")?.value.trim().toLowerCase() || "";
    const password = $("#hshsAuthPassword")?.value || "";

    if (!validateEmail(email)) {
      showError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      showError("Password must be at least 6 characters.");
      return;
    }

    const users = getUsers();

    if (currentMode === "signup") {
      if (!name || name.length < 2) {
        showError("Please enter your full name.");
        return;
      }
      if (users.some((u) => u.email === email)) {
        showError("An account with this email already exists. Try logging in.");
        return;
      }
      const user = {
        id: "u" + Date.now(),
        name,
        email,
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString(),
      };
      users.push(user);
      saveUsers(users);
      setSession(user);
      closeModal();
      updateHeader();
      showToast("Account created — welcome, " + name.split(" ")[0] + "!", "success");
      window.dispatchEvent(new CustomEvent("hshs:auth", { detail: { user, action: "signup" } }));
    } else {
      const user = users.find((u) => u.email === email);
      if (!user || user.passwordHash !== hashPassword(password)) {
        showError("Incorrect email or password.");
        return;
      }
      setSession(user);
      closeModal();
      updateHeader();
      showToast("Welcome back, " + user.name.split(" ")[0] + "!", "success");
      window.dispatchEvent(new CustomEvent("hshs:auth", { detail: { user, action: "login" } }));
    }
  }

  function logout() {
    setSession(null);
    updateHeader();
    showToast("You have been logged out.", "info");
    window.dispatchEvent(new CustomEvent("hshs:auth", { detail: { user: null, action: "logout" } }));
  }

  // ---------- Header UI ----------
  function updateHeader() {
    const session = getSession();
    const loginBtn = $("#loginBtn");
    const signupBtn = $("#signupBtn");

    // Remove existing chip if any
    $(".hshs-user-chip")?.remove();

    if (session) {
      if (loginBtn) loginBtn.hidden = true;
      if (signupBtn) signupBtn.hidden = true;

      const actions = loginBtn?.parentElement || $(".header-actions");
      if (actions) {
        const chip = document.createElement("div");
        chip.className = "hshs-user-chip";
        chip.title = session.email;
        const initial = (session.name || "?")[0].toUpperCase();
        chip.innerHTML = `
          <span class="chip-avatar">${escapeHtml(initial)}</span>
          <span class="chip-name">${escapeHtml(session.name)}</span>
          <button type="button" class="hshs-logout-btn" id="hshsLogoutBtn" title="Log out" aria-label="Log out">⎋</button>
        `;
        // Insert before mobile menu button if present
        const mobileBtn = $("#mobileMenuBtn");
        if (mobileBtn) {
          actions.insertBefore(chip, mobileBtn);
        } else {
          actions.appendChild(chip);
        }
        $("#hshsLogoutBtn")?.addEventListener("click", logout);
      }
    } else {
      if (loginBtn) loginBtn.hidden = false;
      if (signupBtn) signupBtn.hidden = false;
    }
  }

  function wireButtons() {
    const loginBtn = $("#loginBtn");
    const signupBtn = $("#signupBtn");
    if (loginBtn) {
      loginBtn.addEventListener("click", () => openModal("login"));
    }
    if (signupBtn) {
      signupBtn.addEventListener("click", () => openModal("signup"));
    }
  }

  // ---------- Public API ----------
  window.HSHSAuth = {
    open: openModal,
    close: closeModal,
    logout,
    getSession,
    isLoggedIn: () => !!getSession(),
    updateHeader,
  };

  // Init
  function init() {
    injectStyles();
    wireButtons();
    updateHeader();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
