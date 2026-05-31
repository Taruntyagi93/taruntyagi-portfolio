const resumePath = 'data/resume.json';
const html = document.documentElement;

/* ── EmailJS config ──────────────────────────────────────
 *  1. Sign up free at https://www.emailjs.com
 *  2. Create a service (connect your Gmail)
 *  3. Create an email template — use these variables:
 *       {{from_name}}, {{from_email}}, {{subject}}, {{message}}
 *  4. Replace the three values below with your own IDs
 * ─────────────────────────────────────────────────────── */
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // e.g. 'abc123XYZ'
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_xxxxxx'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_xxxxxx'

/* ── theme ──────────────────────────────────────────── */
function initTheme() {
  const stored = localStorage.getItem('tt_theme');
  if (stored === 'light') html.classList.add('light');
}

document.getElementById('theme-toggle').addEventListener('click', () => {
  html.classList.toggle('light');
  localStorage.setItem('tt_theme', html.classList.contains('light') ? 'light' : 'dark');
  updateIconTheme();
});

/* ── icon system ─────────────────────────────────────────
 *  Two strategies:
 *  1. { slug, light, dark } → Simple Icons CDN img tag
 *  2. { svg } → raw inline SVG string (for icons not in Simple Icons)
 * ─────────────────────────────────────────────────────── */

/* Inline SVGs for icons not available on Simple Icons CDN */
const INLINE_SVGS = {
  'CSS3': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#1572B6" d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"/>
  </svg>`,
  'D3.js': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#F9A03C" d="M23.189 1.627a1.287 1.287 0 0 0-1.667-.553L10.995 6.66a1.287 1.287 0 1 0 1.114 2.32l3.08-1.48-4.617 7.96a1.287 1.287 0 0 0 2.229 1.294l4.617-7.96.072 3.415a1.287 1.287 0 0 0 2.573-.054l-.13-6.158 1.503-.722a1.287 1.287 0 0 0 .553-1.648zM8.938 8.98a1.287 1.287 0 0 0-1.76.44L3.001 16.8a1.287 1.287 0 1 0 2.2 1.32l4.177-7.38a1.287 1.287 0 0 0-.44-1.76zm-3.08 7.96L1.93 15.246a1.287 1.287 0 0 0-.858 2.43l3.928 1.694a1.287 1.287 0 0 0 .858-2.43z"/>
  </svg>`,
  'AWS Lambda': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#FF9900" d="M18.75 22.5h-4.5L9.79 12.23l-2.97 5.52H2.86L8.31 8l-1.92-4.5h4.29l3.03 7.11L17.07 3h3.96l-5.85 10.5 3.57 9zm-3.81-1.5h2.85l-3.3-8.56.07-.13 5.46-9.81h-2.04l-3.77 7.08-3.33-7.08H8.29l2.07 4.87-.09.16-5.1 9.47h1.97l3.27-6.09z"/>
  </svg>`,
  'DynamoDB': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4053D6" d="M16.313 1.646C14.807.902 13.295.53 12 .53S9.193.901 7.688 1.646C5.84 2.562 4.875 3.79 4.875 5.06v13.879c0 1.27.965 2.498 2.813 3.414C9.193 23.098 10.705 23.47 12 23.47s2.807-.372 4.313-1.117c1.847-.916 2.812-2.144 2.812-3.414V5.06c0-1.27-.965-2.498-2.812-3.414zM12 2.03c2.537 0 5.625 1.09 5.625 3.03S14.537 8.09 12 8.09 6.375 7 6.375 5.06 9.463 2.03 12 2.03zm5.625 16.909c0 1.94-3.088 3.03-5.625 3.03s-5.625-1.09-5.625-3.03v-2.302c1.416.901 3.352 1.393 5.625 1.393s4.209-.492 5.625-1.393v2.302zm0-5.031c0 1.94-3.088 3.03-5.625 3.03s-5.625-1.09-5.625-3.03v-2.302c1.416.901 3.352 1.393 5.625 1.393s4.209-.492 5.625-1.393v2.302zm0-5.031c0 1.94-3.088 3.03-5.625 3.03S6.375 10.847 6.375 8.907V6.605c1.416.901 3.352 1.393 5.625 1.393s4.209-.492 5.625-1.393v2.302z"/>
  </svg>`,
  'Amazon S3': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#569A31" d="M12.186 0L3 3.582v16.836L12.186 24 21 20.418V3.582L12.186 0zm0 1.602l7.377 2.73v15.336l-7.377 2.73-7.377-2.73V4.332l7.377-2.73zm-5.625 4.41v12.144l5.625 2.15 5.625-2.15V6.012L12.186 3.86 6.561 6.012zm1.5 1.43l4.125-1.574 4.125 1.574v9.284l-4.125 1.574-4.125-1.574V7.442zm4.125.826L8.72 9.942v4.116l3.466 1.674 3.466-1.674V9.942L12.186 8.268z"/>
  </svg>`,
  'Elastic Search': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#005571" d="M13.394 0C8.683 0 4.648 2.925 2.967 7.077H22.02A8.867 8.867 0 0 0 22.35 5C22.35 2.238 18.271 0 13.394 0zM2.606 9.077A9.012 9.012 0 0 0 2.5 10c0 .314.037.62.065.928H21.435c.028-.308.065-.614.065-.928 0-.314-.018-.626-.046-.923H2.606zm.361 3.846C4.648 17.075 8.683 20 13.394 20c4.877 0 8.956-2.238 8.956-5 0-.372-.09-.731-.236-1.077H2.967z"/>
  </svg>`,
  'VPC': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#8C4FFF" d="M0 4.8v14.4C0 20.52.96 21 2.4 21h19.2c1.44 0 2.4-.48 2.4-1.8V4.8C24 3.48 23.04 3 21.6 3H2.4C.96 3 0 3.48 0 4.8zm1.5 0C1.5 4.2 1.86 4.5 2.4 4.5h19.2c.54 0 .9.3.9.3v14.4c0 .6-.36.3-.9.3H2.4c-.54 0-.9.3-.9-.3V4.8zm3.75 2.7h13.5v9H5.25v-9zm1.5 1.5v6h10.5v-6H6.75zm1.5 1.5h3v1.5h-3V10.5zm4.5 0h3v1.5h-3V10.5zm-4.5 3h7.5v1.5h-7.5V13.5z"/>
  </svg>`,
  'Route53': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#8C4FFF" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 1.5c5.799 0 10.5 4.701 10.5 10.5S17.799 22.5 12 22.5 1.5 17.799 1.5 12 6.201 1.5 12 1.5zm0 3a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zm0 1.5a6 6 0 1 1 0 12A6 6 0 0 1 12 6zm-4.5 3.75v1.5h1.875l.375 3.75H9v1.5h6v-1.5h-1.75l.375-3.75H15.5v-1.5h-8z"/>
  </svg>`,
  'CloudFront': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#8C4FFF" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-.75 3.075C8.012 3.478 5.034 6.099 4.125 9.75h4.266c.234-2.643.942-4.947 1.859-6.675zm1.5 0c.917 1.728 1.625 4.032 1.859 6.675h4.266c-.909-3.651-3.887-6.272-6.125-6.675zM3.703 11.25a8.492 8.492 0 0 0-.203 1.5c0 .516.072 1.016.203 1.5H7.47a21.003 21.003 0 0 1-.22-1.5c0-.514.078-1.011.22-1.5H3.703zm5.266 0a19.35 19.35 0 0 0-.219 1.5c0 .519.079 1.018.22 1.5h6.06a19.35 19.35 0 0 0 .22-1.5c0-.519-.08-1.018-.22-1.5h-6.06zm7.562 0a19.35 19.35 0 0 1 .219 1.5c0 .519-.079 1.018-.22 1.5h3.766a8.492 8.492 0 0 0 .204-1.5 8.492 8.492 0 0 0-.204-1.5H16.53zm-12.405 4.5c.909 3.651 3.887 6.272 6.125 6.675-.917-1.728-1.625-4.032-1.859-6.675H4.125zm5.766 0c.234 2.643.942 4.947 1.859 6.675.917-1.728 1.625-4.032 1.859-6.675H9.891zm5.984 0c-.234 2.643-.942 4.947-1.859 6.675 2.238-.403 5.216-3.024 6.125-6.675h-4.266z"/>
  </svg>`,
  'API Gateway': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#FF4F8B" d="M12 0L1.5 6v12L12 24l10.5-6V6L12 0zM3 7.24L12 2l9 5.24v9.52L12 22l-9-5.24V7.24zM9 8.5v7l6-3.5-6-3.5zm1.5 2.598L12.5 12l-2 1.133V11.1z"/>
  </svg>`,
  'CloudWatch': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#FF4F8B" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.25c5.385 0 9.75 4.365 9.75 9.75S17.385 21.75 12 21.75 2.25 17.385 2.25 12 6.615 2.25 12 2.25zm0 2.25A7.5 7.5 0 1 0 19.5 12 7.5 7.5 0 0 0 12 4.5zm-.75 2.25h1.5v5.69l3.28 1.895-.75 1.298-3.97-2.293-.06-.103V6.75z"/>
  </svg>`,
  'CloudTrail': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#E7157B" d="M19.5 6.75H18V5.25A3.754 3.754 0 0 0 14.25 1.5h-4.5A3.754 3.754 0 0 0 6 5.25v1.5H4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3zM7.5 5.25A2.252 2.252 0 0 1 9.75 3h4.5A2.252 2.252 0 0 1 16.5 5.25v1.5h-9v-1.5zm13.5 13.5a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5v-9a1.5 1.5 0 0 1 1.5-1.5h15a1.5 1.5 0 0 1 1.5 1.5v9zM12 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5z"/>
  </svg>`,
  'Kinesis': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#FF9900" d="M20.116 5.39L13.256.35a2.047 2.047 0 0 0-2.512 0L3.884 5.39A2.045 2.045 0 0 0 3 7.048v9.904c0 .672.33 1.3.884 1.659l6.86 5.04a2.047 2.047 0 0 0 2.512 0l6.86-5.04A2.045 2.045 0 0 0 21 16.952V7.048a2.046 2.046 0 0 0-.884-1.658zM12 2.13l6.05 4.447L12 10.937 5.95 6.577 12 2.13zm-7.5 5.476L10.5 12v7.3l-6-4.41V7.606zm9 11.694V12l6-4.394v7.284l-6 4.41z"/>
  </svg>`,
  'Step Function': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#FF4F8B" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.25c5.385 0 9.75 4.365 9.75 9.75S17.385 21.75 12 21.75 2.25 17.385 2.25 12 6.615 2.25 12 2.25zM7.5 7.5v9h9V7.5h-9zm1.5 1.5h6v6h-6V9zm.75 1.5v1.5h1.5V10.5h-1.5zm3 0v1.5h1.5V10.5h-1.5zm-3 3v1.5h1.5V13.5h-1.5zm3 0v1.5h1.5V13.5h-1.5z"/>
  </svg>`,
  'Glue Job': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#FF9900" d="M21 7.5H3A1.5 1.5 0 0 0 1.5 9v9A1.5 1.5 0 0 0 3 19.5h18a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 21 7.5zm0 10.5H3V9h18v9zM6 4.5h12V6H6zM8.25 1.5h7.5V3h-7.5zM9 12.75A.75.75 0 0 1 9.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 9 12.75zm0 2.25a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6A.75.75 0 0 1 9 15z"/>
  </svg>`,
  'VS Code': `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#007ACC" d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 19.86V4.14a1.5 1.5 0 0 0-.85-1.553zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>
  </svg>`,
};

const ICON_CONFIG = {
  'JavaScript':    { slug: 'javascript',        light: 'F7DF1E', dark: 'F7DF1E' },
  'TypeScript':    { slug: 'typescript',        light: '3178C6', dark: '3178C6' },
  'Python':        { slug: 'python',            light: '3776AB', dark: '3776AB' },
  'SQL':           { slug: 'postgresql',        light: '336791', dark: '4F9DD4' },
  'React':         { slug: 'react',             light: '087EA4', dark: '61DAFB' },
  'Vue.js':        { slug: 'vuedotjs',          light: '35495E', dark: '4FC08D' },
  'Redux':         { slug: 'redux',             light: '764ABC', dark: '9B72D0' },
  'HTML5':         { slug: 'html5',             light: 'E34F26', dark: 'E34F26' },
  'Node.js':       { slug: 'nodedotjs',         light: '417E38', dark: '5FA04E' },
  'GraphQL':       { slug: 'graphql',           light: 'E10098', dark: 'E10098' },
  'REST APIs':     { slug: 'openapiinitiative', light: '6BA539', dark: '85C24E' },
  'MongoDB':       { slug: 'mongodb',           light: '116149', dark: '47A248' },
  'AWS':           { slug: 'amazonwebservices', light: '232F3E', dark: 'FF9900' },
  'Terraform':     { slug: 'terraform',         light: '7B42BC', dark: '9F6FD9' },
  'Docker':        { slug: 'docker',            light: '1D63ED', dark: '2496ED' },
  'Git':           { slug: 'git',               light: 'F05032', dark: 'F05032' },
  'CI/CD':         { slug: 'githubactions',     light: '2088FF', dark: '4FA8FF' },
  'Redshift':      { slug: 'amazonredshift',    light: '8C4FFF', dark: 'B57BFF' },
  'promptfoo':     { slug: 'prometheus',        light: 'DA4E31', dark: 'E6522C' },
};

const INLINE_ICON_NAMES = new Set(Object.keys(INLINE_SVGS));

function getSimpleIconUrl(name) {
  const cfg = ICON_CONFIG[name];
  if (!cfg) return null;
  const isDark = !html.classList.contains('light');
  const color = isDark ? cfg.dark : cfg.light;
  return `https://cdn.simpleicons.org/${cfg.slug}/${color}`;
}

function buildIconImg(name) {
  if (INLINE_ICON_NAMES.has(name)) {
    return `<span class="skill-icon-svg">${INLINE_SVGS[name]}</span>`;
  }
  const url = getSimpleIconUrl(name);
  if (url) {
    return `<img src="${url}" alt="${name}" width="18" height="18" class="skill-icon-img" loading="lazy" onerror="this.style.display='none'">`;
  }
  return `<svg viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
}

function updateIconTheme() {
  document.querySelectorAll('.skill-icon-img').forEach(img => {
    const name = img.closest('.skill-chip')?.querySelector('.skill-chip-name')?.textContent?.trim();
    if (name) {
      const url = getSimpleIconUrl(name);
      if (url) img.src = url;
    }
  });
}

/* ── fetch ──────────────────────────────────────────── */
async function fetchResume() {
  try {
    const r = await fetch(resumePath);
    if (!r.ok) throw new Error('fetch failed');
    return await r.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

/* ── renderers ──────────────────────────────────────── */
function renderStats(stats) {
  const el = document.getElementById('stats-strip');
  el.innerHTML = stats.map(s => `
    <div class="stat-block reveal">
      <span class="stat-val">${s.value}</span>
      <span class="stat-lbl">${s.label}</span>
    </div>
  `).join('');
}

function renderExperience(exp) {
  const el = document.getElementById('experience-list');
  el.innerHTML = exp.map(e => `
    <div class="exp-item reveal">
      <div class="exp-meta">
        <span class="exp-range">${e.range}</span>
        <span class="exp-co">${e.company}</span>
      </div>
      <div class="exp-body">
        <p class="exp-role">${e.role}</p>
        <p class="exp-desc">${e.description}</p>
      </div>
    </div>
  `).join('');
}

function renderSkillCategories(categories) {
  const el = document.getElementById('skill-categories');
  el.innerHTML = categories.map(cat => `
    <div class="skill-group reveal">
      <div class="skill-group-label">${cat.label}</div>
      <div class="skill-chips">
        ${cat.items.map(item => `
          <div class="skill-chip">
            <span class="skill-chip-icon">${buildIconImg(item)}</span>
            <span class="skill-chip-name">${item}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderProjects(projects) {
  const el = document.getElementById('project-list');
  el.innerHTML = projects.map(p => `
    <div class="proj-item reveal">
      <div>
        <span class="proj-sub">${p.subtitle}</span>
        <p class="proj-title">${p.title}</p>
        <p class="proj-desc">${p.description}</p>
      </div>
      <span class="proj-arrow">↗</span>
    </div>
  `).join('');
}

function renderEducation(edu) {
  const el = document.getElementById('education-list');
  el.innerHTML = edu.map(e => `
    <div class="edu-item reveal">
      <p class="edu-degree">${e.title}</p>
      <span class="edu-school">${e.subtitle}</span>
      <p class="edu-note">${e.description}</p>
    </div>
  `).join('');
}

function renderContact(contact) {
  const el = document.getElementById('contact-card');
  const contactMeta = {
    Email: {
      prefix: 'mailto:',
      icon: `<img src="https://cdn.simpleicons.org/gmail/EA4335" width="18" height="18" alt="Email">`
    },
    Phone: {
      prefix: 'tel:',
      icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6.6 10.8c1.2 2.4 3.2 4.4 5.6 5.6l1.4-1.4c.2-.2.5-.3.7-.2 0 0 1 .3 2.2.3.4 0 .8.3.8.7v2.4c0 .4-.3.7-.7.7C6.9 17 1 11.1 1 4.7c0-.4.3-.7.7-.7H4.1c.4 0 .7.3.7.8 0 1.2.3 2.2.3 2.2.1.3 0 .6-.2.8L6.6 10.8z"/></svg>`
    },
    GitHub: {
      prefix: 'https://',
      icon: `<img src="https://cdn.simpleicons.org/github/181717/ffffff" width="18" height="18" alt="GitHub">`
    },
    LinkedIn: {
      prefix: 'https://',
      icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="#0A66C2" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`
    },
    Location: {
      prefix: null,
      icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>`
    }
  };

  el.innerHTML = Object.entries(contact).map(([label, value]) => {
    const meta = contactMeta[label] || { prefix: null, icon: '' };
    const href = meta.prefix ? meta.prefix + value.replace(/^https?:\/\//, '') : null;
    const inner = `<span class="contact-icon">${meta.icon}</span><span>${value}</span>`;
    const link = href
      ? `<a class="contact-link" href="${href}" target="_blank" rel="noopener noreferrer">${inner}</a>`
      : `<span class="contact-value">${inner}</span>`;
    return `
      <div class="contact-row reveal">
        <span class="contact-label">${label}</span>
        ${link}
      </div>
    `;
  }).join('');
}

/* ── contact form (EmailJS) ──────────────────────────── */
function initContactForm() {
  // Initialize EmailJS with your public key
  emailjs.init(EMAILJS_PUBLIC_KEY);

  const form      = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const btnText   = document.getElementById('btn-text');
  const spinner   = document.getElementById('btn-spinner');
  const status    = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic client-side validation
    const name    = document.getElementById('contact-name').value.trim();
    const email   = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !subject || !message) {
      setStatus('error', 'Please fill in all fields.');
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    spinner.style.display = 'inline-block';
    setStatus('', '');

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name:  name,
        from_email: email,
        subject:    subject,
        message:    message,
        to_email:   'taruntyagi0193@gmail.com',
      });

      setStatus('success', '✓ Message sent! I\'ll get back to you soon.');
      form.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('error', '✗ Something went wrong. Please try emailing me directly.');
    } finally {
      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      spinner.style.display = 'none';
    }
  });

  function setStatus(type, msg) {
    status.textContent = msg;
    status.className = 'form-status' + (type ? ' form-status--' + type : '');
  }
}

/* ── reveal observer ────────────────────────────────── */
function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${Math.min(i * 60, 300)}ms`;
        entry.target.classList.add('in');
        o.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
  targets.forEach(t => obs.observe(t));
}

/* ── boot ────────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();
initTheme();

window.addEventListener('DOMContentLoaded', async () => {
  const data = await fetchResume();
  if (!data) {
    document.body.innerHTML = '<div style="padding:4rem;font-family:monospace;color:#888">Could not load resume.json</div>';
    return;
  }

  renderStats(data.stats);
  renderExperience(data.experience);
  renderSkillCategories(data.skillCategories);
  renderProjects(data.projects);
  renderEducation(data.education);
  renderContact(data.contact);
  initContactForm();
  initReveal();
});