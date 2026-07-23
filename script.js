// Academic Publications Database
const publications = [
  {
    id: 1,
    title: "Iatrogenic lung overinflation resulting in pneumothorax and pneumoperitoneum during oxygen therapy post-general anesthesia: A case report",
    authors: "Kim J, Kim J-H, Kwon H",
    journal: "Medicine (Baltimore)",
    year: "2025",
    volume: "104(29):e43410",
    doi: "10.1097/MD.0000000000043410",
    url: "https://doi.org/10.1097/MD.0000000000043410",
    category: "case-report"
  },
  {
    id: 2,
    title: "Outcomes of reconstructing lower lid defects using midface lifting and full-thickness skin grafts",
    authors: "Kwon H, Kim S, Oh S-H, Ha Y, Song S-H",
    journal: "J Craniofac Surg",
    year: "2025",
    volume: "In press",
    doi: "10.1097/SCS.0000000000011579",
    url: "https://doi.org/10.1097/SCS.0000000000011579",
    category: "recon"
  },
  {
    id: 3,
    title: "The effect of a collagen–elastin implantation on infraorbital hollowing in lower lid surgery for aging patients",
    authors: "Kyung H, Park JY, Lee B, Kim J, Oh S-H, Kim S, Ha Y, Kwon H, Lee KC, Song S-H",
    journal: "J Craniofac Surg",
    year: "2025",
    volume: "In press",
    doi: "10.1097/SCS.0000000000011579",
    url: "https://doi.org/10.1097/SCS.0000000000011579",
    category: "recon"
  },
  {
    id: 4,
    title: "AI-driven eyeball exposure rate (EER) analysis: A useful tool for assessing ptosis surgery effectiveness",
    authors: "Lee B, Xu L, Oh S-H, Ha Y, Kwon H, Lee KC, Kim SY, Seo CW, Kim S*, Song S-H*",
    journal: "PLoS One",
    year: "2025",
    volume: "20(3):e0319577",
    doi: "10.1371/journal.pone.0319577",
    url: "https://doi.org/10.1371/journal.pone.0319577",
    category: "ai"
  },
  {
    id: 5,
    title: "Anterolateral thigh free flap using modified turbocharging method: a case report",
    authors: "Ha Y, Kim D, Kwon H, Kim S, Song S-H, Oh S-H, Kim J-H, Yang HJ, Kyung H*",
    journal: "Front Surg",
    year: "2024",
    volume: "11:1273843",
    doi: "10.3389/fsurg.2024.1273843",
    url: "https://doi.org/10.3389/fsurg.2024.1273843",
    category: "recon"
  },
  {
    id: 6,
    title: "Virtual reality for preoperative patient education: Satisfaction, usability, and impact on burnout from the perspective of new nurses",
    authors: "Kim J, Kim D, Oh S-H, Kwon H",
    journal: "World J Clin Cases",
    year: "2024",
    volume: "12(28):6204–6216",
    doi: "10.12998/wjcc.v12.i28.6204",
    url: "http://dx.doi.org/10.12998/wjcc.v12.i28.6204",
    category: "tech"
  },
  {
    id: 7,
    title: "The effect of botulinum toxin A on NADPH oxidase system and ischemia reperfusion injury",
    authors: "Kyung HW, Lee S, Kwon H, Kim S, Kim J-H, Song S-H, Oh S-H, Yang HJ, Ha Y*",
    journal: "Plast Reconstr Surg",
    year: "2024",
    volume: "154(1):100e–111e",
    doi: "10.1097/PRS.0000000000010956",
    url: "https://doi.org/10.1097/PRS.0000000000010956",
    category: "tech"
  },
  {
    id: 8,
    title: "Non-surgical treatment of diabetic foot ulcers on the dorsum of the foot with polydeoxyribonucleotide (PDRN) injection: Two cases",
    authors: "Ha Y, Kim J-H, Kim J, Kwon H",
    journal: "World J Clin Cases",
    year: "2024",
    volume: "12(20):4446–4451",
    doi: "10.12998/wjcc.v12.i20.4446",
    url: "http://dx.doi.org/10.12998/wjcc.v12.i20.4446",
    category: "case-report"
  },
  {
    id: 9,
    title: "Improved flap perfusion and hemostasis after postoperative embolization in free flap surgery: A case report",
    authors: "Kim J, Kwon H, Kim S, Song S-H, Oh S-H, Ha Y*",
    journal: "Arch Hand Microsurg",
    year: "2024",
    volume: "29(2):127–131",
    doi: "10.12790/ahm.24.0005",
    url: "https://doi.org/10.12790/ahm.24.0005",
    category: "recon"
  },
  {
    id: 10,
    title: "Customized reconstruction of lower eyelid defects",
    authors: "Kwon H, Song B, Ha Y, Kim S, Oh S-H, Seo YJ, Song S-H",
    journal: "J Craniofac Surg",
    year: "2024",
    volume: "35(1):233–236",
    doi: "10.1097/SCS.0000000000009807",
    url: "https://doi.org/10.1097/SCS.0000000000009807",
    category: "recon"
  },
  {
    id: 11,
    title: "Introduction of deep learning-based infrared image analysis to marginal reflex distance-1 measurement method: Clinical validation study",
    authors: "Song B, Kwon H, Kim S, Ha Y, Oh S-H, Song S-H*",
    journal: "J Clin Med",
    year: "2023",
    volume: "12(23):7466",
    doi: "10.3390/jcm12237466",
    url: "https://doi.org/10.3390/jcm12237466",
    category: "ai"
  },
  {
    id: 12,
    title: "Reconstruction of a medium-sized congenital melanocytic nevus defect using a thin thoracodorsal artery perforator free flap: A case report",
    authors: "Park Y, Kwon H, Kim S, Song S-H, Oh S-H, Ha Y*",
    journal: "Arch Aesthetic Plast Surg",
    year: "2023",
    volume: "29(4):226–229",
    doi: "10.14730/aaps.2023.00941",
    url: "https://doi.org/10.14730/aaps.2023.00941",
    category: "recon"
  },
  {
    id: 13,
    title: "Smartphone-based LiDAR application for easy and accurate wound size measurement",
    authors: "Song B, Kim J, Kwon H, Kim S, Oh S-H, Ha Y*, Song S-H*",
    journal: "J Clin Med",
    year: "2023",
    volume: "12(18):6042",
    doi: "10.3390/jcm12186042",
    url: "https://doi.org/10.3390/jcm12186042",
    category: "tech"
  },
  {
    id: 14,
    title: "Effects of preoperative education using virtual reality on preoperative anxiety and information desire: A randomized clinical trial",
    authors: "Kwon H, Lee J, Park YS, Oh S-H*, Kim J*",
    journal: "J Clin Monit Comput",
    year: "2023",
    volume: "37:1401–1407",
    doi: "10.1007/s10877-023-00988-5",
    url: "https://doi.org/10.1007/s10877-023-00988-5",
    category: "tech"
  },
  {
    id: 15,
    title: "Efficacy and safety of stromal vascular fraction on scar revision surgery: A prospective study",
    authors: "Kwon H, Lee S, Kim J, Song S-H*",
    journal: "J Dermatol Treat",
    year: "2023",
    volume: "34(1):2171260",
    doi: "10.1080/09546634.2023.2171260",
    url: "https://doi.org/10.1080/09546634.2023.2171260",
    category: "tech"
  },
  {
    id: 16,
    title: "Reconstruction of complex knee wounds with a distally based gracilis flap and gastrocnemius myocutaneous flap: A case report",
    authors: "Kwon H, Lee S, Kim S, Song S-H*, Oh S-H, Kim J-H, Kyung H, Yang HJ, Ha Y*",
    journal: "Front Surg",
    year: "2023",
    volume: "10:1109936",
    doi: "10.3389/fsurg.2023.1109936",
    url: "http://doi.org/10.3389/fsurg.2023.1109936",
    category: "recon"
  },
  {
    id: 17,
    title: "Aesthetic removal of foreign body granulomas of forehead via pretrichial approach",
    authors: "Kwon H, Ko G, Choi J, Ha Y, Kim S, Kim J-H, Oh S-H, Song S-H",
    journal: "J Craniofac Surg",
    year: "2022",
    volume: "33(5):1591–1595",
    doi: "10.1097/SCS.0000000000008530",
    url: "http://doi.org/10.1097/SCS.0000000000008530",
    category: "recon"
  },
  {
    id: 18,
    title: "Minimally invasive removal of facial foreign body granulomas",
    authors: "Choi J, Ko G, Kwon H, Ha Y, Kim S, Kyung H, Oh S-H, Song S-H",
    journal: "Arch Aesthetic Plast Surg",
    year: "2022",
    volume: "28(1):24–30",
    doi: "10.14730/aaps.2021.00346",
    url: "https://doi.org/10.14730/aaps.2021.00346",
    category: "recon"
  },
  {
    id: 19,
    title: "Open reduction of zygoma fractures with the extended transconjunctival approach and T-bar screw reduction",
    authors: "Song S-H, Kwon H, Oh S-H, Kim S-J, Park J, Kim S-I",
    journal: "Arch Plast Surg",
    year: "2018",
    volume: "45(4):325–332",
    doi: "10.5999/aps.2018.00311",
    url: "http://doi.org/10.5999/aps.2018.00311",
    category: "recon"
  },
  {
    id: 20,
    title: "Bilateral interdigitated pacman flap for round and oval facial defects",
    authors: "Oh S-H, Kwon H, Kim SJ, Kyung H, Seo YJ, Lew DH, Song S-H",
    journal: "J Craniomaxillofac Surg",
    year: "2018",
    volume: "46(6):1032–1036",
    doi: "10.1016/j.jcms.2018.04.012",
    url: "https://doi.org/10.1016/j.jcms.2018.04.012",
    category: "recon"
  },
  {
    id: 21,
    title: "Reconstruction using local flaps for penoscrotal defects after ablation of skin lesions",
    authors: "Kyung H, Kwon H, Song S-H, Oh S-H",
    journal: "J Wound Manag Res",
    year: "2018",
    volume: "14(1):37–43",
    doi: "10.22467/jwmr.2017.00220",
    url: "https://doi.org/10.22467/jwmr.2017.00220",
    category: "recon"
  },
  {
    id: 22,
    title: "A new method for stabilizing the columellar strut used in rhinoplasty: The trans-septal columellar stabilizing suture",
    authors: "Jeong JY, Kwon H, Piao Y, Oh S-H",
    journal: "J Oral Maxillofac Surg",
    year: "2018",
    volume: "76(1):165–168",
    doi: "10.1016/j.joms.2017.07.145",
    url: "https://doi.org/10.1016/j.joms.2017.07.145",
    category: "recon"
  }
];

let currentCategory = 'all';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderPublications();
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
