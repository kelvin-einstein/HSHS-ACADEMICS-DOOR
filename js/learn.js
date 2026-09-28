/**
 * Online Learning page – HSHS Academics Door
 */
(function () {
  const ICON = {
    video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    quiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    assign: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    progress: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
    live: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
    discuss: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    cert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    ai: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 10v1a4 4 0 0 1-8 0v-1"/><path d="M8 14h.01M16 14h.01"/><path d="M9 18h6"/></svg>'
  };

  const features = [
    { title: "Video Lessons", desc: "On-demand recorded lessons you can watch anytime, pause and rewind.", icon: ICON.video },
    { title: "Structured Courses", desc: "Modules, units and learning paths organised by subject and level.", icon: ICON.book },
    { title: "Quizzes & Tests", desc: "Interactive quizzes with instant feedback and score tracking.", icon: ICON.quiz },
    { title: "Assignments", desc: "Submit homework online, get deadlines and teacher feedback.", icon: ICON.assign },
    { title: "Progress Tracking", desc: "See completion rates, streaks and weak topics at a glance.", icon: ICON.progress },
    { title: "Live Classes", desc: "Join real-time sessions with teachers and classmates.", icon: ICON.live },
    { title: "Discussion Forums", desc: "Ask questions, share tips and study together.", icon: ICON.discuss },
    { title: "Certificates", desc: "Earn digital certificates and badges when you finish courses.", icon: ICON.cert },
    { title: "Class Schedule", desc: "Calendar of upcoming lessons, exams and live sessions.", icon: ICON.calendar },
    { title: "Study Groups", desc: "Form or join groups for collaborative revision.", icon: ICON.users },
    { title: "Offline Downloads", desc: "Save notes and lessons for offline study.", icon: ICON.download },
    { title: "AI Study Helper", desc: "Get hints, summaries and practice questions powered by AI.", icon: ICON.ai }
  ];

  const courses = [
    { id: 1, title: "Form 4 Mathematics – Paper 1", cat: "math", tag: "Mathematics", lessons: 18, pct: 72, desc: "Algebra, geometry and calculus foundations for national exams." },
    { id: 2, title: "Organic Chemistry Mastery", cat: "science", tag: "Chemistry", lessons: 12, pct: 45, desc: "Functional groups, reactions and exam-style practice." },
    { id: 3, title: "Cell Biology & Genetics", cat: "science", tag: "Biology", lessons: 14, pct: 90, desc: "From cell structure to inheritance and DNA." },
    { id: 4, title: "English Literature – Set Texts", cat: "languages", tag: "English", lessons: 10, pct: 30, desc: "Analysis, essays and themes for Form 4 literature." },
    { id: 5, title: "Newton's Laws & Motion", cat: "science", tag: "Physics", lessons: 9, pct: 55, desc: "Forces, energy and practical problem-solving." },
    { id: 6, title: "Quadratic Equations Deep Dive", cat: "math", tag: "Mathematics", lessons: 8, pct: 100, desc: "Factoring, formula and graphing — fully complete." }
  ];

  const liveClasses = [
    { title: "Chemistry – Organic Revision", teacher: "Mr. Okello", time: "Live now · 45 min left", live: true },
    { title: "Mathematics Paper 2 Workshop", teacher: "Ms. Achieng", time: "Today · 4:00 PM", live: false },
    { title: "Biology Practical Prep", teacher: "Dr. Nabwire", time: "Tomorrow · 10:00 AM", live: false }
  ];

  const assignments = [
    { title: "Maths – Simultaneous equations set", due: "Due in 2 days" },
    { title: "Chemistry lab report – Rates", due: "Due Friday" },
    { title: "English essay – Character study", due: "Due next week" }
  ];

  const quizzes = [
    { title: "Physics – Forces quiz", due: "Available now · 15 min" },
    { title: "Biology – Cells checkpoint", due: "Available · 10 questions" },
    { title: "History – Independence era", due: "Opens Thursday" }
  ];

  const certs = [
    { title: "Quadratic Equations", detail: "Completed · Sep 2026" },
    { title: "Cell Biology", detail: "Completed · Aug 2026" },
    { title: "Study Streak – 7 days", detail: "Badge earned" }
  ];

  function renderFeatures() {
    const el = document.getElementById("learnFeatures");
    if (!el) return;
    el.innerHTML = features.map(f => `
      <article class="learn-feature reveal">
        <div class="learn-feature-icon">${f.icon}</div>
        <h3>${f.title}</h3>
        <p>${f.desc}</p>
      </article>`).join("");
  }

  function renderCourses(filter = "all") {
    const el = document.getElementById("coursesGrid");
    if (!el) return;
    const list = filter === "all" ? courses : courses.filter(c => c.cat === filter);
    el.innerHTML = list.map(c => `
      <article class="course-card reveal" data-cat="${c.cat}">
        <div class="course-cover">${ICON.book}</div>
        <div class="course-body">
          <div class="course-meta"><span class="course-tag">${c.tag}</span><span class="course-tag">${c.lessons} lessons</span></div>
          <h3>${c.title}</h3>
          <p class="card-desc">${c.desc}</p>
          <div class="course-footer">
            <div class="course-progress-bar" aria-hidden="true"><span style="width:${c.pct}%"></span></div>
            <span class="course-pct">${c.pct}%</span>
          </div>
          <button type="button" class="btn btn-primary btn-sm" style="margin-block-start:0.85rem;width:100%" onclick="alert('Opening course: ${c.title.replace(/'/g, "\\'")}')">${c.pct === 100 ? "Review" : c.pct > 0 ? "Continue" : "Start"}</button>
        </div>
      </article>`).join("");
  }

  function renderLive() {
    const el = document.getElementById("liveGrid");
    if (!el) return;
    el.innerHTML = liveClasses.map(l => `
      <div class="live-card reveal">
        <span class="live-indicator ${l.live ? "" : "upcoming"}" aria-hidden="true"></span>
        <div>
          <h3>${l.title}</h3>
          <p class="meta">${l.teacher} · ${l.time}</p>
          <button type="button" class="btn ${l.live ? "btn-primary" : "btn-outline"} btn-sm">${l.live ? "Join now" : "Set reminder"}</button>
        </div>
      </div>`).join("");
  }

  function renderAssess() {
    const aEl = document.getElementById("assignmentsList");
    const qEl = document.getElementById("quizzesList");
    if (aEl) {
      aEl.innerHTML = assignments.map(a => `
        <div class="assess-item reveal">
          <div><h4>${a.title}</h4><span class="due">${a.due}</span></div>
          <button type="button" class="btn btn-outline btn-sm">Open</button>
        </div>`).join("");
    }
    if (qEl) {
      qEl.innerHTML = quizzes.map(q => `
        <div class="assess-item reveal">
          <div><h4>${q.title}</h4><span class="due">${q.due}</span></div>
          <button type="button" class="btn btn-primary btn-sm">Start</button>
        </div>`).join("");
    }
  }

  function renderCerts() {
    const el = document.getElementById("certsGrid");
    if (!el) return;
    el.innerHTML = certs.map(c => `
      <div class="cert-card reveal">
        <div class="cert-icon">${ICON.cert}</div>
        <h3>${c.title}</h3>
        <p>${c.detail}</p>
      </div>`).join("");
  }

  function setupFilters() {
    document.querySelectorAll(".chip").forEach(chip => {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        renderCourses(chip.dataset.filter || "all");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderFeatures();
    renderCourses();
    renderLive();
    renderAssess();
    renderCerts();
    setupFilters();
  });
})();
