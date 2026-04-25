// Unilessons — interactive logic + theme + tweaks
(function(){
  const data = window.UNILESSONS_DATA || [];
  const PHONE = '+393285733478';

  const isUni = (b) => b.id.startsWith('facolta-');
  const uni = data.filter(isUni);
  const hs = data.filter(b => !isUni(b));
  const AREA_PRIORITY = ['Scienze', 'Ingegneria'];
  const allAreas = Array.from(new Set(uni.map(b => b.area))).sort((a, b) => {
    const pa = AREA_PRIORITY.indexOf(a) !== -1 ? AREA_PRIORITY.indexOf(a) : 999;
    const pb = AREA_PRIORITY.indexOf(b) !== -1 ? AREA_PRIORITY.indexOf(b) : 999;
    return pa !== pb ? pa - pb : a.localeCompare(b);
  });
  const hsAreas = Array.from(new Set(hs.map(b => b.area))).sort();

  let activeTab = 'uni';
  let activeArea = 'Tutte';
  let query = '';

  // ---- THEME ----
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('uni_theme') || 'light';
  root.setAttribute('data-theme', savedTheme);

  function setTheme(t){
    root.setAttribute('data-theme', t);
    document.body.style.removeProperty('background-color');
    document.body.style.removeProperty('cursor');
    localStorage.setItem('uni_theme', t);
    document.querySelectorAll('#twTheme button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === t ? 'true' : 'false'));
  }
  // strip any inline overrides injected by external tools on first load
  document.body.style.removeProperty('background-color');
  document.body.style.removeProperty('cursor');
  document.getElementById('themeToggle').addEventListener('click', () => {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  // ---- ACCENT ----
  const accents = {
    azure:   {p:'#1d6fe0', p2:'#3a92ff', pDark:'#5aa9ff', p2Dark:'#8fc4ff'},
    sky:     {p:'#0284c7', p2:'#0ea5e9', pDark:'#38bdf8', p2Dark:'#7dd3fc'},
    yellow:  {p:'#d4a615', p2:'#f5c518', pDark:'#ffd95a', p2Dark:'#ffe78a'},
    amber:   {p:'#d97706', p2:'#f59e0b', pDark:'#fbbf24', p2Dark:'#fcd34d'},
    emerald: {p:'#059669', p2:'#10b981', pDark:'#34d399', p2Dark:'#6ee7b7'},
  };
  function setAccent(name){
    const a = accents[name]; if (!a) return;
    const isDark = root.getAttribute('data-theme') === 'dark';
    root.style.setProperty('--primary', isDark ? a.pDark : a.p);
    root.style.setProperty('--primary-2', isDark ? a.p2Dark : a.p2);
    localStorage.setItem('uni_accent', name);
    document.querySelectorAll('#twAccent button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === name ? 'true' : 'false'));
  }
  const savedAccent = localStorage.getItem('uni_accent') || 'azure';
  setAccent(savedAccent);
  // Re-apply accent on theme change
  new MutationObserver(() => setAccent(localStorage.getItem('uni_accent') || 'azure'))
    .observe(root, {attributes:true, attributeFilter:['data-theme']});


  // ---- MARQUEE ----
  const subjects = [
    'Matematica','Fisica','Analisi 1','Algebra Lineare','Statistica','Chimica',
    'Giurisprudenza','Diritto Privato','Economia','Microeconomia','Informatica',
    'Programmazione','Lettere','Filosofia','Biologia','Medicina','Ingegneria',
    'Maturità','Liceo Scientifico','Liceo Classico'
  ];
  const tk = document.getElementById('mqTrack');
  const mqHtml = subjects.map(s => `<span class="marquee-item"><span class="glyph">${s.charAt(0)}</span>${s}</span>`).join('');
  tk.innerHTML = mqHtml + mqHtml;

  // ---- TABS ----
  document.querySelectorAll('.catalog-tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.catalog-tabs button').forEach(b => b.setAttribute('aria-selected','false'));
      btn.setAttribute('aria-selected','true');
      activeTab = btn.dataset.tab;
      activeArea = 'Tutte';
      renderAreas(); renderGrid();
    });
  });

  // ---- AREAS ----
  const areaWrap = document.getElementById('areaFilters');
  function renderAreas(){
    const list = activeTab === 'uni' ? allAreas : hsAreas;
    areaWrap.innerHTML = ['Tutte', ...list].map(a => 
      `<button class="area-chip" aria-pressed="${a===activeArea}" data-area="${a}">${a}</button>`
    ).join('');
    areaWrap.querySelectorAll('.area-chip').forEach(c => {
      c.addEventListener('click', () => { activeArea = c.dataset.area; renderAreas(); renderGrid(); });
    });
  }

  // ---- GRID ----
  const grid = document.getElementById('facultiesGrid');
  const noRes = document.getElementById('noResults');
  function renderGrid(){
    const src = activeTab === 'uni' ? uni : hs;
    const isHsTab = activeTab === 'hs';
    const q = query.trim().toLowerCase();
    const filtered = src.filter(b => {
      if (activeArea !== 'Tutte' && b.area !== activeArea) return false;
      if (!q) return true;
      if (b.title.toLowerCase().includes(q)) return true;
      if (b.exams.some(e => e.name.toLowerCase().includes(q))) return true;
      return false;
    }).sort((a, b) => {
      const pa = AREA_PRIORITY.indexOf(a.area) !== -1 ? AREA_PRIORITY.indexOf(a.area) : 999;
      const pb = AREA_PRIORITY.indexOf(b.area) !== -1 ? AREA_PRIORITY.indexOf(b.area) : 999;
      if (pa !== pb) return pa - pb;
      if (a.area !== b.area) return a.area.localeCompare(b.area);
      return a.title.localeCompare(b.title);
    });
    grid.innerHTML = filtered.map(b => {
      const matchedExam = q ? b.exams.find(e => e.name.toLowerCase().includes(q)) : null;
      return `
        <button class="faculty" data-id="${b.id}">
          <div class="area">${b.area}</div>
          <h3>${b.title}</h3>
          <div class="meta">
            <span>${b.exams.length} ${isHsTab ? (b.exams.length===1?'materia':'materie') : (b.exams.length===1?'esame':'esami')}${matchedExam ? ` · <span style="color:var(--primary)">${matchedExam.name}</span>` : ''}</span>
            <span class="arrow"><i class="fa-solid fa-arrow-right"></i></span>
          </div>
        </button>`;
    }).join('');
    noRes.classList.toggle('show', filtered.length === 0);
    grid.querySelectorAll('.faculty').forEach(card => card.addEventListener('click', () => openDrawer(card.dataset.id)));
  }

  // ---- SEARCH ----
  const search = document.getElementById('search');
  let st;
  search.addEventListener('input', e => { clearTimeout(st); st = setTimeout(() => { query = e.target.value; renderGrid(); }, 120); });

  // ---- DRAWER ----
  const drawer = document.getElementById('drawer');
  const drawerBg = document.getElementById('drawerBg');
  const dTitle = document.getElementById('dTitle');
  const dArea = document.getElementById('dArea');
  const dBody = document.getElementById('drawerBody');
  const dCustom = document.getElementById('drawerCustomCta');

  function openDrawer(id){
    const b = data.find(x => x.id === id); if (!b) return;
    dArea.textContent = b.area;
    dTitle.textContent = b.title;
    dBody.innerHTML = b.exams.map(e => `
      <a class="exam" href="${e.wa}" target="_blank" rel="noopener">
        <div class="exam-icon"><i class="${e.icon}"></i></div>
        <div class="exam-name">${e.name}</div>
        <div class="exam-cta"><i class="fa-brands fa-whatsapp"></i> Scrivici</div>
      </a>`).join('');
    const isUniBlock = isUni(b);
    const prefix = isUniBlock ? `Ciao, frequento la Facoltà di ${b.title}` : `Ciao, frequento ${b.title}`;
    const entityMsg = isUniBlock ? "un altro esame" : "un'altra materia";
    const customMsg = encodeURIComponent(`${prefix} e vorrei chiedere informazioni su ${entityMsg}. Puoi aiutarmi?`);
    dCustom.href = `https://wa.me/${PHONE}?text=${customMsg}`;
    dCustom.innerHTML = `<i class="fa-brands fa-whatsapp"></i> Chiedi ${isUniBlock ? 'un esame personalizzato' : 'una materia personalizzata'}`;
    const drawerFootP = document.querySelector('.drawer-foot p');
    if (drawerFootP) drawerFootP.textContent = `Non trovi quello che cerchi? Scrivici direttamente — copriamo ${isUniBlock ? 'molti altri esami' : 'molte altre materie'}.`;
    drawer.classList.add('open'); drawerBg.classList.add('open'); document.body.style.overflow = 'hidden';
  }
  function closeDrawer(){ drawer.classList.remove('open'); drawerBg.classList.remove('open'); document.body.style.overflow = ''; }
  document.getElementById('drawerClose').addEventListener('click', closeDrawer);
  drawerBg.addEventListener('click', closeDrawer);

  // ---- NAV scroll ----
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // ---- KEYBOARD ----
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape'){ closeDrawer(); closeSidebar(); }
  });

  // ---- SIDEBAR ----
  const sidebar = document.getElementById('sidebar');
  function closeSidebar(){ sidebar.classList.remove('open'); }
  document.getElementById('burger').addEventListener('click', () => sidebar.classList.add('open'));
  document.getElementById('closeSidebar').addEventListener('click', closeSidebar);
  sidebar.querySelectorAll('a').forEach(a => a.addEventListener('click', closeSidebar));

  // initial render
  renderAreas(); renderGrid();
})();
