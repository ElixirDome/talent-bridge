/*const jobData = [
  { title:"Senior Software Engineer", company:"Infosys", logo:"IN", lc:"#006699", lb:"#e6f2f8", type:"full", cat:"eng", tags:["Java","Spring Boot","AWS"], salary:"₹24L", period:"/yr", loc:"Pune · Hybrid", date:"Today", featured:true },
  { title:"Data Science Intern", company:"Google India", logo:"G", lc:"#ea4335", lb:"#fef0ef", type:"intern", cat:"data", tags:["Python","TensorFlow","SQL"], salary:"₹60K", period:"/mo", loc:"Bengaluru", date:"1 day ago", featured:false },
  { title:"Product Designer", company:"Razorpay", logo:"RP", lc:"#3395ff", lb:"#eaf3ff", type:"full", cat:"design", tags:["Figma","Prototyping","Research"], salary:"₹20L", period:"/yr", loc:"Remote", date:"2 days ago", featured:false },
  { title:"Business Analyst Intern", company:"Deloitte", logo:"DL", lc:"#86bc25", lb:"#f0f8e6", type:"intern", cat:"data", tags:["Excel","Power BI","SQL"], salary:"₹30K", period:"/mo", loc:"Mumbai", date:"2 days ago", featured:false },
  { title:"Frontend Engineer", company:"Swiggy", logo:"SW", lc:"#fc8019", lb:"#fff3e8", type:"full", cat:"eng", tags:["React","TypeScript","GraphQL"], salary:"₹18L", period:"/yr", loc:"Bengaluru · Remote", date:"3 days ago", featured:false },
  { title:"UX Designer Intern", company:"Adobe India", logo:"AD", lc:"#e1251b", lb:"#fef0ef", type:"intern", cat:"design", tags:["Figma","Adobe XD","Wireframing"], salary:"₹45K", period:"/mo", loc:"Noida", date:"3 days ago", featured:false },
  { title:"Machine Learning Engineer", company:"Flipkart", logo:"FK", lc:"#2874f0", lb:"#eaf0fe", type:"full", cat:"data", tags:["PyTorch","Spark","MLOps"], salary:"₹28L", period:"/yr", loc:"Bengaluru", date:"4 days ago", featured:true },
  { title:"Marketing Strategy Intern", company:"Unilever", logo:"UL", lc:"#003087", lb:"#e6eaf5", type:"intern", cat:"all", tags:["Growth","Analytics","Content"], salary:"₹20K", period:"/mo", loc:"Mumbai", date:"5 days ago", featured:false },
];
*/
let jobData = [];

async function fetchJobs() {
  try {
    const res = await fetch("/api/jobs");
    jobData = await res.json();
    renderJobs();
    renderCompanies(); // optional, if you want companies dynamic later
  } catch (err) {
    console.error("Error fetching jobs:", err);
  }
}

function jobCardHTML(j, highlight='') {
  function hl(str) {
    if (!highlight) return str;
    const re = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\\]\\\\]/g,'\\\\$&')})`, 'gi');
    return str.replace(re, '<mark>$1</mark>');
  }
  return `
    <div class="job-row${j.featured?' featured':''}">
      <div class="jlogo" style="background:${j.lb};color:${j.lc}">${j.logo}</div>
      <div class="jinfo">
        <div class="jinfo-top">
          <span class="jtitle">${hl(j.title)}</span>
          ${j.featured?'<span class="badge b-featured">Featured</span>':''}
          <span class="badge ${j.type==='intern'?'b-intern':'b-full'}">${j.type==='intern'?'Internship':'Full-time'}</span>
          ${j.loc.includes('Remote')?'<span class="badge b-remote">Remote</span>':''}
          ${j.loc.includes('Hybrid')?'<span class="badge b-hybrid">Hybrid</span>':''}
        </div>
        <div class="jcomp">${hl(j.company)} &nbsp;·&nbsp; ${j.loc}</div>
        <div class="jtags">${j.tags.map(t=>`<span class="jtag">${hl(t)}</span>`).join('')}</div>
      </div>
      <div class="jmeta">
        <div class="jsalary">${j.salary} <small>${j.period}</small></div>
        <div class="jdate">${j.date}</div>
        <button class="apply-btn" onclick="openModal('${j.title}','${j.company}')">Apply Now</button>
      </div>
    </div>`;
}

function renderJobs(filter) {
  const list = (!filter || filter==='all') ? jobData : jobData.filter(j => j.type===filter || j.cat===filter);
  const container = document.getElementById('jobsContainer');
  container.innerHTML = list.map(j => jobCardHTML(j)).join('');
  staggerAnimate(container, '.job-row', 70);
}

// --- SEARCH LOGIC ---
let searchTimeout = null;

function getSearchTerms() {
  return {
    kw: document.getElementById('searchKeyword').value.trim().toLowerCase(),
    loc: document.getElementById('searchLocation').value.trim().toLowerCase(),
    lvl: document.getElementById('searchLevel').value.toLowerCase()
  };
}

function matchJob(j, kw, loc, lvl) {
  const inTitle = j.title.toLowerCase().includes(kw);
  const inCompany = j.company.toLowerCase().includes(kw);
  const inTags = j.tags.some(t => t.toLowerCase().includes(kw));
  const kwMatch = !kw || inTitle || inCompany || inTags;
  const locMatch = !loc || j.loc.toLowerCase().includes(loc);
  const lvlMatch = !lvl || (lvl.includes('intern') && j.type==='intern') || (lvl.includes('entry') && j.type==='full') || (lvl.includes('mid') && j.type==='full') || (lvl.includes('senior') && j.type==='full') || true;
  return kwMatch && locMatch;
}

function handleSearchInput() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(showDropdown, 120);
}

function handleSearchKey(e) {
  if (e.key === 'Enter') { closeDropdown(); runFullSearch(); }
  if (e.key === 'Escape') closeDropdown();
}

function showDropdown() {
  const { kw, loc } = getSearchTerms();
  const dd = document.getElementById('searchDropdown');
  if (!kw && !loc) { closeDropdown(); return; }
  const matches = jobData.filter(j => matchJob(j, kw, loc));
  let html = `<div class="sd-header">Suggested Roles</div>`;
  if (matches.length === 0) {
    html += `<div class="sd-empty">No results for "<strong>${kw || loc}</strong>" — try a different keyword.</div>`;
  } else {
    html += matches.slice(0,5).map(j => `
      <div class="sd-item" onclick="selectSuggestion('${j.title}','${j.company}')">
        <div class="sd-logo" style="background:${j.lb};color:${j.lc}">${j.logo}</div>
        <div class="sd-info">
          <div class="sd-title">${highlight(j.title, kw)}</div>
          <div class="sd-meta">${j.company} · ${j.loc} · <span class="badge ${j.type==='intern'?'b-intern':'b-full'}" style="font-size:0.65rem;padding:0.1rem 0.4rem">${j.type==='intern'?'Internship':'Full-time'}</span></div>
        </div>
        <div class="sd-salary">${j.salary}<small style="font-size:0.68rem;color:var(--gray-400);font-weight:400">${j.period}</small></div>
      </div>`).join('');
    if (matches.length > 5) html += `<div class="sd-footer" onclick="runFullSearch()">View all ${matches.length} results →</div>`;
  }
  dd.innerHTML = html;
  dd.classList.add('visible');
}

function highlight(str, term) {
  if (!term) return str;
  const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\\]\\\\]/g,'\\\\$&')})`, 'gi');
  return str.replace(re, '<mark>$1</mark>');
}

function closeDropdown() {
  document.getElementById('searchDropdown').classList.remove('visible');
}

function selectSuggestion(title, company) {
  document.getElementById('searchKeyword').value = title;
  closeDropdown();
  runFullSearch();
}

function runFullSearch() {
  closeDropdown();
  const { kw, loc } = getSearchTerms();
  if (!kw && !loc) { clearSearch(); return; }
  const matches = jobData.filter(j => matchJob(j, kw, loc));
  const section = document.getElementById('searchResultsSection');
  const container = document.getElementById('searchResultsContainer');
  const title = document.getElementById('searchResultsTitle');
  const queryParts = [kw, loc].filter(Boolean);
  title.textContent = `"${queryParts.join(' · ')}" — ${matches.length} result${matches.length!==1?'s':''}`;
  if (matches.length === 0) {
    container.innerHTML = `<div style="background:var(--white);border:1px solid var(--gray-200);border-radius:var(--radius);padding:3rem;text-align:center;color:var(--gray-400)"><div style="font-size:2rem;margin-bottom:0.75rem">🔍</div><div style="font-weight:700;color:var(--navy);margin-bottom:0.4rem">No jobs found</div><div style="font-size:0.875rem">Try different keywords or broaden your location filter.</div></div>`;
  } else {
    container.innerHTML = matches.map(j => jobCardHTML(j, kw)).join('');
    // animate newly-rendered result cards
    staggerAnimate(container, '.job-row', 50);
  }
  section.classList.add('visible');
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function clearSearch() {
  document.getElementById('searchKeyword').value = '';
  document.getElementById('searchLocation').value = '';
  document.getElementById('searchLevel').value = '';
  document.getElementById('searchResultsSection').classList.remove('visible');
  closeDropdown();
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  if (!document.getElementById('searchWrapper').contains(e.target)) closeDropdown();
});

const companies = [
  { name:"Tata Consultancy Services", short:"TCS", ind:"IT Services & Consulting", lc:"#003893", lb:"#e6ecf7", banner:"#0d1f3c", employees:"600K+", openings:"142", rating:"4.1" },
  { name:"Infosys", short:"IN", ind:"Software & Technology", lc:"#006699", lb:"#e6f2f8", banner:"#0a1e2e", employees:"335K+", openings:"89", rating:"3.9" },
  { name:"Google India", short:"G", ind:"Technology", lc:"#ea4335", lb:"#fef0ef", banner:"#1e0d0a", employees:"50K+", openings:"48", rating:"4.6" },
  { name:"Flipkart", short:"FK", ind:"E-Commerce", lc:"#2874f0", lb:"#eaf0fe", banner:"#0a1220", employees:"30K+", openings:"67", rating:"4.0" },
  { name:"Deloitte India", short:"DL", ind:"Professional Services", lc:"#86bc25", lb:"#f0f8e6", banner:"#141e0a", employees:"80K+", openings:"110", rating:"4.2" },
  { name:"Amazon India", short:"AM", ind:"E-Commerce & Cloud", lc:"#ff9900", lb:"#fff6e6", banner:"#1e1500", employees:"90K+", openings:"95", rating:"4.0" },
  { name:"Wipro", short:"WI", ind:"IT & Consulting", lc:"#5a2d82", lb:"#f3edf9", banner:"#16082a", employees:"250K+", openings:"76", rating:"3.8" },
  { name:"HDFC Bank", short:"HD", ind:"Banking & Finance", lc:"#004c8f", lb:"#e6eff9", banner:"#021528", employees:"170K+", openings:"54", rating:"4.3" },
];

function renderCompanies() {
  const grid = document.getElementById('companyGrid');
  grid.innerHTML = companies.map(c => `
    <div class="comp-card">
      <div class="comp-banner" style="background:${c.banner}">
        <div class="comp-logo-wrap" style="background:${c.lb};color:${c.lc}">${c.short}</div>
      </div>
      <div class="comp-body">
        <div class="comp-name">${c.name}</div>
        <div class="comp-industry">${c.ind}</div>
        <div class="comp-stats">
          <div class="cs"><span class="cs-num">${c.employees}</span><span class="cs-lbl">Employees</span></div>
          <div class="cs"><span class="cs-num">${c.openings}</span><span class="cs-lbl">Open Roles</span></div>
          <div class="cs"><span class="cs-num">★ ${c.rating}</span><span class="cs-lbl">Rating</span></div>
        </div>
        <button class="view-btn">View Company Profile</button>
      </div>
    </div>`).join('');
    // mark company cards for the slightly slower entrance animation
    staggerAnimate(grid, '.comp-card', 90, true);
}

function filterChip(el, type) {
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderJobs(type);
}

function openModal(title, company) {
  document.getElementById('modalTitle').textContent = 'Apply — ' + title;
  document.getElementById('modalSub').textContent = company + ' · Submit your application below.';
  document.getElementById('applyOverlay').classList.add('open');
}
function closeModal(e) { if (e.target === document.getElementById('applyOverlay')) closeModalDirect(); }
function closeModalDirect() { document.getElementById('applyOverlay').classList.remove('open'); }
function submitApp() {
  closeModalDirect();
  alert('✅ Application submitted successfully!\n\nThe hiring team will be in touch within 5 business days.');
}

// Stagger + IntersectionObserver helper to animate lists on load and when scrolled into view
function staggerAnimate(containerOrEl, childSelector, baseDelay = 70, isComp){
  const container = (typeof containerOrEl === 'string') ? document.querySelector(containerOrEl) : containerOrEl;
  if (!container) return;
  const items = container.querySelectorAll(childSelector);
  items.forEach((el, i) => {
    el.style.animationDelay = (i * baseDelay) + 'ms';
    if (isComp) el.classList.add('comp-will-animate'); else el.classList.add('will-animate');
  });
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('card-animate');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(it => io.observe(it));
}

// kick off initial renders and micro-animations
renderJobs();
renderCompanies();

fetchJobs();
// animate small brand element
document.querySelectorAll('.logo-icon').forEach(l => l.classList.add('animate'));
