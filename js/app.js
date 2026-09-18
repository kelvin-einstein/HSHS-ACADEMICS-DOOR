/**
 * HSHS Academics Door - Main Application Script
 * Vanilla JS for speed and full control
 */

// ============================================
// Sample Data (will later come from backend / JSON)
// ============================================
const sampleData = {
  papers: [
    {
      id: 1,
      title: "Mathematics Paper 1",
      year: 2024,
      subject: "Mathematics",
      level: "Form 4",
      type: "Past Paper",
      downloads: 1240
    },
    {
      id: 2,
      title: "Biology Paper 2",
      year: 2023,
      subject: "Biology",
      level: "Form 4",
      type: "Past Paper",
      downloads: 980
    },
    {
      id: 3,
      title: "Chemistry Paper 1",
      year: 2024,
      subject: "Chemistry",
      level: "Form 4",
      type: "Past Paper",
      downloads: 1120
    },
    {
      id: 4,
      title: "Physics Paper 2",
      year: 2023,
      subject: "Physics",
      level: "Form 4",
      type: "Past Paper",
      downloads: 870
    },
    {
      id: 5,
      title: "English Paper 1",
      year: 2024,
      subject: "English",
      level: "Form 4",
      type: "Past Paper",
      downloads: 1450
    },
    {
      id: 6,
      title: "History & Government",
      year: 2023,
      subject: "History",
      level: "Form 4",
      type: "Past Paper",
      downloads: 760
    }
  ],

  notes: [
    {
      id: 1,
      title: "Quadratic Equations – Complete Guide",
      subject: "Mathematics",
      author: "Teacher Notes",
      pages: 12
    },
    {
      id: 2,
      title: "Cell Structure & Organisation",
      subject: "Biology",
      author: "HSHS Notes",
      pages: 8
    },
    {
      id: 3,
      title: "Organic Chemistry Basics",
      subject: "Chemistry",
      author: "Teacher Notes",
      pages: 15
    },
    {
      id: 4,
      title: "Newton's Laws of Motion",
      subject: "Physics",
      author: "HSHS Notes",
      pages: 10
    }
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
    { title: "Upload", desc: "Share your notes with other students", icon: "⬆️", link: "#" }
  ]
};

// ============================================
// DOM Elements
// ============================================
const elements = {
  mobileMenuBtn: document.getElementById("mobileMenuBtn"),
  mainNav: document.getElementById("mainNav"),
  globalSearch: document.getElementById("globalSearch"),
  searchBtn: document.getElementById("searchBtn"),
  quickAccessCards: document.getElementById("quickAccessCards"),
  featuredPapers: document.getElementById("featuredPapers"),
  popularNotes: document.getElementById("popularNotes"),
  subjectsGrid: document.getElementById("subjectsGrid"),
  statPapers: document.getElementById("statPapers"),
  statNotes: document.getElementById("statNotes"),
  statSubjects: document.getElementById("statSubjects")
};

// ============================================
// Render Functions
// ============================================
function renderQuickAccess() {
  if (!elements.quickAccessCards) return;

  elements.quickAccessCards.innerHTML = sampleData.quickAccess
    .map(
      (item) => `
      <a href="${item.link}" class="card">
        <div class="card-icon">${item.icon}</div>
        <h3 class="card-title">${item.title}</h3>
        <p class="card-desc">${item.desc}</p>
      </a>
    `
    )
    .join("");
}

function renderPapers() {
  if (!elements.featuredPapers) return;

  elements.featuredPapers.innerHTML = sampleData.papers
    .map(
      (paper) => `
      <article class="card paper-card">
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
      </article>
    `
    )
    .join("");
}

function renderNotes() {
  if (!elements.popularNotes) return;

  elements.popularNotes.innerHTML = sampleData.notes
    .map(
      (note) => `
      <article class="card paper-card">
        <span class="badge" style="background:#ecfdf5;color:#059669;">${note.subject}</span>
        <h3>${note.title}</h3>
        <div class="paper-meta">
          <span>${note.author}</span>
          <span>• ${note.pages} pages</span>
        </div>
        <div class="paper-actions">
          <button class="btn btn-primary btn-sm">View Note</button>
          <button class="btn btn-outline btn-sm">Save</button>
        </div>
      </article>
    `
    )
    .join("");
}

function renderSubjects() {
  if (!elements.subjectsGrid) return;

  elements.subjectsGrid.innerHTML = sampleData.subjects
    .map(
      (sub) => `
      <div class="card subject-card" data-subject="${sub.name}">
        <div class="icon">${sub.icon}</div>
        <h3>${sub.name}</h3>
        <p class="card-desc">${sub.count} resources</p>
      </div>
    `
    )
    .join("");
}

function updateStats() {
  // Simple animated counter
  animateCounter(elements.statPapers, sampleData.papers.length * 12); // simulated larger number
  animateCounter(elements.statNotes, sampleData.notes.length * 28);
  animateCounter(elements.statSubjects, sampleData.subjects.length);
}

function animateCounter(el, target) {
  if (!el) return;
  let current = 0;
  const increment = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current.toLocaleString();
  }, 30);
}

// ============================================
// Event Listeners
// ============================================
function setupEventListeners() {
  // Mobile menu toggle
  if (elements.mobileMenuBtn && elements.mainNav) {
    elements.mobileMenuBtn.addEventListener("click", () => {
      elements.mainNav.classList.toggle("open");
    });
  }

  // Search
  if (elements.searchBtn) {
    elements.searchBtn.addEventListener("click", handleSearch);
  }

  if (elements.globalSearch) {
    elements.globalSearch.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSearch();
    });
  }

  // Subject cards click
  document.addEventListener("click", (e) => {
    const subjectCard = e.target.closest(".subject-card");
    if (subjectCard) {
      const subject = subjectCard.dataset.subject;
      alert(`You clicked: ${subject}\n\n(This will later open the subject page)`);
    }
  });
}

function handleSearch() {
  const query = elements.globalSearch?.value.trim();
  if (!query) {
    elements.globalSearch?.focus();
    return;
  }
  // For now just show an alert – later this will filter or go to search results page
  alert(`Searching for: "${query}"\n\n(Search functionality coming in the next steps)`);
}

// ============================================
// Initialize App
// ============================================
function init() {
  renderQuickAccess();
  renderPapers();
  renderNotes();
  renderSubjects();
  updateStats();
  setupEventListeners();

  console.log("%cHSHS Academics Door loaded successfully 🚀", "color: #2563eb; font-weight: bold;");
}

// Run when DOM is ready
document.addEventListener("DOMContentLoaded", init);
