// Academic Publications Handler with Dynamic ORCID Auto-Sync Support
let publications = [];
let currentCategory = 'all';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadPublications();
  setupEventListeners();
});

function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('theme-toggle-btn');
  if (!btn) return;
  btn.innerHTML = theme === 'dark' ? '<i class="ri-sun-line"></i>' : '<i class="ri-moon-line"></i>';
}

async function loadPublications() {
  try {
    const response = await fetch('publications.json');
    if (response.ok) {
      publications = await response.json();
      renderPublications();
      return;
    }
  } catch (e) {
    console.log('Using default publications data');
  }
}

function renderPublications() {
  const container = document.getElementById('pub-list-container');
  if (!container) return;

  const filtered = publications.filter(pub => {
    const matchesCategory = currentCategory === 'all' || pub.category === currentCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query || 
      pub.title.toLowerCase().includes(query) ||
      pub.authors.toLowerCase().includes(query) ||
      pub.journal.toLowerCase().includes(query) ||
      pub.year.includes(query);
      
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="padding: 24px 0; color: var(--text-muted);">No publications found matching your search.</div>`;
    return;
  }

  container.innerHTML = filtered.map((pub) => {
    const formattedAuthors = pub.authors.replace(/Kwon H/g, '<strong>Kwon H</strong>');

    return `
      <div class="pub-item">
        <div class="pub-number">[${pub.id}]</div>
        <div class="pub-title-text">${pub.title}</div>
        <div class="pub-authors-text">${formattedAuthors}</div>
        <div class="pub-meta-text">
          <strong>${pub.journal}</strong>. ${pub.year}; ${pub.volume}.
        </div>
        <div class="pub-links">
          <a href="${pub.url}" target="_blank" rel="noopener noreferrer" class="pub-link-btn">
            [DOI / Publisher Link]
          </a>
          <button class="pub-link-btn" onclick="copyCitation('${pub.id}')">
            [Copy Citation]
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function copyCitation(id) {
  const pub = publications.find(p => p.id == id);
  if (!pub) return;

  const citation = `${pub.authors}. ${pub.title}. ${pub.journal}. ${pub.year};${pub.volume}. https://doi.org/${pub.doi}`;
  
  navigator.clipboard.writeText(citation).then(() => {
    showToast('Citation copied to clipboard');
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerText = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function setupEventListeners() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  const searchInput = document.getElementById('pub-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderPublications();
    });
  }

  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter');
      renderPublications();
    });
  });
}
