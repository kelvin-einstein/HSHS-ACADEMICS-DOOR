/**
 * HSHS Academics Door — Advanced Features
 * Study Planner · Streaks · Viewer · Command Palette · PWA · Flashcards · etc.
 */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // ---------- Storage helpers ----------
  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v != null ? JSON.parse(v) : fallback;
      } catch {
        return fallback;
      }
    },
    set(key, val) {
      localStorage.setItem(key, JSON.stringify(val));
    },
  };

  // ---------- Accent themes ----------
  function initAccent() {
    const saved = localStorage.getItem("hshs-accent") || "indigo";
    document.documentElement.setAttribute("data-accent", saved);
    $$(".accent-swatch").forEach((s) => {
      s.classList.toggle("active", s.dataset.accent === saved);
      s.addEventListener("click", () => {
        const a = s.dataset.accent;
        document.documentElement.setAttribute("data-accent", a);
        localStorage.setItem("hshs-accent", a);
        $$(".accent-swatch").forEach((x) => x.classList.toggle("active", x.dataset.accent === a));
      });
    });
  }

  // ---------- Streaks & XP ----------
  const STREAK_KEY = "hshs-streak";
  const XP_KEY = "hshs-xp";

  function getStreak() {
    return store.get(STREAK_KEY, { count: 0, lastDate: null, best: 0 });
  }
  function getXP() {
    return store.get(XP_KEY, { total: 0, level: 1 });
  }

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function bumpStreak() {
    const s = getStreak();
    const today = todayStr();
    if (s.lastDate === today) return s;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().slice(0, 10);
    if (s.lastDate === yStr) s.count += 1;
    else s.count = 1;
    s.lastDate = today;
    s.best = Math.max(s.best || 0, s.count);
    store.set(STREAK_KEY, s);
    return s;
  }

  function addXP(amount) {
    const xp = getXP();
    xp.total += amount;
    xp.level = Math.floor(xp.total / 100) + 1;
    store.set(XP_KEY, xp);
    renderStreakBar();
    return xp;
  }

  function renderStreakBar() {
    const bar = $("#streakBar");
    if (!bar) return;
    const s = getStreak();
    const xp = getXP();
    const pct = xp.total % 100;
    bar.innerHTML = `
      <div class="streak-fire">
        <span class="fire-icon" aria-hidden="true">🔥</span>
        <span>${s.count} day streak</span>
      </div>
      <div class="xp-bar-wrap">
        <div class="xp-label"><span>Level ${xp.level}</span><span>${pct}/100 XP</span></div>
        <div class="xp-track"><div class="xp-fill" style="width:${pct}%"></div></div>
      </div>
      <div class="streak-stats">
        <div class="streak-stat"><span class="num">${s.best}</span>Best streak</div>
        <div class="streak-stat"><span class="num">${xp.total}</span>Total XP</div>
      </div>
    `;
  }

  // ---------- Study Planner / Exam Countdown ----------
  const EXAMS_KEY = "hshs-exams";

  function getExams() {
    return store.get(EXAMS_KEY, []);
  }

  function daysUntil(dateStr) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(dateStr + "T00:00:00");
    return Math.ceil((target - now) / 86400000);
  }

  function renderPlanner() {
    const countdownEl = $("#countdownHero");
    const todayEl = $("#todayStudy");
    const listEl = $("#examList");
    if (!listEl) return;

    const exams = getExams().sort((a, b) => a.date.localeCompare(b.date));
    const upcoming = exams.filter((e) => daysUntil(e.date) >= 0);

    if (countdownEl) {
      if (upcoming.length === 0) {
        countdownEl.innerHTML = `
          <p class="countdown-label">Next exam</p>
          <div class="countdown-days">—</div>
          <p class="countdown-exam">Add an exam to start your countdown</p>
        `;
      } else {
        const next = upcoming[0];
        const d = daysUntil(next.date);
        countdownEl.innerHTML = `
          <p class="countdown-label">Next exam</p>
          <div class="countdown-days">${d === 0 ? "Today" : d}</div>
          <p class="countdown-exam">${d === 0 ? "" : "days until "}<strong>${escapeHtml(next.subject)}</strong> · ${formatDate(next.date)}</p>
        `;
      }
    }

    if (todayEl) {
      const suggestions = buildTodaySuggestions(upcoming);
      todayEl.innerHTML = `
        <h3>What to study today</h3>
        <div class="today-list">
          ${suggestions
            .map(
              (s) => `
            <div class="today-item">
              <span class="dot"></span>
              <span>${escapeHtml(s)}</span>
            </div>`
            )
            .join("")}
        </div>
      `;
    }

    listEl.innerHTML =
      exams.length === 0
        ? `<p style="color:var(--text-muted);font-size:0.9rem">No exams yet. Add one above.</p>`
        : exams
            .map((e) => {
              const d = daysUntil(e.date);
              const urgent = d >= 0 && d <= 7;
              return `
            <div class="exam-item" data-id="${e.id}">
              <div class="exam-info">
                <span class="exam-subject">${escapeHtml(e.subject)}</span>
                <span class="exam-date">${formatDate(e.date)}${e.note ? " · " + escapeHtml(e.note) : ""}</span>
              </div>
              <span class="exam-days-left ${urgent ? "urgent" : ""}">${d < 0 ? "Passed" : d === 0 ? "Today" : d + "d"}</span>
              <button type="button" class="exam-remove" aria-label="Remove" data-remove="${e.id}">✕</button>
            </div>`;
            })
            .join("");

    listEl.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.remove;
        const next = getExams().filter((e) => e.id !== id);
        store.set(EXAMS_KEY, next);
        renderPlanner();
      });
    });
  }

  function buildTodaySuggestions(upcoming) {
    if (upcoming.length === 0) {
      return [
        "Browse past papers for your weakest subject",
        "Review one set of notes for 25 minutes",
        "Take a quick quiz on the Learn page",
      ];
    }
    const next = upcoming[0];
    const d = daysUntil(next.date);
    const tips = [
      `Focus on ${next.subject} — ${d <= 3 ? "high priority" : "steady revision"}`,
      `Do 1 past paper section for ${next.subject}`,
      d <= 7 ? `Create flashcards for ${next.subject} key topics` : `Review notes for ${next.subject}`,
    ];
    if (upcoming[1]) tips.push(`Light review of ${upcoming[1].subject}`);
    return tips.slice(0, 4);
  }

  function formatDate(iso) {
    try {
      return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  }

  function setupExamForm() {
    const form = $("#examForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const subject = $("#examSubject")?.value.trim();
      const date = $("#examDate")?.value;
      const note = $("#examNote")?.value.trim() || "";
      if (!subject || !date) return;
      const exams = getExams();
      exams.push({
        id: "e" + Date.now(),
        subject,
        date,
        note,
      });
      store.set(EXAMS_KEY, exams);
      form.reset();
      renderPlanner();
      addXP(5);
      bumpStreak();
      renderStreakBar();
    });
  }

  // ---------- Smart Search ----------
  function getSearchCorpus() {
    const data = window.sampleData || {};
    const items = [];
    (data.papers || []).forEach((p) =>
      items.push({
        type: "Paper",
        title: p.title,
        meta: `${p.subject} · ${p.year} · ${p.level}`,
        id: "paper-" + p.id,
        action: () => openViewer({ title: p.title, kind: "paper", subject: p.subject, year: p.year }),
      })
    );
    (data.notes || []).forEach((n) =>
      items.push({
        type: "Note",
        title: n.title,
        meta: `${n.subject} · ${n.pages} pages`,
        id: "note-" + n.id,
        action: () => openViewer({ title: n.title, kind: "note", subject: n.subject }),
      })
    );
    (data.subjects || []).forEach((s) =>
      items.push({
        type: "Subject",
        title: s.name,
        meta: `${s.count} resources`,
        id: "subj-" + s.name,
        action: () => {
          const el = document.getElementById("subjects");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        },
      })
    );
    items.push(
      { type: "Page", title: "Online Learning", meta: "Courses & quizzes", id: "page-learn", action: () => (location.href = "learn.html") },
      { type: "Page", title: "Community", meta: "Charts & stats", id: "page-comm", action: () => (location.href = "community.html") },
      { type: "Page", title: "Chat", meta: "Message students", id: "page-chat", action: () => (location.href = "chat.html") },
      { type: "Page", title: "Study Planner", meta: "Exams & schedule", id: "page-plan", action: () => $("#planner")?.scrollIntoView({ behavior: "smooth" }) }
    );
    return items;
  }

  function scoreMatch(item, q) {
    const t = (item.title + " " + item.meta + " " + item.type).toLowerCase();
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    let score = 0;
    terms.forEach((term) => {
      if (t.includes(term)) score += 10;
      if (item.title.toLowerCase().startsWith(term)) score += 15;
      if (item.title.toLowerCase().includes(term)) score += 8;
    });
    return score;
  }

  function runSmartSearch(query) {
    const panel = $("#searchResultsPanel");
    if (!panel) return;
    const q = (query || "").trim();
    if (!q) {
      panel.hidden = true;
      return;
    }
    const corpus = getSearchCorpus();
    const ranked = corpus
      .map((item) => ({ item, score: scoreMatch(item, q) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    if (ranked.length === 0) {
      panel.innerHTML = `<div class="cmd-empty">No results for “${escapeHtml(q)}”</div>`;
      panel.hidden = false;
      return;
    }
    panel.innerHTML = ranked
      .map(
        ({ item }) => `
      <div class="sr-item" data-id="${item.id}">
        <span class="sr-type">${item.type}</span>
        <div>
          <div class="sr-title">${escapeHtml(item.title)}</div>
          <div class="sr-meta">${escapeHtml(item.meta)}</div>
        </div>
      </div>`
      )
      .join("");
    panel.hidden = false;
    panel.querySelectorAll(".sr-item").forEach((el, i) => {
      el.addEventListener("click", () => {
        ranked[i].item.action();
        panel.hidden = true;
        const input = $("#globalSearch");
        if (input) input.value = "";
        addXP(2);
      });
    });
  }

  function setupSmartSearch() {
    const input = $("#globalSearch");
    const panel = $("#searchResultsPanel");
    if (!input) return;
    input.addEventListener("input", () => runSmartSearch(input.value));
    input.addEventListener("focus", () => {
      if (input.value.trim()) runSmartSearch(input.value);
    });
    document.addEventListener("click", (e) => {
      if (panel && !panel.contains(e.target) && e.target !== input) panel.hidden = true;
    });
    const btn = $("#searchBtn");
    if (btn) {
      btn.onclick = (e) => {
        e.preventDefault();
        runSmartSearch(input.value);
        if (!input.value.trim()) input.focus();
      };
    }
  }

  // ---------- Recommendations ----------
  function renderRecommendations() {
    const el = $("#recommendationsRow");
    if (!el) return;
    const data = window.sampleData || {};
    const mix = [
      ...(data.papers || []).slice(0, 3).map((p) => ({ title: p.title, meta: p.subject + " · " + p.year, kind: "paper", subject: p.subject, year: p.year })),
      ...(data.notes || []).slice(0, 2).map((n) => ({ title: n.title, meta: n.subject + " · Note", kind: "note", subject: n.subject })),
    ];
    el.innerHTML = mix
      .map(
        (r) => `
      <div class="rec-card" role="button" tabindex="0" data-kind="${r.kind}" data-title="${escapeHtml(r.title)}" data-subject="${escapeHtml(r.subject || "")}" data-year="${r.year || ""}">
        <h4>${escapeHtml(r.title)}</h4>
        <p>${escapeHtml(r.meta)}</p>
      </div>`
      )
      .join("");
    el.querySelectorAll(".rec-card").forEach((card) => {
      card.addEventListener("click", () => {
        openViewer({
          title: card.dataset.title,
          kind: card.dataset.kind,
          subject: card.dataset.subject,
          year: card.dataset.year,
        });
      });
    });
  }

  // ---------- Document Viewer + Annotations ----------
  const ANNOT_KEY = "hshs-annotations";

  function getAnnotations(docId) {
    const all = store.get(ANNOT_KEY, {});
    return all[docId] || { highlights: [], notes: [] };
  }
  function saveAnnotations(docId, data) {
    const all = store.get(ANNOT_KEY, {});
    all[docId] = data;
    store.set(ANNOT_KEY, all);
  }

  function openViewer(doc) {
    let overlay = $("#viewerOverlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "viewerOverlay";
      overlay.className = "viewer-overlay";
      overlay.hidden = true;
      document.body.appendChild(overlay);
    }
    const docId = (doc.kind || "doc") + "-" + (doc.title || "").replace(/\s+/g, "-").toLowerCase();
    const sampleBody =
      doc.kind === "note"
        ? generateNoteContent(doc)
        : generatePaperContent(doc);

    overlay.innerHTML = `
      <div class="viewer-toolbar">
        <button type="button" class="btn btn-ghost btn-sm" id="viewerClose" aria-label="Close">← Back</button>
        <span class="viewer-title">${escapeHtml(doc.title)}</span>
        <div class="viewer-actions">
          <button type="button" class="btn btn-outline btn-sm" id="viewerHighlight">Highlight</button>
          <button type="button" class="btn btn-outline btn-sm" id="viewerAddNote">Sticky note</button>
          <button type="button" class="btn btn-outline btn-sm" id="viewerFlash">Flashcards</button>
          <button type="button" class="btn btn-primary btn-sm" id="viewerPrint">Print / PDF</button>
        </div>
      </div>
      <div class="viewer-body">
        <div class="viewer-page" id="viewerPage">${sampleBody}</div>
      </div>
    `;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";

    $("#viewerClose").onclick = () => {
      overlay.hidden = true;
      document.body.style.overflow = "";
    };
    $("#viewerPrint").onclick = () => window.print();
    $("#viewerHighlight").onclick = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        alert("Select some text first, then click Highlight.");
        return;
      }
      try {
        const range = sel.getRangeAt(0);
        const span = document.createElement("span");
        span.className = "hl";
        range.surroundContents(span);
        sel.removeAllRanges();
        const ann = getAnnotations(docId);
        ann.highlights.push({ text: span.textContent, at: Date.now() });
        saveAnnotations(docId, ann);
        addXP(3);
      } catch {
        alert("Could not highlight that selection. Try a smaller range.");
      }
    };
    $("#viewerAddNote").onclick = () => {
      const text = prompt("Sticky note text:");
      if (!text) return;
      const page = $("#viewerPage");
      const note = document.createElement("div");
      note.className = "annotation-note";
      note.textContent = text;
      note.style.top = 40 + Math.random() * 40 + "%";
      note.style.right = 5 + Math.random() * 15 + "%";
      page.appendChild(note);
      const ann = getAnnotations(docId);
      ann.notes.push({ text, at: Date.now() });
      saveAnnotations(docId, ann);
      addXP(3);
    };
    $("#viewerFlash").onclick = () => openFlashcards(doc);
    bumpStreak();
    renderStreakBar();
    addXP(5);
  }

  function generatePaperContent(doc) {
    return `
      <h2>${escapeHtml(doc.title)}</h2>
      <p style="color:var(--text-muted);font-size:0.9rem;margin-block-end:1.5rem">${escapeHtml(doc.subject || "")} · ${escapeHtml(String(doc.year || ""))} · Past Paper</p>
      <p><strong>Instructions:</strong> Answer all questions. Show your working clearly. Time allowed: 2 hours 30 minutes.</p>
      <p><strong>Question 1.</strong> Solve the quadratic equation. Hence or otherwise find the roots of the related equation.</p>
      <p><strong>Question 2.</strong> A triangle has sides 5 cm, 12 cm and 13 cm. Show that it is right-angled and calculate its area.</p>
      <p><strong>Question 3.</strong> Explain the process of photosynthesis and write the balanced chemical equation.</p>
      <p style="margin-block-start:2rem;color:var(--text-muted);font-size:0.85rem"><em>Sample preview content — full papers would load as PDF via PDF.js in a production build. Use Highlight and Sticky note to annotate.</em></p>
    `;
  }

  function generateNoteContent(doc) {
    return `
      <h2>${escapeHtml(doc.title)}</h2>
      <p style="color:var(--text-muted);font-size:0.9rem;margin-block-end:1.5rem">${escapeHtml(doc.subject || "")} · Study Notes</p>
      <p>These notes summarise the key concepts for quick revision. Read actively, highlight important definitions, and turn difficult points into flashcards.</p>
      <p><strong>Key idea 1:</strong> Always define terms before applying them in exam answers.</p>
      <p><strong>Key idea 2:</strong> Use past-paper style questions immediately after reading a section to lock in understanding.</p>
      <p><strong>Key idea 3:</strong> Create a one-page summary of this topic before the next lesson.</p>
      <p style="margin-block-start:2rem;color:var(--text-muted);font-size:0.85rem"><em>Sample note body. In production, full note content or PDF would appear here.</em></p>
    `;
  }

  // ---------- Flashcards ----------
  function openFlashcards(doc) {
    let overlay = $("#flashOverlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "flashOverlay";
      overlay.className = "flash-overlay";
      overlay.hidden = true;
      document.body.appendChild(overlay);
    }
    const cards = [
      { front: "What is the main topic?", back: doc.title || "This resource" },
      { front: "Subject area?", back: doc.subject || "General" },
      { front: "Best revision tip?", back: "Active recall + spaced practice" },
      { front: "When should you review again?", back: "Tomorrow, then in 3 days, then in 1 week" },
    ];
    let idx = 0;
    let flipped = false;

    function render() {
      const c = cards[idx];
      overlay.innerHTML = `
        <div style="width:100%;max-width:420px">
          <div class="flash-progress">Card ${idx + 1} of ${cards.length} · ${escapeHtml(doc.title || "Flashcards")}</div>
          <div class="flash-card-wrap">
            <div class="flash-card ${flipped ? "flipped" : ""}" id="flashCard">
              <div class="flash-face front">
                <div class="flash-label">Question</div>
                <div class="flash-text">${escapeHtml(c.front)}</div>
              </div>
              <div class="flash-face back">
                <div class="flash-label">Answer</div>
                <div class="flash-text">${escapeHtml(c.back)}</div>
              </div>
            </div>
          </div>
          <div class="flash-controls">
            <button type="button" class="btn btn-outline" id="flashPrev">Previous</button>
            <button type="button" class="btn btn-primary" id="flashFlip">Flip</button>
            <button type="button" class="btn btn-outline" id="flashNext">Next</button>
            <button type="button" class="btn btn-ghost" id="flashClose">Close</button>
          </div>
        </div>
      `;
      $("#flashCard").onclick = () => {
        flipped = !flipped;
        render();
      };
      $("#flashFlip").onclick = () => {
        flipped = !flipped;
        render();
      };
      $("#flashPrev").onclick = () => {
        idx = (idx - 1 + cards.length) % cards.length;
        flipped = false;
        render();
      };
      $("#flashNext").onclick = () => {
        idx = (idx + 1) % cards.length;
        flipped = false;
        render();
        addXP(2);
      };
      $("#flashClose").onclick = () => {
        overlay.hidden = true;
      };
    }
    overlay.hidden = false;
    render();
    addXP(5);
    bumpStreak();
  }

  // ---------- Command Palette ----------
  function openCommandPalette() {
    let overlay = $("#cmdOverlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "cmdOverlay";
      overlay.className = "cmd-overlay";
      overlay.hidden = true;
      document.body.appendChild(overlay);
    }
    const commands = [
      { label: "Go to Home", meta: "Navigation", action: () => (location.href = "index.html") },
      { label: "Go to Online Learning", meta: "Navigation", action: () => (location.href = "learn.html") },
      { label: "Go to Chat", meta: "Navigation", action: () => (location.href = "chat.html") },
      { label: "Go to Community", meta: "Navigation", action: () => (location.href = "community.html") },
      { label: "Study Planner", meta: "Jump", action: () => { $("#planner")?.scrollIntoView({ behavior: "smooth" }); } },
      { label: "Toggle theme", meta: "Appearance", action: () => $("#themeToggle")?.click() },
      { label: "Open past papers", meta: "Jump", action: () => $("#papers")?.scrollIntoView({ behavior: "smooth" }) },
      { label: "Open notes", meta: "Jump", action: () => $("#notes")?.scrollIntoView({ behavior: "smooth" }) },
      { label: "Add exam to planner", meta: "Action", action: () => { $("#examSubject")?.focus(); $("#planner")?.scrollIntoView({ behavior: "smooth" }); } },
    ];

    let active = 0;
    let filtered = commands;

    function renderList(q = "") {
      filtered = q
        ? commands.filter((c) => (c.label + c.meta).toLowerCase().includes(q.toLowerCase()))
        : commands;
      active = 0;
      const list = $("#cmdResults");
      if (!list) return;
      if (filtered.length === 0) {
        list.innerHTML = `<div class="cmd-empty">No commands match</div>`;
        return;
      }
      list.innerHTML = filtered
        .map(
          (c, i) => `
        <div class="cmd-item ${i === active ? "active" : ""}" data-i="${i}">
          <div class="cmd-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l2 2"/></svg></div>
          <span>${escapeHtml(c.label)}</span>
          <span class="cmd-item-meta">${escapeHtml(c.meta)}</span>
        </div>`
        )
        .join("");
      list.querySelectorAll(".cmd-item").forEach((el) => {
        el.addEventListener("click", () => run(filtered[+el.dataset.i]));
      });
    }

    function run(cmd) {
      overlay.hidden = true;
      if (cmd) cmd.action();
    }

    overlay.innerHTML = `
      <div class="cmd-palette" role="dialog" aria-label="Command palette">
        <div class="cmd-input-wrap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input class="cmd-input" id="cmdInput" placeholder="Type a command or search..." autocomplete="off" />
        </div>
        <div class="cmd-results" id="cmdResults"></div>
        <div class="cmd-hint">
          <span><kbd>↑</kbd> <kbd>↓</kbd> navigate</span>
          <span><kbd>Enter</kbd> select</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    `;
    overlay.hidden = false;
    renderList();
    const input = $("#cmdInput");
    input.focus();
    input.addEventListener("input", () => renderList(input.value));
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        active = Math.min(active + 1, filtered.length - 1);
        renderList(input.value);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        active = Math.max(active - 1, 0);
        renderList(input.value);
      } else if (e.key === "Enter") {
        e.preventDefault();
        run(filtered[active]);
      } else if (e.key === "Escape") {
        overlay.hidden = true;
      }
    });
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.hidden = true;
    });
  }

  function setupCommandPalette() {
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openCommandPalette();
      }
    });
  }

  // ---------- Bottom Nav + FAB ----------
  function injectMobileChrome() {
    if ($("#bottomNav")) return;
    const nav = document.createElement("nav");
    nav.id = "bottomNav";
    nav.className = "bottom-nav";
    nav.setAttribute("aria-label", "Mobile navigation");
    const path = location.pathname.split("/").pop() || "index.html";
    nav.innerHTML = `
      <a href="index.html" class="bottom-nav-link ${path === "index.html" || path === "" ? "active" : ""}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Home
      </a>
      <a href="learn.html" class="bottom-nav-link ${path === "learn.html" ? "active" : ""}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
        Learn
      </a>
      <a href="chat.html" class="bottom-nav-link ${path === "chat.html" ? "active" : ""}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        Chat
      </a>
      <a href="community.html" class="bottom-nav-link ${path === "community.html" ? "active" : ""}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        Community
      </a>
    `;
    document.body.appendChild(nav);

    const fab = document.createElement("button");
    fab.id = "mainFab";
    fab.className = "fab";
    fab.type = "button";
    fab.title = "Quick actions (or press Ctrl+K)";
    fab.setAttribute("aria-label", "Quick actions");
    fab.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
    fab.onclick = () => openCommandPalette();
    document.body.appendChild(fab);
  }

  // ---------- Offline banner + basic PWA ----------
  function setupOffline() {
    const banner = document.createElement("div");
    banner.id = "offlineBanner";
    banner.className = "offline-banner";
    banner.textContent = "You’re offline — viewing cached content where available";
    document.body.prepend(banner);

    function update() {
      banner.classList.toggle("visible", !navigator.onLine);
    }
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    update();

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }

  // ---------- Student Showcase ----------
  function renderShowcase() {
    const el = $("#showcaseGrid");
    if (!el) return;
    const heroes = [
      { name: "Amina K.", role: "Top uploader · Maths", badge: "Resource Hero" },
      { name: "Brian O.", role: "Physics study group lead", badge: "Community Star" },
      { name: "Faith W.", role: "Most notes shared", badge: "Notes Champion" },
      { name: "Daniel M.", role: "7-day study streak", badge: "Streak Master" },
    ];
    el.innerHTML = heroes
      .map((h) => {
        const pic = `https://ui-avatars.com/api/?name=${encodeURIComponent(h.name)}&background=4f46e5&color=fff&size=128&bold=true&format=svg`;
        return `
        <div class="showcase-card reveal">
          <img class="showcase-avatar" src="${pic}" alt="" width="64" height="64" />
          <div class="showcase-name">${escapeHtml(h.name)}</div>
          <div class="showcase-role">${escapeHtml(h.role)}</div>
          <span class="showcase-badge">${escapeHtml(h.badge)}</span>
        </div>`;
      })
      .join("");
  }

  // ---------- Wire paper/note buttons to viewer ----------
  function enhanceResourceButtons() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".paper-actions .btn");
      if (!btn) return;
      const card = btn.closest(".paper-card, .card");
      if (!card) return;
      const title = card.querySelector("h3")?.textContent?.trim() || "Resource";
      const meta = card.querySelector(".paper-meta")?.textContent || "";
      const isNote = btn.textContent.toLowerCase().includes("view") || meta.toLowerCase().includes("pages");
      const subject = meta.split("·")[0]?.trim() || "";
      e.preventDefault();
      openViewer({
        title,
        kind: isNote ? "note" : "paper",
        subject,
        year: meta.match(/20\d{2}/)?.[0] || "",
      });
    });
  }

  // ---------- Accent picker in header ----------
  function injectAccentPicker() {
    const actions = $(".header-actions");
    if (!actions || $("#accentPicker")) return;
    const wrap = document.createElement("div");
    wrap.id = "accentPicker";
    wrap.className = "accent-picker";
    wrap.setAttribute("title", "Accent colour");
    wrap.innerHTML = `
      <button type="button" class="accent-swatch" data-accent="indigo" aria-label="Indigo accent"></button>
      <button type="button" class="accent-swatch" data-accent="emerald" aria-label="Emerald accent"></button>
      <button type="button" class="accent-swatch" data-accent="violet" aria-label="Violet accent"></button>
      <button type="button" class="accent-swatch" data-accent="amber" aria-label="Amber accent"></button>
    `;
    const themeBtn = $("#themeToggle");
    if (themeBtn) actions.insertBefore(wrap, themeBtn);
    else actions.prepend(wrap);
    initAccent();
  }

  // ---------- Skeleton loading simulation ----------
  function runSkeletons() {
    const grids = ["#featuredPapers", "#popularNotes", "#quickAccessCards", "#subjectsGrid"];
    grids.forEach((sel) => {
      const el = $(sel);
      if (!el || el.children.length > 0) return;
      el.innerHTML = Array.from({ length: 4 })
        .map(() => `<div class="skeleton skeleton-card"></div>`)
        .join("");
    });
  }

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str == null ? "" : String(str);
    return d.innerHTML;
  }

  // ---------- Expose for other scripts ----------
  window.HSHSAdvanced = {
    openViewer,
    openFlashcards,
    openCommandPalette,
    addXP,
    bumpStreak,
  };

  // ---------- Boot ----------
  function boot() {
    if (typeof sampleData !== "undefined") window.sampleData = sampleData;

    injectAccentPicker();
    injectMobileChrome();
    setupOffline();
    setupCommandPalette();
    setupSmartSearch();
    setupExamForm();
    enhanceResourceButtons();

    renderStreakBar();
    renderPlanner();
    renderRecommendations();
    renderShowcase();

    bumpStreak();
    renderStreakBar();

    runSkeletons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
