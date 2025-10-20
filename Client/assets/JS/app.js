(function () {
  if (!localStorage.getItem('inspire-data')) {
    localStorage.setItem('inspire-data', JSON.stringify(window.SEED));
  }
  const DATA = () => JSON.parse(localStorage.getItem('inspire-data') || '{}');
  const SAVE = (d) => localStorage.setItem('inspire-data', JSON.stringify(d));

  const themeToggle = document.getElementById('themeToggle');
  const storedTheme = localStorage.getItem('theme') || 'light';
  if (storedTheme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  if (themeToggle) themeToggle.textContent = storedTheme === 'dark' ? 'Light' : 'Dark';
  themeToggle &&
    themeToggle.addEventListener('click', () => {
      const active = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', active === 'dark' ? 'dark' : '');
      localStorage.setItem('theme', active);
      themeToggle.textContent = active === 'dark' ? 'Light' : 'Dark';
    });

  const langToggle = document.getElementById('langToggle');
  const curLang = localStorage.getItem('lang') || 'en';
  langToggle && (langToggle.textContent = curLang === 'en' ? 'ES' : 'EN');
  langToggle &&
    langToggle.addEventListener('click', () => {
      const next = localStorage.getItem('lang') === 'en' ? 'es' : 'en';
      localStorage.setItem('lang', next);
      langToggle.textContent = next === 'en' ? 'ES' : 'EN';
      applyLanguage(next);
    });

  function applyLanguage(code) {
    if (code === 'es') {
      document.getElementById('heroTagline') &&
        (document.getElementById('heroTagline').textContent =
          'Tutoría, prácticas y apoyo académico para cada estudiante.');
      document.getElementById('ctaGetHelp') &&
        (document.getElementById('ctaGetHelp').textContent = 'Obtener tutoría');
      document.getElementById('ctaDonate') &&
        (document.getElementById('ctaDonate').textContent = 'Donar');
    } else {
      document.getElementById('heroTagline') &&
        (document.getElementById('heroTagline').textContent =
          'Tutoring, internships, and academic support to empower students.');
      document.getElementById('ctaGetHelp') &&
        (document.getElementById('ctaGetHelp').textContent = 'Get Tutoring');
      document.getElementById('ctaDonate') &&
        (document.getElementById('ctaDonate').textContent = 'Donate');
    }
  }
  applyLanguage(localStorage.getItem('lang') || 'en');

  function renderStatsAndLists() {
    const d = DATA();
    if (!d || !d.stats) return;
    document.getElementById('statRaised') &&
      (document.getElementById('statRaised').textContent = `$${d.stats.totalRaised.toLocaleString()}`);
    document.getElementById('statDonors') &&
      (document.getElementById('statDonors').textContent = d.stats.donors);
    document.getElementById('statTutors') &&
      (document.getElementById('statTutors').textContent = d.stats.tutors);
    document.getElementById('statMatches') &&
      (document.getElementById('statMatches').textContent = d.stats.matches);

    const fEl = document.getElementById('featuredList');
    if (fEl) {
      fEl.innerHTML = '';
      (d.tutors || [])
        .slice(0, 3)
        .forEach((t) => {
          const col = document.createElement('div');
          col.className = 'col-md-4';
          col.innerHTML = `<div class="card h-100 shadow-sm"><img src="${t.img}" alt="${t.name}" class="card-img-top"><div class="card-body"><h3 class="h6 mb-1">${t.name} <small class="text-muted">(${t.rating})</small></h3><p class="mb-1">${t.bio}</p><p class="mb-0"><strong>${t.rate === 0 ? 'Free' : '$' + t.rate + '/hr'}</strong></p></div></div>`;
          fEl.appendChild(col);
        });
    }

    const postsEl = document.getElementById('adminPosts');
    if (postsEl) {
      postsEl.innerHTML = '';
      (d.adminPosts || []).forEach((p) => {
        const item = document.createElement('div');
        item.className = 'list-group-item';
        item.innerHTML = `<h4 class="h6 mb-1">${p.title}</h4><p class="mb-1">${p.body}</p><div class="text-muted small">${new Date(p.date).toLocaleString()}</div>`;
        postsEl.appendChild(item);
      });
    }
  }
  renderStatsAndLists();
  
    // tutor search
  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const subject = document.getElementById('subject').value.trim().toLowerCase();
      const mode = document.getElementById('mode').value;
      const rating = Number(document.getElementById('rating').value);
      const d = DATA();
      let list = (d.tutors || []).filter((t) => {
        const sMatch = subject ? t.subjects.join(' ').toLowerCase().includes(subject) : true;
        const mMatch = mode === 'any' ? true : mode === 'virtual' ? t.virtual === true : t.virtual === false;
        const rMatch = t.rating >= rating;
        return sMatch && mMatch && rMatch;
      });
      const out = document.getElementById('results');
      out.innerHTML = '';
      if (list.length === 0) out.innerHTML = '<p>No tutors found. Try another search or create a profile below.</p>';
      list.forEach((t) => {
        const div = document.createElement('div');
        div.className = 'card mb-3';
        div.innerHTML = `<div class="row g-0"><div class="col-md-3"><img src="${t.img}" alt="${t.name}" class="img-fluid rounded-start"></div><div class="col-md-9"><div class="card-body"><h5 class="mb-1">${t.name} <small class="text-muted">(${t.rating})</small></h5><p class="mb-1">${t.bio}</p><p class="mb-0"><strong>${t.rate === 0 ? 'Free' : '$' + t.rate + '/hr'}</strong> · ${t.subjects.join(', ')}</p><div class="mt-2"><button class="btn btn-sm btn-primary" onclick="requestMatch(${t.id})">Request Match</button></div></div></div></div>`;
        out.appendChild(div);
      });
    });
  }

  // create tutor profile
  const createBtn = document.getElementById('createTutorBtn');
  if (createBtn) {
    createBtn.addEventListener('click', () => {
      const d = DATA();
      const name = document.getElementById('tutorName').value.trim() || 'New Tutor';
      const email = document.getElementById('tutorEmail').value.trim() || '';
      const subjects = (document.getElementById('tutorSubjects').value || '').split(',').map((s) => s.trim()).filter(Boolean);
      const rate = Number(document.getElementById('tutorRate').value) || 0;
      const virtual = document.getElementById('tutorVirtual').value === 'yes';
      const bio = document.getElementById('tutorBio').value.trim() || '';
      const nextId = Math.max(0, ...(d.tutors || []).map((t) => t.id)) + 1;
      const newTutor = { id: nextId, name, email, subjects, rate, virtual, bio, rating: 4.5, img: 'assets/img/tutor-1.jpg' };
      d.tutors = d.tutors || [];
      d.tutors.push(newTutor);
      d.stats.tutors = (d.stats.tutors || 0) + 1;
      SAVE(d);
      alert('Tutor profile created (demo). It will appear in searches.');
      renderStatsAndLists();
    });
  }

  // match request
  window.requestMatch = function (tutorId) {
    const d = DATA();
    d.stats.matches = (d.stats.matches || 0) + 1;
    SAVE(d);
    alert('Match requested (demo). For real matching, connect to a backend.');
    renderStatsAndLists();
  };

  // portal login
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const email = document.getElementById('loginEmail').value.trim() || 'demo@inspire-edu.org';
      const role = document.getElementById('loginRole').value;
      const user = { email, role, name: email.split('@')[0], id: Date.now() };
      localStorage.setItem('inspire-user', JSON.stringify(user));
      alert('Logged in (demo) as ' + role);
    });
  }

  // messaging
  const sendMsgBtn = document.getElementById('sendMsgBtn');
  if (sendMsgBtn) {
    sendMsgBtn.addEventListener('click', () => {
      const user = JSON.parse(localStorage.getItem('inspire-user') || '{}');
      if (!user || !user.email) return alert('Please login in portal first (demo).');
      const text = document.getElementById('msgText').value.trim();
      if (!text) return;
      const d = DATA();
      d.messages = d.messages || [];
      d.messages.push({ id: Date.now(), sender: user.email, content: text, date: new Date().toISOString() });
      SAVE(d);
      document.getElementById('msgText').value = '';
      renderMessages();
    });
  }

  function renderMessages() {
    const box = document.getElementById('messagesBox');
    if (!box) return;
    const d = DATA();
    box.innerHTML = '';
    (d.messages || []).slice(-200).forEach((m) => {
      const div = document.createElement('div');
      div.className = 'mb-2';
      div.innerHTML = `<div class="small text-muted">${m.sender} · ${new Date(m.date).toLocaleString()}</div><div>${m.content}</div>`;
      box.appendChild(div);
    });
  }
  renderMessages();

  // report upload
  const uploadReportBtn = document.getElementById('uploadReportBtn');
  if (uploadReportBtn) {
    uploadReportBtn.addEventListener('click', () => {
      const fileInput = document.getElementById('reportFile');
      const title = document.getElementById('reportTitle').value || 'Report';
      if (!fileInput.files.length) return alert('Choose a PDF file first.');
      const file = fileInput.files[0];
      if (file.type !== 'application/pdf') return alert('Please upload a PDF.');
      const reader = new FileReader();
      reader.onload = function (e) {
        const dataURL = e.target.result;
        const d = DATA();
        d.reports = d.reports || [];
        d.reports.push({
          id: Date.now(),
          uploader: JSON.parse(localStorage.getItem('inspire-user') || '{}').email || 'anonymous',
          title,
          filename: file.name,
          dataURL,
          date: new Date().toISOString(),
        });
        SAVE(d);
        alert('Report uploaded (demo). Stored in this browser only.');
      };
      reader.readAsDataURL(file);
    });
  }

  // admin posts
  const postBtn = document.getElementById('postPortalBtn');
  if (postBtn) {
    postBtn.addEventListener('click', () => {
      const t = document.getElementById('portalPostText').value.trim();
      if (!t) return alert('Write a post first.');
      const d = DATA();
      d.adminPosts = d.adminPosts || [];
      d.adminPosts.unshift({ id: Date.now(), title: 'Posted', body: t, date: new Date().toISOString() });
      SAVE(d);
      document.getElementById('portalPostText').value = '';
      renderStatsAndLists();
      alert('Posted (demo).');
    });
  }

  function renderPortalPosts() {
    const el = document.getElementById('portalPosts');
    if (!el) return;
    const d = DATA();
    el.innerHTML = '';
    (d.adminPosts || []).forEach((p) => {
      const node = document.createElement('div');
      node.className = 'list-group-item';
      node.innerHTML = `<div class="fw-bold">${p.title}</div><div class="small text-muted">${new Date(p.date).toLocaleString()}</div><div>${p.body}</div>`;
      el.appendChild(node);
    });
  }
  renderPortalPosts();

  // footer year
  const yearNode = document.getElementById('year');
  if (yearNode) yearNode.textContent = new Date().getFullYear();
})();