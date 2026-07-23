// Academic Portfolio & Publications Engine (Optimized)
let publications = [];
let currentCategory = 'all';
let searchQuery = '';

// DOM Elements Cache
let containerEl, searchInputEl, toastEl, themeBtnEl;

document.addEventListener('DOMContentLoaded', () => {
  cacheDOMElements();
  initTheme();
  loadPublications();
  setupEventListeners();
  setupScrollSpy();
});

function cacheDOMElements() {
  containerEl = document.getElementById('pub-list-container');
  searchInputEl = document.getElementById('pub-search-input');
  toastEl = document.getElementById('toast');
  themeBtnEl = document.getElementById('theme-toggle-btn');
}

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
  if (!themeBtnEl) return;
  themeBtnEl.innerHTML = theme === 'dark' ? '<i class="ri-sun-line"></i>' : '<i class="ri-moon-line"></i>';
}

async function loadPublications() {
  try {
    const response = await fetch('publications.json?v=' + Date.now());
    if (response.ok) {
      publications = await response.json();
      const allTab = document.querySelector('.tab-btn[data-filter="all"]');
      if (allTab) allTab.innerText = `All (${publications.length})`;
      renderPublications();
    }
  } catch (e) {
    console.error('Error loading publications data:', e);
  }
}

function renderPublications() {
  if (!containerEl) return;

  const query = searchQuery.toLowerCase().trim();
  const filtered = publications.filter(pub => {
    const matchesCategory = currentCategory === 'all' || pub.category === currentCategory;
    const matchesSearch = !query || 
      pub.title.toLowerCase().includes(query) ||
      pub.authors.toLowerCase().includes(query) ||
      pub.journal.toLowerCase().includes(query) ||
      pub.year.includes(query);
      
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    containerEl.innerHTML = `<div style="padding: 24px 0; color: var(--text-muted);">No publications found matching your search.</div>`;
    return;
  }

  // Sort by year descending (newest first)
  filtered.sort((a, b) => (parseInt(b.year) || 9999) - (parseInt(a.year) || 9999));

  let html = '';
  let currentYearGroup = '';
  let globalIndex = 1;

  filtered.forEach((pub) => {
    const pubYear = pub.year || 'Recent';
    if (pubYear !== currentYearGroup) {
      currentYearGroup = pubYear;
      html += `<h3 class="year-heading">${currentYearGroup}</h3>`;
    }

    const formattedAuthors = pub.authors.replace(/Kwon H/g, '<strong>Kwon H</strong>');

    html += `
      <div class="pub-item">
        <div class="pub-number">[${globalIndex++}]</div>
        <div class="pub-title-text">${pub.title}</div>
        <div class="pub-authors-text">${formattedAuthors}</div>
        <div class="pub-meta-text">
          <strong>${pub.journal}</strong>. ${pub.year}; ${pub.volume}.
        </div>
        <div class="pub-links">
          <a href="${pub.url}" target="_blank" rel="noopener noreferrer" class="pub-link-btn">
            [DOI / Publisher Link]
          </a>
          <button class="pub-link-btn copy-btn" data-id="${pub.id}">
            [Copy Citation]
          </button>
        </div>
      </div>
    `;
  });

  containerEl.innerHTML = html;
}

function copyCitation(id) {
  const pub = publications.find(p => p.id == id);
  if (!pub) return;

  const citation = `${pub.authors}. ${pub.title}. ${pub.journal}. ${pub.year};${pub.volume}. https://doi.org/${pub.doi}`;
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(citation).then(() => showToast('Citation copied to clipboard'));
  }
}

function showToast(message) {
  if (!toastEl) return;
  toastEl.innerText = message;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 2500);
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function setupEventListeners() {
  if (themeBtnEl) themeBtnEl.addEventListener('click', toggleTheme);

  if (searchInputEl) {
    searchInputEl.addEventListener('input', debounce((e) => {
      searchQuery = e.target.value;
      renderPublications();
    }, 150));
  }

  // Category filter tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter');
      renderPublications();
    });
  });

  // Event Delegation for Copy Citation Buttons
  if (containerEl) {
    containerEl.addEventListener('click', (e) => {
      const copyBtn = e.target.closest('.copy-btn');
      if (copyBtn) {
        const id = copyBtn.getAttribute('data-id');
        copyCitation(id);
      }
    });
  }
}

// Active Nav Link ScrollSpy via IntersectionObserver
function setupScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" });

  sections.forEach(sec => observer.observe(sec));
}
