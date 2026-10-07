(() => {
  const root = document.documentElement;
  const saved = localStorage.getItem('hshs-theme');
  if (saved) root.dataset.theme = saved;
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches) root.dataset.theme = 'dark';

  const theme = document.getElementById('hubTheme');
  theme?.addEventListener('click', () => {
    const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = t;
    localStorage.setItem('hshs-theme', t);
  });

  /* Ensure panels never block the page on load */
  const studyPanel = document.getElementById('studyPanel');
  const labModal = document.getElementById('labModal');
  if (studyPanel) studyPanel.hidden = true;
  if (labModal) labModal.hidden = true;

  /* —— Digital Library —— */
  const resources = [
    ['Biology', 'Cell Structure', 'Notes · Revision'],
    ['Biology', 'Photosynthesis', 'Notes · Practice'],
    ['Biology', 'Genetics & Inheritance', 'Notes · Diagrams'],
    ['Mathematics', 'Algebra', 'Worked examples · Questions'],
    ['Mathematics', 'Trigonometry', 'Notes · Practice'],
    ['Mathematics', 'Calculus Basics', 'Notes · Examples'],
    ['Chemistry', 'Acids & Bases', 'Notes · Revision'],
    ['Chemistry', 'Organic Chemistry', 'Notes · Reactions'],
    ['Physics', 'Electricity', 'Concepts · Practice'],
    ['Physics', 'Mechanics', 'Notes · Formulas'],
    ['ICT', 'Web Development', 'HTML · CSS · JavaScript'],
    ['ICT', 'Python Programming', 'Basics · Exercises'],
    ['English', 'Writing Skills', 'Guides · Practice'],
    ['Geography', 'Physical Geography', 'Notes · Questions'],
    ['History', 'East African History', 'Notes · Timeline']
  ];
  const rg = document.getElementById('resourceGrid');
  const renderResources = (q = '') => {
    if (!rg) return;
    const x = q.toLowerCase();
    const filtered = resources.filter(r => r.join(' ').toLowerCase().includes(x));
    rg.innerHTML = filtered.length
      ? filtered.map(r => `<article class="resource"><b>${r[0]}</b><h3>${r[1]}</h3><p>${r[2]}</p><a class="text-btn" href="#learning">Open resource →</a></article>`).join('')
      : '<p class="muted">No matching resource yet. Try another search.</p>';
  };
  renderResources();
  document.getElementById('librarySearch')?.addEventListener('input', e => renderResources(e.target.value));
  document.getElementById('hubSearch')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const lib = document.getElementById('librarySearch');
      if (lib) lib.value = e.target.value;
      renderResources(e.target.value);
      location.hash = 'library';
    }
  });

  /* —— Smart Study Assistant —— */
  const studyOutput = document.getElementById('studyOutput');
  document.querySelectorAll('[data-prompt]').forEach(b => b.addEventListener('click', () => {
    const prompt = b.dataset.prompt;
    if (studyPanel) studyPanel.hidden = false;
    if (studyOutput) {
      const responses = {
        'Explain a topic': 'Pick a subject below, then type a topic (e.g. photosynthesis). You will get a simple explanation, key points, and a short practice question.',
        'Practice me': 'Choose a subject and difficulty. You will receive practice steps with answers you can work through.',
        'Revision mode': 'Select topics you want to revise. The hub will build a short checklist using local storage.'
      };
      const key = Object.keys(responses).find(k => prompt.toLowerCase().includes(k.toLowerCase().split(' ')[0])) || prompt;
      studyOutput.innerHTML = `<p><strong>Mode:</strong> ${prompt}</p><p>${responses[key] || 'Type a topic in the box below and press Go to start.'}</p>`;
    }
    document.getElementById('studyTopic')?.focus();
  }));
  document.getElementById('studyGo')?.addEventListener('click', () => {
    const topic = (document.getElementById('studyTopic')?.value || '').trim();
    const subject = document.getElementById('studySubject')?.value || 'General';
    if (!topic) { alert('Enter a topic first.'); return; }
    if (studyOutput) {
      studyOutput.innerHTML = `
        <p><strong>${subject} — ${topic}</strong></p>
        <p><em>Key points (study plan):</em></p>
        <ol>
          <li>Define the core concept in one sentence.</li>
          <li>List 3–5 important terms and what they mean.</li>
          <li>Sketch or note one diagram / formula if relevant.</li>
          <li>Answer one past-paper style question from the Resources section.</li>
          <li>Explain the topic out loud to a classmate or in Chat.</li>
        </ol>
        <p class="muted">Local study coach — you can connect a real AI or school content API later.</p>`;
    }
  });
  document.getElementById('closeStudy')?.addEventListener('click', () => {
    if (studyPanel) studyPanel.hidden = true;
  });
  studyPanel?.addEventListener('click', e => { if (e.target === studyPanel) studyPanel.hidden = true; });

  /* —— Virtual Laboratory —— */
  const labTitle = document.getElementById('labTitle');
  const labBody = document.getElementById('labBody');
  const labContent = {
    Biology: {
      title: 'Biology Virtual Lab',
      html: `
        <p>Explore cell structure safely. Click a part to learn more.</p>
        <div class="lab-parts">
          <button data-part="nucleus">Nucleus</button>
          <button data-part="mitochondria">Mitochondria</button>
          <button data-part="membrane">Cell membrane</button>
          <button data-part="chloroplast">Chloroplast</button>
        </div>
        <div id="labFact" class="lab-fact">Select a cell part above.</div>`
    },
    Chemistry: {
      title: 'Chemistry Virtual Lab',
      html: `
        <p>Mix virtual solutions and observe the result (demo).</p>
        <div class="lab-mix">
          <select id="chemA"><option>Acid</option><option>Base</option><option>Water</option><option>Salt solution</option></select>
          <span>+</span>
          <select id="chemB"><option>Base</option><option>Acid</option><option>Indicator</option><option>Metal</option></select>
          <button id="chemMix">Mix</button>
        </div>
        <div id="labFact" class="lab-fact">Choose two substances and press Mix.</div>`
    },
    Physics: {
      title: 'Physics Virtual Lab',
      html: `
        <p>Simple circuit demo — toggle components.</p>
        <div class="lab-circuit">
          <label><input type="checkbox" id="phyBattery" checked> Battery</label>
          <label><input type="checkbox" id="phySwitch"> Switch closed</label>
          <label><input type="checkbox" id="phyBulb" checked> Bulb</label>
        </div>
        <div id="labFact" class="lab-fact">Close the switch with battery + bulb on to light the circuit.</div>`
    }
  };
  const partFacts = {
    nucleus: 'The nucleus holds DNA and controls cell activities.',
    mitochondria: 'Mitochondria produce energy (ATP) through respiration.',
    membrane: 'The cell membrane controls what enters and leaves the cell.',
    chloroplast: 'Chloroplasts capture light for photosynthesis (plants).'
  };
  document.querySelectorAll('[data-lab]').forEach(b => b.addEventListener('click', () => {
    const name = b.dataset.lab;
    const data = labContent[name];
    if (!data || !labModal) return;
    if (labTitle) labTitle.textContent = data.title;
    if (labBody) labBody.innerHTML = data.html;
    labModal.hidden = false;

    labBody.querySelectorAll('[data-part]').forEach(btn => {
      btn.addEventListener('click', () => {
        const fact = document.getElementById('labFact');
        if (fact) fact.textContent = partFacts[btn.dataset.part] || '';
      });
    });
    document.getElementById('chemMix')?.addEventListener('click', () => {
      const a = document.getElementById('chemA')?.value;
      const b2 = document.getElementById('chemB')?.value;
      const fact = document.getElementById('labFact');
      if (!fact) return;
      if ((a === 'Acid' && b2 === 'Base') || (a === 'Base' && b2 === 'Acid')) fact.textContent = 'Neutralisation → salt + water. Heat may be released.';
      else if (b2 === 'Indicator') fact.textContent = 'Indicator changes colour depending on pH (acid / base / neutral).';
      else if (a === 'Acid' && b2 === 'Metal') fact.textContent = 'Acid + metal often produces a salt and hydrogen gas.';
      else fact.textContent = `Mixing ${a} with ${b2}: observe carefully in a real lab under teacher supervision.`;
    });
    const updateCircuit = () => {
      const bat = document.getElementById('phyBattery')?.checked;
      const sw = document.getElementById('phySwitch')?.checked;
      const bulb = document.getElementById('phyBulb')?.checked;
      const fact = document.getElementById('labFact');
      if (!fact) return;
      if (bat && sw && bulb) fact.textContent = '💡 Circuit complete — the bulb lights up!';
      else if (!bat) fact.textContent = 'No power source — add the battery.';
      else if (!sw) fact.textContent = 'Switch is open — close it to complete the circuit.';
      else fact.textContent = 'Bulb is off the circuit — turn it on.';
    };
    ['phyBattery', 'phySwitch', 'phyBulb'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', updateCircuit);
    });
  }));
  document.getElementById('closeLab')?.addEventListener('click', () => { if (labModal) labModal.hidden = true; });
  labModal?.addEventListener('click', e => { if (e.target === labModal) labModal.hidden = true; });

  /* —— Exam planner —— */
  let exams = JSON.parse(localStorage.getItem('hshs-hub-exams') || '[]');
  const list = document.getElementById('examItems');
  function draw() {
    if (!list) return;
    list.innerHTML = exams.length
      ? exams.sort((a, b) => a.date.localeCompare(b.date)).map((e, i) =>
          `<div class="exam-item"><span><b>${e.name}</b><br><small>${e.date}</small></span><button data-del="${i}" aria-label="Remove">×</button></div>`
        ).join('')
      : '<p class="muted">No exams added yet.</p>';
    list.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
      exams.splice(+b.dataset.del, 1);
      localStorage.setItem('hshs-hub-exams', JSON.stringify(exams));
      draw();
      tick();
    });
  }
  draw();
  document.getElementById('examAdd')?.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('examName')?.value;
    const date = document.getElementById('examDate')?.value;
    if (!name || !date) return;
    exams.push({ name, date });
    localStorage.setItem('hshs-hub-exams', JSON.stringify(exams));
    e.target.reset();
    draw();
    tick();
  });

  const countdown = document.getElementById('examCountdown');
  function tick() {
    if (!countdown) return;
    const future = exams.filter(e => new Date(e.date + 'T00:00:00') > new Date()).sort((a, b) => a.date.localeCompare(b.date))[0];
    if (!future) { countdown.textContent = 'Add an exam to start a countdown'; return; }
    const d = Math.ceil((new Date(future.date + 'T00:00:00') - new Date()) / 86400000);
    countdown.textContent = future.name + ' · ' + d + ' day' + (d === 1 ? '' : 's');
  }
  tick();
  setInterval(tick, 60000);

  /* —— Checklist persistence —— */
  document.querySelectorAll('.exam-panel label input[type=checkbox]').forEach((cb, i) => {
    const key = 'hshs-hub-check-' + i;
    cb.checked = localStorage.getItem(key) === '1';
    cb.addEventListener('change', () => localStorage.setItem(key, cb.checked ? '1' : '0'));
  });

  console.log('%cHSHS Academic Hub ready — open access', 'color:#635bff;font-weight:bold');
})();
