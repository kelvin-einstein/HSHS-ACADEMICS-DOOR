/**
 * Hawthorne-Scribner High School · Academics Door
 * Modern SVG icons (clean line style, not cartoonish)
 */

const ICON = {
  papers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  notes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
  subjects: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  community: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>`,
  comments: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  chat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
  upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
  learn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  hub: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>`,
  math: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="32" height="32"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8M8 12h4M8 16h6"/></svg>`,
  bio: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="32" height="32"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>`,
  chem: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="32" height="32"><path d="M9 3h6v6l4 8a2 2 0 0 1-2 3H7a2 2 0 0 1-2-3l4-8V3z"/><path d="M9 3h6"/></svg>`,
  phys: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="32" height="32"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`,
  eng: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="32" height="32"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  hist: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="32" height="32"><path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/></svg>`,
  geo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="32" height="32"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  cre: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="32" height="32"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`
};

const sampleData = {
  papers: [
    { id: 1, title: "Mathematics Paper 1", year: 2024, subject: "Mathematics", level: "Form 4", type: "Past Paper", downloads: 1240 },
    { id: 2, title: "Biology Paper 2", year: 2023, subject: "Biology", level: "Form 4", type: "Past Paper", downloads: 980 },
    { id: 3, title: "Chemistry Paper 1", year: 2024, subject: "Chemistry", level: "Form 4", type: "Past Paper", downloads: 1120 },
    { id: 4, title: "Physics Paper 2", year: 2023, subject: "Physics", level: "Form 4", type: "Past Paper", downloads: 870 },
    { id: 5, title: "English Paper 1", year: 2024, subject: "English", level: "Form 4", type: "Past Paper", downloads: 1450 },
    { id: 6, title: "History & Government", year: 2023, subject: "History", level: "Form 4", type: "Past Paper", downloads: 760 }
  ],
  notes: [
    { id: 1, title: "Quadratic Equations – Complete Guide", subject: "Mathematics", author: "Teacher Notes", pages: 12 },
    { id: 2, title: "Cell Structure & Organisation", subject: "Biology", author: "HSHS Notes", pages: 8 },
    { id: 3, title: "Organic Chemistry Basics", subject: "Chemistry", author: "Teacher Notes", pages: 15 },
    { id: 4, title: "Newton's Laws of Motion", subject: "Physics", author: "HSHS Notes", pages: 10 }
  ],
  subjects: [
    { name: "Mathematics", icon: ICON.math, count: 48 },
    { name: "Biology", icon: ICON.bio, count: 36 },
    { name: "Chemistry", icon: ICON.chem, count: 32 },
    { name: "Physics", icon: ICON.phys, count: 29 },
    { name: "English", icon: ICON.eng, count: 41 },
    { name: "History", icon: ICON.hist, count: 24 },
    { name: "Geography", icon: ICON.geo, count: 22 },
    { name: "CRE", icon: ICON.cre, count: 18 }
  ],
  quickAccess: [
    { title: "Academic Hub", desc: "Learning, exams, virtual lab, quizzes & careers", icon: ICON.hub, link: "academic-hub.html" },
    { title: "Past Papers", desc: "Browse all exam papers by year & subject", icon: ICON.papers, link: "#papers" },
    { title: "Study Notes", desc: "High-quality notes and summaries", icon: ICON.notes, link: "#notes" },
    { title: "By Subject", desc: "Find resources organised by subject", icon: ICON.subjects, link: "#subjects" },
    { title: "Online Learning", desc: "Courses, live classes, quizzes & progress", icon: ICON.learn, link: "learn.html" },
    { title: "Community", desc: "See school community stats & charts", icon: ICON.community, link: "community.html" },
    { title: "Comments", desc: "Share feedback with other students", icon: ICON.comments, link: "comments.html" },
    { title: "Chat", desc: "Message fellow students in real-time", icon: ICON.chat, link: "chat.html" },
    { title: "Upload", desc: "Share your notes with other students", icon: ICON.upload, link: "#" }
  ]
};

function initTheme() {
  const saved = localStorage.getItem("hshs-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("hshs-theme", next);
}

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const PROFILE_KEY = "hshs-profile-photo";

function initProfileUpload() {
  const input = $("#profileUpload");
  const btn = $("#profileBtn");
  const preview = $("#profilePreview");
  const placeholder = $("#profilePlaceholder");
  if (!input || !btn) return;
  const saved = localStorage.getItem(PROFILE_KEY);
  if (saved && preview) {
    preview.src = saved;
    preview.hidden = false;
    if (placeholder) placeholder.hidden = true;
  }
  btn.addEventListener("click", () => input.click());
  input.addEventListener("change", () => {
    const file = input.files && input.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) { alert("Please choose an image under 2 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      localStorage.setItem(PROFILE_KEY, dataUrl);
      if (preview) { preview.src = dataUrl; preview.hidden = false; preview.alt = "Your profile photo"; }
      if (placeholder) placeholder.hidden = true;
    };
    reader.readAsDataURL(file);
  });
}

function renderQuickAccess() {
  const el = $("#quickAccessCards");
  if (!el) return;
  el.innerHTML = sampleData.quickAccess.map((item) => `
      <a href="${item.link}" class="card reveal">
        <div class="card-icon">${item.icon}</div>
        <h3 class="card-title">${item.title}</h3>
        <p class="card-desc">${item.desc}</p>
      </a>`).join("");
}

function renderPapers() {
  const el = $("#featuredPapers");
  if (!el) return;
  el.innerHTML = sampleData.papers.map((paper) => `
      <article class="card paper-card reveal">
        <span class="badge">${paper.year}</span>
        <h3>${paper.title}</h3>
        <div class="paper-meta">
          <span>${paper.subject}</span>
          <span>• ${paper.level}</span>
          <span>• ${paper.downloads.toLocaleString()} downloads</span>
        </div>
        <div class="paper-actions">
          <button class="btn btn-primary btn-sm" type="button">Download</button>
          <button class="btn btn-outline btn-sm" type="button">Preview</button>
        </div>
      </article>`).join("");
}

function renderNotes() {
  const el = $("#popularNotes");
  if (!el) return;
  el.innerHTML = sampleData.notes.map((note) => `
      <article class="card paper-card reveal">
        <span class="badge" style="background:color-mix(in oklch, var(--success) 15%, transparent);color:var(--success)">${note.subject}</span>
        <h3>${note.title}</h3>
        <div class="paper-meta">
          <span>${note.author}</span>
          <span>• ${note.pages} pages</span>
        </div>
        <div class="paper-actions">
          <button class="btn btn-primary btn-sm" type="button">View Note</button>
          <button class="btn btn-outline btn-sm" type="button">Save</button>
        </div>
      </article>`).join("");
}

function renderSubjects() {
  const el = $("#subjectsGrid");
  if (!el) return;
  el.innerHTML = sampleData.subjects.map((sub) => `
      <div class="card subject-card reveal" data-subject="${sub.name}" role="button" tabindex="0">
        <div class="icon">${sub.icon}</div>
        <h3>${sub.name}</h3>
        <p class="card-desc">${sub.count} resources</p>
      </div>`).join("");
}

function updateStats() {
  animateCounter($("#statPapers"), sampleData.papers.length * 12);
  animateCounter($("#statNotes"), sampleData.notes.length * 28);
  animateCounter($("#statSubjects"), sampleData.subjects.length);
}

function animateCounter(el, target) {
  if (!el) return;
  let current = 0;
  const increment = Math.ceil(target / 40) || 1;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = current.toLocaleString();
  }, 28);
}

const COMMENTS_KEY = "hshs-comments";
function getComments() { try { return JSON.parse(localStorage.getItem(COMMENTS_KEY)) || []; } catch { return []; } }
function saveComments(list) { localStorage.setItem(COMMENTS_KEY, JSON.stringify(list)); }

function renderComments() {
  const listEl = $("#commentsList");
  if (!listEl) return;
  const comments = getComments();
  if (comments.length === 0) {
    listEl.innerHTML = `<div class="empty-comments">No comments yet. Be the first to share your thoughts!</div>`;
    return;
  }
  listEl.innerHTML = comments.slice().reverse().map((c) => {
    const pic = "https://ui-avatars.com/api/?name=" + encodeURIComponent(c.name) + "&background=4f46e5&color=fff&size=72&bold=true&format=svg";
    return `<div class="comment-item"><div class="comment-header"><div class="comment-author-wrap"><img class="comment-avatar" src="${pic}" alt="" width="36" height="36" /><span class="comment-author">${escapeHtml(c.name)}</span></div><span class="comment-date">${c.date}</span></div><p class="comment-body">${escapeHtml(c.text)}</p></div>`;
  }).join("");
}

function escapeHtml(str) { const div = document.createElement("div"); div.textContent = str; return div.innerHTML; }

function setupCommentForm() {
  const form = $("#commentForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#commentName").value.trim();
    const text = $("#commentText").value.trim();
    if (!name || !text) return;
    const comments = getComments();
    comments.push({ name, text, date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) });
    saveComments(comments);
    form.reset();
    renderComments();
  });
}

function initCommunityCharts() {
  if (typeof Chart === "undefined") return;
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const textColor = isDark ? "#94a3b8" : "#64748b";
  const gridColor = isDark ? "rgba(148,163,184,0.12)" : "rgba(100,116,139,0.12)";
  Chart.defaults.color = textColor;
  Chart.defaults.borderColor = gridColor;
  const subjectsCtx = $("#subjectsChart");
  if (subjectsCtx) {
    new Chart(subjectsCtx, { type: "doughnut", data: { labels: ["Mathematics", "English", "Biology", "Chemistry", "Physics", "History", "Others"], datasets: [{ data: [48, 41, 36, 32, 29, 24, 40], backgroundColor: ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#a855f7", "#ef4444", "#64748b"], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 14 } } } } });
  }
  const downloadsCtx = $("#downloadsChart");
  if (downloadsCtx) {
    new Chart(downloadsCtx, { type: "bar", data: { labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"], datasets: [{ label: "Downloads", data: [320, 410, 380, 520, 610, 580, 720, 690, 810], backgroundColor: "#6366f1", borderRadius: 6 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: gridColor } }, x: { grid: { display: false } } } } });
  }
  const studentsCtx = $("#studentsChart");
  if (studentsCtx) {
    new Chart(studentsCtx, { type: "line", data: { labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"], datasets: [{ label: "Active Students", data: [180, 210, 240, 260, 310, 340, 390, 420, 460], borderColor: "#06b6d4", backgroundColor: "rgba(6,182,212,0.12)", fill: true, tension: 0.35, pointRadius: 4, pointBackgroundColor: "#06b6d4" }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: gridColor } }, x: { grid: { display: false } } } } });
  }
}

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); }); }, { threshold: 0.12 });
  $$(".reveal").forEach((el) => observer.observe(el));
}

function setupEventListeners() {
  const themeBtn = $("#themeToggle");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
  const menuBtn = $("#mobileMenuBtn");
  const nav = $("#mainNav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Open menu");
      });
    });
  }
  const searchBtn = $("#searchBtn");
  const searchInput = $("#globalSearch");
  if (searchBtn) searchBtn.addEventListener("click", handleSearch);
  if (searchInput) searchInput.addEventListener("keypress", (e) => { if (e.key === "Enter") handleSearch(); });
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".subject-card");
    if (card) alert(`Subject: ${card.dataset.subject}\n\n(Full subject page coming soon)`);
  });
}

function handleSearch() {
  const query = $("#globalSearch")?.value.trim();
  if (!query) { $("#globalSearch")?.focus(); return; }
  alert(`Searching for: "${query}"\n\n(Full search results page coming soon)`);
}

function createHeroParticles() {
  const container = $(".hero-particles");
  if (!container) return;
  for (let i = 0; i < 32; i++) {
    const span = document.createElement("span");
    span.style.left = Math.random() * 100 + "%";
    span.style.animationDelay = Math.random() * 10 + "s";
    span.style.animationDuration = 7 + Math.random() * 9 + "s";
    container.appendChild(span);
  }
}

function init() {
  initTheme();
  initProfileUpload();
  renderQuickAccess();
  renderPapers();
  renderNotes();
  renderSubjects();
  updateStats();
  setupEventListeners();
  setupCommentForm();
  renderComments();
  createHeroParticles();
  initScrollReveal();
  if ($("#subjectsChart") || $("#downloadsChart") || $("#studentsChart")) setTimeout(initCommunityCharts, 50);
  console.log("%cHawthorne-Scribner High School · Academics Door ready", "color: #6366f1; font-weight: bold;");
}

document.addEventListener("DOMContentLoaded", init);
