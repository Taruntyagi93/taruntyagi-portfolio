const resumePath = 'data/resume.json';
const page = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

async function fetchResume() {
  try {
    const response = await fetch(resumePath);
    if (!response.ok) throw new Error('Unable to load resume data');
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

function renderHero(data) {
  document.getElementById('hero-name').textContent = data.name;
  document.getElementById('hero-title').textContent = data.title;
  document.getElementById('hero-summary').textContent = data.summary;
  document.getElementById('resume-link').href = data.resumePdf || 'Tarun Tyagi CA.pdf';
}

function renderStats(stats) {
  const container = document.getElementById('stats-grid');
  container.innerHTML = stats.map(({ label, value }) => {
    return `
      <div class="stat-card">
        <h3>${value}</h3>
        <p>${label}</p>
      </div>
    `;
  }).join('');
}

function renderTimeline(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = items.map(item => `
    <div class="timeline-item">
      <div class="range">${item.range}</div>
      <h3>${item.role}</h3>
      <p class="meta">${item.company}</p>
      <p>${item.description}</p>
    </div>
  `).join('');
}

function renderCards(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = items.map(item => `
    <article class="card">
      <h3>${item.title}</h3>
      <p class="meta">${item.subtitle}</p>
      <p>${item.description}</p>
    </article>
  `).join('');
}

function renderSkills(skills) {
  const list = document.getElementById('skill-list');
  const chart = document.getElementById('skill-chart');

  list.innerHTML = skills.map(skill => `
    <div class="skill-card">
      <div class="skill-header">
        <div><strong>${skill.name}</strong></div>
        <div>${skill.level}%</div>
      </div>
      <div class="skill-bar">
        <div class="bar-track"><div class="bar-fill" style="width:${skill.level}%"></div></div>
      </div>
      <p class="meta">${skill.note}</p>
    </div>
  `).join('');

  chart.innerHTML = skills.map(skill => `
    <div class="chart-pill">
      <span class="pill-name">${skill.name}</span>
      <span>${skill.level}%</span>
    </div>
  `).join('');
}

function renderContact(contact) {
  const container = document.getElementById('contact-card');
  container.innerHTML = Object.entries(contact).map(([label, value]) => `
    <div class="contact-item"><span>${label}</span><span>${value}</span></div>
  `).join('');
}

function initTheme() {
  const stored = localStorage.getItem('portfolioTheme');
  if (stored === 'light') page.classList.add('light-mode');
}

function toggleTheme() {
  page.classList.toggle('light-mode');
  const current = page.classList.contains('light-mode') ? 'light' : 'dark';
  localStorage.setItem('portfolioTheme', current);
}

themeToggle.addEventListener('click', toggleTheme);

window.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  const data = await fetchResume();
  if (!data) {
    document.body.innerHTML = '<div class="page-shell"><h1>Resume data could not be loaded.</h1><p>Make sure <code>data/resume.json</code> exists and is valid JSON.</p></div>';
    return;
  }

  renderHero(data);
  renderStats(data.stats);
  renderTimeline(data.experience, 'experience-list');
  renderCards(data.education, 'education-list');
  renderSkills(data.skills);
  renderCards(data.projects, 'project-list');
  renderContact(data.contact);
});
