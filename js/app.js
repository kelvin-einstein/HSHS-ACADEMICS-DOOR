/**
 * Hawthorne-Scribner High School · Academics Door
 */

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
    { name: "Mathematics", icon: "📐", count: 48 },
    { name: "Biology", icon: "🧬", count: 36 },
    { name: "Chemistry", icon: "⚗️", count: 32 },
    { name: "Physics", icon: "⚛️", count: 29 },
    { name: "English", icon: "📖", count: 41 },
    { name: "History", icon: "🏛️", count: 24 },
    { name: "Geography", icon: "🌍", count: 22 },
    { name: "CRE", icon: "✝️", count: 18 }
  ],
  quickAccess: [
    { title: "Past Papers", desc: "Browse all exam papers by year & subject", icon: "📄", link: "#papers" },
    { title: "Study Notes", desc: "High-quality notes and summaries", icon: "📝", link: "#notes" },
    { title: "By Subject", desc: "Find resources organised by subject", icon: "📚", link: "#subjects" },
    { title: "Community", desc: "See school community stats & charts", icon: "📊", link: "community.html" },
    { title: "Comments", desc: "Share feedback with other students", icon: "💬", link: "comments.html" },
    { title: "Chat", desc: "Message fellow students in real-time", icon: "🗨️", link: "chat.html" },
    { title: "Upload", desc: "Share your notes with other students", icon: "⬆️", link: "#" }
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

function renderQuickAccess() {
  const el = $("#quickAccessCards");
  if (!el) return;
  el.innerHTML = sampleData.quickAccess
    .map(
      (item) => `
      <a href="${item.link}" class="card reveal">
        <div class="card-icon">${item.icon}</div>
        <h3 class="card-title">${item.title}</h3>
        <p class="card-desc">${item.desc}</p>
      </a>`
    )
    .join("");
}

function renderPapers() {
  const el = $("#featuredPapers");
  if (!el) return;
  el.innerHTML = sampleData.papers
    .map(
      (paper) => `
      <article class="card paper-card reveal">
        <span class="badge">${paper.year}</span>
        <h3>${paper.title}</h3>
        <div class="paper-meta">
          <span>${paper.subject}</span>
          <span>• ${paper.level}</span>
          <span>• ${paper.downloads.toLocaleString()} downloads</span>
        </div>
        <div class="paper-actions">
          <button class="btn btn-primary btn-sm">Download</button>
          <button class="btn btn-outline btn-sm">Preview</button>
        </div>
      </article>`
    )
    .join("");
}

function renderNotes() {
  const el = $("#popularNotes");
  if (!el) return;
  el.innerHTML = sampleData.notes
    .map(
      (note) => `
      <article class="card paper-card reveal">
        <span class="badge" style="background:color-mix(in oklch, var(--success) 15%, transparent);color:var(--success)">${note.subject}</span>
        <h3>${note.title}</h3>
        <div class="paper-meta">
          <span>${note.author}</span>
          <span>• ${note.pages} pages</span>
        </div>
        <div class="paper-actions">
          <button class="btn btn-primary btn-sm">View Note</button>
          <button class="btn btn-outline btn-sm">Save</button>
        </div>
      </article>`
    )
    .join("");
}

function renderSubjects() {
  const el = $("#subjectsGrid");
  if (!el) return;
  el.innerHTML = sampleData.subjects
    .map(
      (sub) => `
      <div class="card subject-card reveal" data-subject="${sub.name}">
        <div class="icon">${sub.icon}</div>
        <h3>${sub.name}</h3>
        <p class="card-desc">${sub.count} resources</p>
      </div>`
    )
    .join("");
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
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current.toLocaleString();
  }, 28);
}

const COMMENTS_KEY = "hshs-comments";

function getComments() {
  try {
    return JSON.parse(localStorage.getItem(COMMENTS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveComments(list) {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(list));
}

function renderComments() {
  const listEl = $("#commentsList");
  if (!listEl) return;

  const comments = getComments();
  if (comments.length === 0) {
    listEl.innerHTML = `<div class="empty-comments">No comments yet. Be the first to share your thoughts!</div>`;
    return;
  }

  listEl.innerHTML = comments
    .slice()
    .reverse()
    .map(
      (c) => {
        const pic = "https://ui-avatars.com/api/?name=" + encodeURIComponent(c.name) + "&background=4f46e5&color=fff&size=72&bold=true&format=svg";
        return `
      <div class="comment-item">
        <div class="comment-header">
          <div class="comment-author-wrap">
            <img class="comment-avatar" src="${pic}" alt="" width="36" height="36" />
            <span class="comment-author">${escapeHtml(c.name)}</span>
          </div>
          <span class="comment-date">${c.date}</span>
        </div>
        <p class="comment-body">${escapeHtml(c.text)}</p>
      </div>`;
      }
    )
    .join("");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function setupCommentForm() {
  const form = $("#commentForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#commentName").value.trim();
    const text = $("#commentText").value.trim();
    if (!name || !text) return;

    const comments = getComments();
    comments.push({
      name,
      text,
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    });
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
    new Chart(subjectsCtx, {
      type: "doughnut",
      data: {
        labels: ["Mathematics", "English", "Biology", "Chemistry", "Physics", "History", "Others"],
        datasets: [{
          data: [48, 41, 36, 32, 29, 24, 40],
          backgroundColor: ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#a855f7", "#ef4444", "#64748b"],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 14 } } }
      }
    });
  }

  const downloadsCtx = $("#downloadsChart");
  if (downloadsCtx) {
    new Chart(downloadsCtx, {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
        datasets: [{
          label: "Downloads",
          data: [320, 410, 380, 520, 610, 580, 720, 690, 810],
          backgroundColor: "#6366f1",
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: gridColor } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  const studentsCtx = $("#studentsChart");
  if (studentsCtx) {
    new Chart(studentsCtx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
        datasets: [{
          label: "Active Students",
          data: [180, 210, 240, 260, 310, 340, 390, 420, 460],
          borderColor: "#06b6d4",
          backgroundColor: "rgba(6,182,212,0.12)",
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: "#06b6d4"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: gridColor } },
          x: { grid: { display: false } }
        }
      }
    });
  }
}

function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((el) => observer.observe(el));
}

function setupEventListeners() {
  const themeBtn = $("#themeToggle");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

  const menuBtn = $("#mobileMenuBtn");
  const nav = $("#mainNav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => nav.classList.remove("open"));
    });
  }

  const searchBtn = $("#searchBtn");
  const searchInput = $("#globalSearch");
  if (searchBtn) searchBtn.addEventListener("click", handleSearch);
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSearch();
    });
  }

  document.addEventListener("click", (e) => {
    const card = e.target.closest(".subject-card");
    if (card) {
      const subject = card.dataset.subject;
      alert(`Subject: ${subject}\n\n(Full subject page coming soon)`);
    }
  });
}

function handleSearch() {
  const query = $("#globalSearch")?.value.trim();
  if (!query) {
    $("#globalSearch")?.focus();
    return;
  }
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

  if ($("#subjectsChart") || $("#downloadsChart") || $("#studentsChart")) {
    setTimeout(initCommunityCharts, 50);
  }

  console.log("%cHawthorne-Scribner High School · Academics Door ready 🚀", "color: #6366f1; font-weight: bold;");
}

document.addEventListener("DOMContentLoaded", init);
