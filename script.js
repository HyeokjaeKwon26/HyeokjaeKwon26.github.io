// Academic Portfolio & Publications Engine (Optimized & Dual-Language i18n)
let publications = [];
let currentCategory = 'all';
let searchQuery = '';
let currentLang = 'en';

// DOM Elements Cache
let containerEl, searchInputEl, toastEl, themeBtnEl, langBtnEl;

const TRANSLATIONS = {
  en: {
    name_header: "Hyeokjae Kwon, M.D., Ph.D.",
    name_hero: "Hyeokjae Kwon, M.D., Ph.D.",
    cv_bar_title: "Hyeokjae Kwon, M.D., Ph.D. — Academic Curriculum Vitae",
    brand_sub: "CNUH, MGH & Harvard Medical School",
    nav_about: "About",
    nav_experience: "Experience",
    nav_education: "Education",
    nav_publications: "Publications",
    nav_honors: "Honors & Certs",
    nav_contact: "Contact",
    hero_title_sub: "Plastic and Reconstructive Surgeon & Computer Scientist",
    role_visiting: "Visiting Professor",
    org_visiting: "Massachusetts General Hospital (MGH) & Harvard Medical School (HMS), USA",
    role_clinical: "Clinical Assistant Professor",
    org_clinical: "Dept. of Plastic & Reconstructive Surgery, Chungnam National University Hospital",
    hero_bio: "Dr. Hyeokjae Kwon combines a unique interdisciplinary background in Computer Science (B.S., <strong>KAIST</strong>) and Medicine (M.D., Ph.D., <strong>Chungnam National University</strong>). His research integrates artificial intelligence, medical computer vision, and virtual reality preoperative education into plastic and reconstructive surgery, with dedicated research interests in chronic wounds and surgical site infections (SSI).",
    btn_cv: "Academic CV (PDF)",
    section_exp: "Professional Experience",
    section_edu: "Education",
    section_pub: "Publications",
    section_honors: "Honors, Certifications & Activities",
    section_contact: "Contact & Information",
    
    tab_all: "All",
    tab_ai: "AI & Digital Health",
    tab_tech: "VR & Medical Tech",
    tab_recon: "Reconstructive Surgery",
    search_placeholder: "Search publications (title, author, journal)...",
    pub_empty: "No publications found matching your search.",
    
    card_honors: "Honors & Awards",
    card_certs: "Certifications & Courses",
    card_memberships: "Professional Memberships",
    card_editorial: "Editorial & Reviewer Activities",
    
    contact_email: "Email",
    contact_phone: "Office Phone",
    contact_fax: "Fax",
    contact_orcid: "ORCID",
    footer_copy: "© 2026 Hyeokjae Kwon, M.D., Ph.D. | Chungnam National University Hospital, Massachusetts General Hospital & Harvard Medical School",
    toast_copy: "Citation copied to clipboard",

    // Specific Items
    org_cnuh: "Chungnam National University Hospital, Daejeon, South Korea",
    org_cnuh_short: "Chungnam National University Hospital",
    org_cnu: "Chungnam National University, South Korea",
    org_kaist: "KAIST (Korea Advanced Institute of Science and Technology), South Korea",
    item_visiting_desc: "Collaborative research on clinical surgical innovation, medical AI, and surgical outcomes.",
    item_cnuh_dept: "Department of Plastic and Reconstructive Surgery.",
    item_fellow_role: "Clinical Fellow",
    item_army_role: "Army Medical Officer",
    item_army_1115: "1115th Corps of Engineers, Second Operations Command, ROK Army",
    item_army_7th: "7th Airborne Special Forces Brigade, ROK Army",
    item_residency_role: "Residency in Plastic & Reconstructive Surgery",
    item_internship_role: "Medical Internship",
    item_phd_role: "Ph.D. in Medicine (Plastic & Reconstructive Surgery)",
    item_ms_role: "M.D. / M.S. in Medicine",
    item_bs_role: "B.S. in Computer Science",

    // Awards & Certs
    award_med_record: "Excellence Award for Medical Record Documentation",
    award_reviewer: "Outstanding Reviewer Award",
    award_research: "Outstanding Research Award",
    award_army_commend: "Brigadier General Commendation for Meritorious Service",
    award_golden_bell: "3rd Place, National Plastic Surgery Resident Knowledge Competition (Golden Bell Quiz)",
    award_golden_bell_sub: "Nov. 2017 — PRS Korea 2017",
    cv_ksprs_sub: "PRS Korea 2017",
    award_hygiene: "Hospital Infection Control & Hand Hygiene Excellence Award",
    cert_fkwa: "Fellow of the Korean Wound Academy (FKWA)",
    cert_cpbmi: "Certified Physician in Biomedical Informatics (CPBMI)",
    cert_hrdk: "Engineer Information Processing",
    cert_board: "Board Certified Specialist in Plastic & Reconstructive Surgery",
    cert_aocmf: "AOCMF Course — Management of Facial Trauma",
    cert_license: "Medical Doctor (M.D.) License",
    member_regular: "Regular Member",
    reviewer_role: "Reviewer",
    org_cnu_grad: "Graduate School of Chungnam National University",
    kwms_name: "Korean Wound Management Society",
    kosmi_name: "Korea Society of Medical Informatics (KOSMI)",
    hrdk_name: "Human Resources Development Service of Korea (HRDK)",
    mohw_name: "Ministry of Health and Welfare, Republic of Korea",
    ksprs_name: "Korean Society of Plastic and Reconstructive Surgeons (KSPRS)",
    
    // CV Page Specifics
    btn_back: "Return to Website",
    btn_pdf: "Save / Download PDF",
    cv_title_rank: "Visiting Professor, MGH & Harvard Medical School | Clinical Assistant Professor, CNUH",
    cv_sec_appointments: "Academic & Clinical Appointments",
    cv_sec_focus: "Research Focus & Specializations",
    cv_sec_pubs: "Peer-Reviewed Publications",
    cv_focus_text: "• <strong>Medical AI & Computer Vision:</strong> AI-driven Eyeball Exposure Rate (EER) Analysis, 3D Gaussian Splatting for Surgical Measurement.<br>• <strong>Digital Health & Preoperative VR:</strong> VR Simulation Preoperative Education, Mobile Wound Management Systems.<br>• <strong>Clinical Surgical Innovation:</strong> Surgical Site Infection (SSI) Prevention, Chronic Wound Healing, Facial Trauma Reconstruction."
  },
  kr: {
    name_header: "권혁재",
    name_hero: "권혁재 (Hyeokjae Kwon, M.D., Ph.D.)",
    cv_bar_title: "권혁재 — 학술 이력서 (CV)",
    brand_sub: "충남대병원, MGH & 하버드 의과대학",
    nav_about: "소개",
    nav_experience: "경력",
    nav_education: "학력",
    nav_publications: "논문 실적",
    nav_honors: "수상 및 자격",
    nav_contact: "문의",
    hero_title_sub: "성형외과 전문의 & 컴퓨터 과학자",
    role_visiting: "방문교수",
    org_visiting: "매사추세츠 종합병원 (MGH) & 하버드 의과대학 (HMS), 미국",
    role_clinical: "임상조교수",
    org_clinical: "충남대학교병원 성형외과",
    hero_bio: "권혁재 교수는 <strong>KAIST</strong> 전산학 학사와 <strong>충남대학교</strong> 의무석사·박사 학위를 보유한 융합형 연구자입니다. 성형외과 및 재건외과 영역에 인공지능(AI), 의료 컴퓨터 비전, 가상현실(VR) 수술 전 교육 기술을 융합하고 있으며, 만성 상처 치료 및 수술 부위 감염(SSI) 예방 연구를 집중적으로 수행하고 있습니다.",
    btn_cv: "학술 이력서 (PDF)",
    section_exp: "주요 경력",
    section_edu: "학력",
    section_pub: "논문 실적",
    section_honors: "수상, 자격 및 학회 활동",
    section_contact: "연락처 및 연구실 정보",
    
    tab_all: "전체",
    tab_ai: "인공지능 & 디지털헬스",
    tab_tech: "가상현실 & 의료기술",
    tab_recon: "재건성형",
    search_placeholder: "논문 검색 (제목, 저자, 저널명)...",
    pub_empty: "검색 조건에 맞는 논문 실적이 없습니다.",
    
    card_honors: "수상 내역",
    card_certs: "자격증 및 이수 과정",
    card_memberships: "학회 활동",
    card_editorial: "학술지 심사위원 활동",
    
    contact_email: "이메일",
    contact_phone: "연구실 전화",
    contact_fax: "팩스",
    contact_orcid: "ORCID",
    footer_copy: "© 2026 권혁재 (Hyeokjae Kwon) | 충남대학교병원, 매사추세츠 종합병원 & 하버드 의과대학",
    toast_copy: "인용문이 클립보드에 복사되었습니다",

    // Specific Items
    org_cnuh: "충남대학교병원",
    org_cnuh_short: "충남대학교병원",
    org_cnu: "충남대학교, 대한민국",
    org_kaist: "KAIST(한국과학기술원), 대한민국",
    item_visiting_desc: "임상 수술 혁신, 의료 AI 및 수술 성과에 대한 공동 연구.",
    item_cnuh_dept: "성형외과",
    item_fellow_role: "전임의 (펠로우)",
    item_army_role: "육군 군의관",
    item_army_1115: "대한민국 육군 제2작전사령부 제1115공병단",
    item_army_7th: "대한민국 육군 제7공수특전여단",
    item_residency_role: "성형외과 전공의 (레지던트)",
    item_internship_role: "수련의 (인턴)",
    item_phd_role: "의학박사 (성형외과학 전공)",
    item_ms_role: "의무석사",
    item_bs_role: "전산학 학사",

    // Awards & Certs
    award_med_record: "의무기록 작성 우수자상",
    award_reviewer: "우수 심사위원상 (JWMR)",
    award_research: "우수 연구상",
    award_army_commend: "여단장 표창 (공로상)",
    award_golden_bell: "전국 성형외과 전공의 지식경진대회 3위 (골든벨 퀴즈)",
    award_golden_bell_sub: "2017년 11월 — PRS Korea 2017",
    cv_ksprs_sub: "PRS Korea 2017",
    award_hygiene: "손위생 우수직원상",
    cert_fkwa: "대한창상학회 창상전문가(FKWA)",
    cert_cpbmi: "의료정보학 전문의 (CPBMI)",
    cert_hrdk: "정보처리기사",
    cert_board: "성형외과 전문의 자격증 (보건복지부)",
    cert_aocmf: "AOCMF 코스 — 안면외상 이수",
    cert_license: "의사 면허증",
    member_regular: "정회원",
    reviewer_role: "심사위원 (Reviewer)",
    org_cnu_grad: "충남대학교 대학원",
    kwms_name: "대한창상학회",
    kosmi_name: "대한의료정보학회",
    hrdk_name: "한국산업인력공단",
    mohw_name: "대한민국 보건복지부",
    ksprs_name: "대한성형외과학회",

    // CV Page Specifics
    btn_back: "메인 웹사이트로 돌아가기",
    btn_pdf: "PDF 저장 / 인쇄",
    cv_title_rank: "방문교수 (MGH & 하버드 의대) | 임상조교수 (충남대병원)",
    cv_sec_appointments: "경력 및 소속 (Academic & Clinical Appointments)",
    cv_sec_focus: "주요 연구 분야 (Research Focus & Specializations)",
    cv_sec_pubs: "학술지 논문 게재 실적 (Peer-Reviewed Publications)",
    cv_focus_text: "• <strong>의료 AI & 컴퓨터 비전:</strong> AI 기반 안구 노출 비율(EER) 분석, 수술 계측용 3D Gaussian Splatting.<br>• <strong>디지털 헬스 & 수술전 VR:</strong> VR 시뮬레이션 수술전 환자 교육, 모바일 상처 관리 시스템.<br>• <strong>임상 수술 혁신:</strong> 수술 부위 감염(SSI) 예방, 만성 상처 치료, 안면 외상 재건 외과."
  }
};

document.addEventListener('DOMContentLoaded', () => {
  cacheDOMElements();
  initTheme();
  initLanguage();
  loadPublications();
  setupEventListeners();
  setupScrollSpy();
});

function cacheDOMElements() {
  containerEl = document.getElementById('pub-list-container');
  searchInputEl = document.getElementById('pub-search-input');
  toastEl = document.getElementById('toast');
  themeBtnEl = document.getElementById('theme-toggle-btn');
  langBtnEl = document.getElementById('lang-toggle-btn');
}

function initLanguage() {
  currentLang = localStorage.getItem('preferred_lang') || 'en';
  applyLanguage(currentLang);
}

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'kr' : 'en';
  localStorage.setItem('preferred_lang', currentLang);
  applyLanguage(currentLang);
}

function applyLanguage(lang) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  // Update navbar language button label
  const langTextEl = document.getElementById('lang-text');
  if (langTextEl) {
    langTextEl.innerHTML = lang === 'en' ? '🇰🇷 KR' : '🇺🇸 EN';
  }

  // Update search input placeholder
  if (searchInputEl && dict['search_placeholder']) {
    searchInputEl.placeholder = dict['search_placeholder'];
  }

  // Update filter tabs
  const allTab = document.querySelector('.tab-btn[data-filter="all"]');
  if (allTab) {
    const count = publications.length || 24;
    allTab.innerText = `${dict['tab_all']} (${count})`;
  }

  const aiTab = document.querySelector('.tab-btn[data-filter="ai"]');
  if (aiTab) aiTab.innerText = dict['tab_ai'];

  const techTab = document.querySelector('.tab-btn[data-filter="tech"]');
  if (techTab) techTab.innerText = dict['tab_tech'];

  const reconTab = document.querySelector('.tab-btn[data-filter="recon"]');
  if (reconTab) reconTab.innerText = dict['tab_recon'];
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
    navigator.clipboard.writeText(citation).then(() => {
      showToast('Citation copied to clipboard');
      if (typeof gtag === 'function') {
        gtag('event', 'copy_citation', {
          'event_category': 'Engagement',
          'event_label': pub.title
        });
      }
    });
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
  if (langBtnEl) langBtnEl.addEventListener('click', toggleLanguage);

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
