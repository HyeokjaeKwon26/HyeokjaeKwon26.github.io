// Academic Portfolio & Publications Engine (Optimized & Dual-Language i18n)
let publications = [];
let currentCategory = 'all';
let searchQuery = '';
let currentLang = 'en';

// DOM Elements Cache
let containerEl, searchInputEl, toastEl, themeBtnEl, langBtnEl;

const TRANSLATIONS = {
  en: {
    page_title: "Hyeokjae Kwon, M.D., Ph.D. | Chungnam National University Hospital, MGH & Harvard Medical School",
    cv_page_title: "Hyeokjae Kwon, M.D., Ph.D. — Academic Curriculum Vitae",
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
    page_title: "권혁재 (Hyeokjae Kwon, M.D., Ph.D.) | 충남대학교병원, MGH & 하버드 의과대학",
    cv_page_title: "권혁재 (Hyeokjae Kwon, M.D., Ph.D.) — 학술 이력서 (CV)",
    name_header: "권혁재 (Hyeokjae Kwon, M.D., Ph.D.)",
    name_hero: "권혁재 (Hyeokjae Kwon, M.D., Ph.D.)",
    cv_bar_title: "권혁재 (Hyeokjae Kwon, M.D., Ph.D.) — 학술 이력서 (CV)",
    brand_sub: "충남대학교병원, MGH & 하버드 의과대학",
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
    cert_cpbmi: "정보의학인증의(CPBMI)",
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
  setupEmailProtection();
  setupScrollToTop();
  setupCLITerminal();
  loadPublications();
  setupEventListeners();
  setupScrollSpy();
});

let cliHistory = [];
let cliHistoryIndex = -1;

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function setupCLITerminal() {
  const cliBtn = document.getElementById('cli-toggle-btn');
  const cliModal = document.getElementById('cli-modal');
  const cliCloseBtn = document.getElementById('cli-close-btn');
  const cliInput = document.getElementById('cli-input');

  if (!cliBtn || !cliModal) return;

  function openCLI() {
    cliModal.classList.add('active');
    setTimeout(() => { if (cliInput) cliInput.focus(); }, 100);
  }

  function closeCLI() {
    cliModal.classList.remove('active');
  }

  cliBtn.addEventListener('click', openCLI);
  if (cliCloseBtn) cliCloseBtn.addEventListener('click', closeCLI);

  cliModal.addEventListener('click', (e) => {
    if (e.target === cliModal) closeCLI();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cliModal.classList.contains('active')) {
      closeCLI();
    }
  });

  const cliForm = document.getElementById('cli-form');

  function handleRun() {
    if (!cliInput) return;
    const cmdText = cliInput.value.trim();
    if (cmdText) {
      cliHistory.push(cmdText);
      cliHistoryIndex = cliHistory.length;
    }
    executeCLICommand(cmdText);
    cliInput.value = '';
  }

  if (cliForm) {
    cliForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleRun();
    });
  }

  if (cliInput) {
    cliInput.addEventListener('focus', () => {
      setTimeout(() => {
        if (cliBody) cliBody.scrollTop = cliBody.scrollHeight;
      }, 200);
    });

    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        if (cliHistoryIndex > 0) {
          cliHistoryIndex--;
          cliInput.value = cliHistory[cliHistoryIndex];
        }
      } else if (e.key === 'ArrowDown') {
        if (cliHistoryIndex < cliHistory.length - 1) {
          cliHistoryIndex++;
          cliInput.value = cliHistory[cliHistoryIndex];
        } else {
          cliHistoryIndex = cliHistory.length;
          cliInput.value = '';
        }
      }
    });
  }
}

function executeCLICommand(cmd) {
  const cliOutput = document.getElementById('cli-output');
  const cliBody = document.getElementById('cli-body');
  if (!cliOutput) return;

  if (!cmd || cmd.trim() === '') {
    const cmdDiv = document.createElement('div');
    cmdDiv.className = 'cli-cmd-result';
    cmdDiv.innerHTML = `<div class="cli-cmd-history"><span class="cli-prompt">kwon@hms-mgh:~$</span></div>`;
    cliOutput.appendChild(cmdDiv);
    if (cliBody) cliBody.scrollTop = cliBody.scrollHeight;
    return;
  }

  const parts = cmd.split(' ');
  const mainCmd = parts[0].toLowerCase();
  const args = parts.slice(1).join(' ').toLowerCase();

  let responseHTML = '';

  switch (mainCmd) {
    case 'help':
      responseHTML = `
        <div class="cli-highlight">Available Commands:</div>
        <div>  <span class="cli-success">whoami</span>       - Display Dr. Kwon's background and affiliations</div>
        <div>  <span class="cli-success">bio</span>          - View interdisciplinary research bio</div>
        <div>  <span class="cli-success">experience</span>   - List academic & clinical appointments</div>
        <div>  <span class="cli-success">education</span>    - List academic degrees (KAIST & CNU)</div>
        <div>  <span class="cli-success">pubs [query]</span> - List or search peer-reviewed publications</div>
        <div>  <span class="cli-success">awards</span>       - View honors, certifications & awards</div>
        <div>  <span class="cli-success">contact</span>      - Show email, phone & ORCID info</div>
        <div>  <span class="cli-success">game [snake|guess|ttt]</span> - Play retro CLI mini games 🎮</div>
        <div>  <span class="cli-success">lang [kr|en]</span> - Switch site language</div>
        <div>  <span class="cli-success">ls / dir</span>      - List virtual files</div>
        <div>  <span class="cli-success">matrix</span>       - Trigger Matrix digital rain Easter egg</div>
        <div>  <span class="cli-success">clear</span>        - Clear terminal screen</div>
        <div>  <span class="cli-success">exit</span>         - Close CLI terminal</div>
      `;
      break;

    case 'whoami':
    case 'who':
    case 'id':
      responseHTML = `
        <div><strong class="cli-highlight">Hyeokjae Kwon, M.D., Ph.D. (권혁재)</strong></div>
        <div>• Plastic & Reconstructive Surgeon & Computer Scientist</div>
        <div>• Visiting Professor, Massachusetts General Hospital (MGH) & Harvard Medical School (HMS)</div>
        <div>• Clinical Assistant Professor, Dept. of Plastic & Reconstructive Surgery, CNUH</div>
        <div style="margin-top:6px;"><strong class="cli-highlight">Education & Degrees:</strong></div>
        <div>• Ph.D. in Medicine (Plastic & Reconstructive Surgery) — Chungnam National University (2021 ~ 2023)</div>
        <div>• M.D. / M.S. in Medicine — Chungnam National University (2010 ~ 2014)</div>
        <div>• B.S. in Computer Science — KAIST (2006 ~ 2010)</div>
      `;
      break;

    case 'cat':
      const targetFile = args.replace(/\.txt|\.json|\.link|\.sh/g, '').trim();
      if (targetFile === 'bio') {
        responseHTML = `<div>${TRANSLATIONS[currentLang || 'en']['hero_bio']}</div>`;
      } else if (targetFile === 'experience' || targetFile === 'exp') {
        responseHTML = `
          <div class="cli-highlight">Academic & Clinical Appointments:</div>
          <div>[2026 ~ Present] Visiting Professor - MGH & Harvard Medical School, Boston, MA, USA</div>
          <div>[2024 ~ Present] Clinical Assistant Professor - Chungnam National University Hospital (CNUH)</div>
          <div>[2022 ~ 2024] Clinical Fellow - Dept. of Plastic & Reconstructive Surgery, CNUH</div>
          <div>[2019 ~ 2022] Army Medical Officer - 7th Special Forces Brigade & 1115th Engineer Group, ROK Army</div>
          <div>[2015 ~ 2019] Resident - Dept. of Plastic & Reconstructive Surgery, CNUH</div>
        `;
      } else if (targetFile === 'education' || targetFile === 'edu') {
        responseHTML = `
          <div class="cli-highlight">Education:</div>
          <div>[2021 ~ 2023] Ph.D. in Medicine (Plastic & Reconstructive Surgery) - Chungnam National University</div>
          <div>[2010 ~ 2014] M.D. / M.S. in Medicine - Chungnam National University</div>
          <div>[2006 ~ 2010] B.S. in Computer Science - KAIST (Korea Advanced Institute of Science and Technology)</div>
        `;
      } else if (targetFile === 'contact') {
        responseHTML = `
          <div class="cli-highlight">Contact & Information:</div>
          <div>• Email: kwon.hyeokjae@cnuh.co.kr</div>
          <div>• Office Phone: +82 42-280-7380</div>
          <div>• Location: Boston, MA, USA / Daejeon, South Korea</div>
          <div>• ORCID: https://orcid.org/0000-0002-1418-3448</div>
          <div>• Google Scholar: https://scholar.google.com/citations?user=ouc34HsAAAAJ</div>
        `;
      } else if (targetFile === 'orcid') {
        responseHTML = `<div>https://orcid.org/0000-0002-1418-3448</div>`;
      } else if (targetFile === 'scholar') {
        responseHTML = `<div>https://scholar.google.com/citations?user=ouc34HsAAAAJ</div>`;
      } else if (targetFile === 'matrix') {
        responseHTML = `
          <div class="cli-success" style="font-family:monospace; line-height:1.3;">
            01001011 01000001 01001001 01000011 01010100<br>
            01001101 01000100 00100000 01010000 01101000 01000100<br>
            [SYSTEM]: KAIST CS + MGH / HARVARD MEDICAL SCHOOL AI MATRIX INITIALIZED...
          </div>
        `;
      } else {
        responseHTML = `<div style="color:#ef4444;">cat: ${escapeHTML(args)}: No such file or directory. Try 'ls' to view files.</div>`;
      }
      break;

    case 'pwd':
      responseHTML = `<div>/home/hyeokjae/harvard_mgh_cnuh</div>`;
      break;

    case 'sudo':
      responseHTML = `<div style="color:#ef4444;">[PERMISSION DENIED]: Nice try! Dr. Kwon's site is secured with root defense. 🛡️</div>`;
      break;

    case 'kaist':
      responseHTML = `<div class="cli-success">🎓 KAIST Department of Computer Science (Class of '10) Alumni Pride!</div>`;
      break;

    case 'cnu':
    case 'cnuh':
    case 'cnumed':
    case 'cnu-med':
      responseHTML = `<div class="cli-highlight">🩺 충남대학교 의과대학 & 충남대학교병원 (M.D., M.S., Ph.D.) Alumni & Faculty Pride! 🏛️</div>`;
      break;

    case 'harvard':
    case 'mgh':
    case 'hms':
      responseHTML = `<div class="cli-highlight">🏛️ Massachusetts General Hospital & Harvard Medical School - Visiting Professor (2026 ~ Present)</div>`;
      break;

    case 'date':
      responseHTML = `<div>${new Date().toUTCString()}</div>`;
      break;

    case 'ping':
      responseHTML = `
        <div class="cli-success">PING hyeokjaekwon26.github.io (185.199.108.153): 56 data bytes</div>
        <div>64 bytes from 185.199.108.153: icmp_seq=0 ttl=57 time=1.182 ms</div>
        <div>64 bytes from 185.199.108.153: icmp_seq=1 ttl=57 time=1.045 ms</div>
        <div class="cli-highlight">--- hyeokjaekwon26.github.io ping statistics --- 2 packets transmitted, 0% packet loss</div>
      `;
      break;

    case 'theme':
      toggleTheme();
      responseHTML = `<div class="cli-success">Theme toggled successfully!</div>`;
      break;

    case 'bio':
      responseHTML = `
        <div>${TRANSLATIONS[currentLang || 'en']['hero_bio']}</div>
      `;
      break;

    case 'experience':
      responseHTML = `
        <div class="cli-highlight">Academic & Clinical Appointments:</div>
        <div>[2026 ~ Present] Visiting Professor - MGH & Harvard Medical School, Boston, MA, USA</div>
        <div>[2024 ~ Present] Clinical Assistant Professor - Chungnam National University Hospital (CNUH)</div>
        <div>[2022 ~ 2024] Clinical Fellow - Dept. of Plastic & Reconstructive Surgery, CNUH</div>
        <div>[2019 ~ 2022] Army Medical Officer - 7th Special Forces Brigade & 1115th Engineer Group, ROK Army</div>
        <div>[2015 ~ 2019] Resident - Dept. of Plastic & Reconstructive Surgery, CNUH</div>
      `;
      break;

    case 'education':
      responseHTML = `
        <div class="cli-highlight">Education:</div>
        <div>[2021 ~ 2023] Ph.D. in Medicine (Plastic & Reconstructive Surgery) - Chungnam National University</div>
        <div>[2010 ~ 2014] M.D. / M.S. in Medicine - Chungnam National University</div>
        <div>[2006 ~ 2010] B.S. in Computer Science - KAIST (Korea Advanced Institute of Science and Technology)</div>
      `;
      break;

    case 'pubs':
    case 'publications':
      let matched = publications;
      if (args) {
        matched = publications.filter(p => 
          p.title.toLowerCase().includes(args) || 
          p.journal.toLowerCase().includes(args) || 
          p.year.toString().includes(args)
        );
      }
      if (!matched || matched.length === 0) {
        responseHTML = `<div style="color:#ef4444;">No publications found matching '${escapeHTML(args)}'.</div>`;
      } else {
        responseHTML = `<div class="cli-highlight">Publications (${matched.length} found):</div>`;
        matched.slice(0, 8).forEach((p, idx) => {
          responseHTML += `<div>[${idx + 1}] <strong>"${escapeHTML(p.title)}"</strong> - <em>${escapeHTML(p.journal)}</em> (${p.year})</div>`;
        });
        if (matched.length > 8) {
          responseHTML += `<div style="color:#94a3b8;">...and ${matched.length - 8} more. Use search query e.g. 'pubs ai'</div>`;
        }
      }
      break;

    case 'awards':
    case 'honors':
      responseHTML = `
        <div class="cli-highlight">Honors & Certifications:</div>
        <div>• Fellow of the Korean Wound Academy (FKWA) - Nov. 2024</div>
        <div>• Medical Record Documentation Excellence Award - Feb. 2024</div>
        <div>• Outstanding Reviewer Award (JWMR) - Mar. 2023</div>
        <div>• Certified Physician in Biomedical Informatics (CPBMI / 정보의학인증의) - Dec. 2022</div>
        <div>• Outstanding Research Award, CNU Graduate School - Aug. 2022</div>
        <div>• Brigadier General Commendation, 7th Special Forces Brigade - Nov. 2019</div>
        <div>• Engineer Information Processing (정보처리기사) - Nov. 2019</div>
        <div>• Board Certified Specialist in Plastic & Reconstructive Surgery - Mar. 2019</div>
        <div>• 3rd Place, National Resident Knowledge Competition (PRS Korea 2017) - Nov. 2017</div>
      `;
      break;

    case 'contact':
      responseHTML = `
        <div class="cli-highlight">Contact & Information:</div>
        <div>• Email: kwon.hyeokjae@cnuh.co.kr</div>
        <div>• Office Phone: +82 42-280-7380</div>
        <div>• Location: Boston, MA, USA / Daejeon, South Korea</div>
        <div>• ORCID: https://orcid.org/0000-0002-1418-3448</div>
        <div>• Google Scholar: https://scholar.google.com/citations?user=ouc34HsAAAAJ</div>
      `;
      break;

    case 'ls':
    case 'dir':
      responseHTML = `
        <div style="color:#38bdf8;">
          bio.txt          experience.txt    education.txt<br>
          publications.json awards.txt       contact.txt<br>
          orcid.link       scholar.link      matrix.sh
        </div>
      `;
      break;

    case 'lang':
      if (args === 'kr' || args === 'en') {
        currentLang = args;
        localStorage.setItem('preferred_lang', currentLang);
        applyLanguage(currentLang);
        responseHTML = `<div class="cli-success">Language updated to ${args.toUpperCase()}.</div>`;
      } else {
        responseHTML = `<div>Usage: lang kr OR lang en. Current language: ${currentLang}</div>`;
      }
      break;

    case 'game':
    case 'games':
      if (args === 'snake') {
        responseHTML = `<div class="cli-highlight">🎮 Launching Retro Snake Game...</div><div id="game-snake-mount"></div>`;
        setTimeout(() => startSnakeGame('game-snake-mount'), 50);
      } else if (args === 'ttt' || args === 'tictactoe') {
        responseHTML = `<div class="cli-highlight">🎮 Launching Tic-Tac-Toe vs AI...</div><div id="game-ttt-mount"></div>`;
        setTimeout(() => startTTTGame('game-ttt-mount'), 50);
      } else if (args === 'guess') {
        responseHTML = `<div class="cli-highlight">🎮 Launching Number Guessing Game (1 ~ 100)...</div><div id="game-guess-mount"></div>`;
        setTimeout(() => startGuessGame('game-guess-mount'), 50);
      } else {
        responseHTML = `
          <div class="cli-highlight">🎮 Available CLI Retro Mini Games:</div>
          <div>  • <span class="cli-success">game snake</span> - Classic Retro Snake Game 🐍</div>
          <div>  • <span class="cli-success">game ttt</span>   - Tic-Tac-Toe vs Medical AI ❌⭕</div>
          <div>  • <span class="cli-success">game guess</span> - Number Guessing Game (1 ~ 100) 🎯</div>
          <div style="margin-top:6px; color:#94a3b8;">Type e.g. <span class="cli-success">'snake'</span> or <span class="cli-success">'game snake'</span> to start playing!</div>
        `;
      }
      break;

    case 'snake':
      responseHTML = `<div class="cli-highlight">🎮 Launching Retro Snake Game...</div><div id="game-snake-mount"></div>`;
      setTimeout(() => startSnakeGame('game-snake-mount'), 50);
      break;

    case 'ttt':
    case 'tictactoe':
      responseHTML = `<div class="cli-highlight">🎮 Launching Tic-Tac-Toe vs AI...</div><div id="game-ttt-mount"></div>`;
      setTimeout(() => startTTTGame('game-ttt-mount'), 50);
      break;

    case 'guess':
      responseHTML = `<div class="cli-highlight">🎮 Launching Number Guessing Game (1 ~ 100)...</div><div id="game-guess-mount"></div>`;
      setTimeout(() => startGuessGame('game-guess-mount'), 50);
      break;

    case 'clear':
    case 'cls':
      cliOutput.innerHTML = '';
      return;

    case 'exit':
    case 'quit':
      document.getElementById('cli-modal').classList.remove('active');
      return;

    case 'matrix':
      responseHTML = `
        <div class="cli-success" style="font-family:monospace; line-height:1.3;">
          01001011 01000001 01001001 01000011 01010100<br>
          01001101 01000100 00100000 01010000 01101000 01000100<br>
          [SYSTEM]: KAIST CS + MGH / HARVARD MEDICAL SCHOOL AI MATRIX INITIALIZED...<br>
          "Combining Computer Science and Plastic Surgery to innovate clinical care."
        </div>
      `;
      break;

    default:
      responseHTML = `<div style="color:#ef4444;">Command not found: '${escapeHTML(cmd)}'. Type <span class="cli-success">'help'</span> for assistance.</div>`;
      break;
  }

  const cmdDiv = document.createElement('div');
  cmdDiv.className = 'cli-cmd-result';
  cmdDiv.innerHTML = `
    <div class="cli-cmd-history"><span class="cli-prompt">kwon@hms-mgh:~$</span> ${escapeHTML(cmd)}</div>
    <div>${responseHTML}</div>
  `;
  cliOutput.appendChild(cmdDiv);

  if (cliBody) {
    cliBody.scrollTop = cliBody.scrollHeight;
  }
}

function setupScrollToTop() {
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function setupEmailProtection() {
  document.querySelectorAll('.protected-email').forEach(el => {
    try {
      const u = atob(el.getAttribute('data-u') || '');
      const d = atob(el.getAttribute('data-d') || '');
      if (u && d) {
        const email = `${u}@${d}`;
        el.innerHTML = `<a href="mailto:${email}">${email}</a>`;
      }
    } catch (e) {
      console.error('Email decode error:', e);
    }
  });
}

function cacheDOMElements() {
  containerEl = document.getElementById('pub-list-container');
  searchInputEl = document.getElementById('pub-search-input');
  toastEl = document.getElementById('toast');
  themeBtnEl = document.getElementById('theme-toggle-btn');
  langBtnEl = document.getElementById('lang-toggle-btn');
}

function initLanguage() {
  // 1. URL Query Parameter Priority (?lang=kr or ?lang=en)
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  
  if (langParam && (langParam === 'kr' || langParam === 'en')) {
    currentLang = langParam;
    localStorage.setItem('preferred_lang', currentLang);
  } else {
    // 2. LocalStorage User Preference Priority
    const savedLang = localStorage.getItem('preferred_lang');
    if (savedLang) {
      currentLang = savedLang;
    } else {
      // 3. Browser / OS Default Language Auto-Detection (navigator.language)
      const userLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
      if (userLang.startsWith('ko')) {
        currentLang = 'kr';
      } else {
        currentLang = 'en';
      }
    }
  }

  applyLanguage(currentLang);
}

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'kr' : 'en';
  localStorage.setItem('preferred_lang', currentLang);
  applyLanguage(currentLang);
}

function applyLanguage(lang) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS['en'];

  // Update browser tab document.title dynamically
  const isCVPage = window.location.pathname.includes('cv.html');
  if (isCVPage && dict['cv_page_title']) {
    document.title = dict['cv_page_title'];
  } else if (dict['page_title']) {
    document.title = dict['page_title'];
  }
  
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
    langTextEl.innerHTML = lang === 'en' 
      ? '<img src="assets/flag_kr.svg" alt="KR" style="width:18px; height:12px; vertical-align:-1px; margin-right:5px; border-radius:2px; box-shadow:0 0 1px rgba(0,0,0,0.4); object-fit:cover;"> KR' 
      : '<img src="assets/flag_us.svg" alt="US" style="width:18px; height:12px; vertical-align:-1px; margin-right:5px; border-radius:2px; box-shadow:0 0 1px rgba(0,0,0,0.4); object-fit:cover;"> EN';
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

/* CLI Mini Games Implementation */
let currentSnakeLoop = null;

function startSnakeGame(mountId) {
  const mount = document.getElementById(mountId);
  if (!mount) return;

  if (currentSnakeLoop) clearInterval(currentSnakeLoop);

  mount.innerHTML = `
    <div class="cli-game-container">
      <div class="cli-game-header">
        <span>🐍 Retro Snake Game</span>
        <span>Score: <span id="snake-score">0</span></span>
      </div>
      <canvas id="snake-canvas" width="240" height="160" class="cli-snake-canvas"></canvas>
      <div class="cli-game-controls">
        <button class="cli-game-btn" id="snake-btn-up">▲</button>
      </div>
      <div class="cli-game-controls">
        <button class="cli-game-btn" id="snake-btn-left">◄</button>
        <button class="cli-game-btn" id="snake-btn-down">▼</button>
        <button class="cli-game-btn" id="snake-btn-right">►</button>
      </div>
    </div>
  `;

  const canvas = document.getElementById('snake-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const gridSize = 10;
  const tileCountX = canvas.width / gridSize;
  const tileCountY = canvas.height / gridSize;

  let snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
  let food = { x: 15, y: 8 };
  let dx = 1;
  let dy = 0;
  let score = 0;
  let gameOver = false;

  function placeFood() {
    food = {
      x: Math.floor(Math.random() * tileCountX),
      y: Math.floor(Math.random() * tileCountY)
    };
  }

  function handleDirection(dir) {
    if (dir === 'UP' && dy === 0) { dx = 0; dy = -1; }
    if (dir === 'DOWN' && dy === 0) { dx = 0; dy = 1; }
    if (dir === 'LEFT' && dx === 0) { dx = -1; dy = 0; }
    if (dir === 'RIGHT' && dx === 0) { dx = 1; dy = 0; }
  }

  document.getElementById('snake-btn-up').onclick = () => handleDirection('UP');
  document.getElementById('snake-btn-down').onclick = () => handleDirection('DOWN');
  document.getElementById('snake-btn-left').onclick = () => handleDirection('LEFT');
  document.getElementById('snake-btn-right').onclick = () => handleDirection('RIGHT');

  const keyHandler = (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w') handleDirection('UP');
    if (e.key === 'ArrowDown' || e.key === 's') handleDirection('DOWN');
    if (e.key === 'ArrowLeft' || e.key === 'a') handleDirection('LEFT');
    if (e.key === 'ArrowRight' || e.key === 'd') handleDirection('RIGHT');
  };
  document.addEventListener('keydown', keyHandler);

  function draw() {
    if (gameOver) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
      endGame();
      return;
    }

    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        endGame();
        return;
      }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score += 10;
      const scoreEl = document.getElementById('snake-score');
      if (scoreEl) scoreEl.innerText = score;
      placeFood();
    } else {
      snake.pop();
    }

    ctx.fillStyle = '#050811';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ef4444';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);

    ctx.fillStyle = '#34d399';
    for (let i = 0; i < snake.length; i++) {
      ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 1, gridSize - 1);
    }
  }

  function endGame() {
    gameOver = true;
    clearInterval(currentSnakeLoop);
    document.removeEventListener('keydown', keyHandler);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2 - 10);
    ctx.fillStyle = '#38bdf8';
    ctx.font = '12px monospace';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 15);
  }

  currentSnakeLoop = setInterval(draw, 120);
}

function startTTTGame(mountId) {
  const mount = document.getElementById(mountId);
  if (!mount) return;

  let board = ['', '', '', '', '', '', '', '', ''];
  let gameActive = true;

  mount.innerHTML = `
    <div class="cli-game-container">
      <div class="cli-game-header">
        <span>❌⭕ Tic-Tac-Toe vs Medical AI</span>
        <span id="ttt-status" style="color:#34d399;">Your Turn (X)</span>
      </div>
      <div class="cli-ttt-grid">
        ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<div class="cli-ttt-cell" data-idx="${i}"></div>`).join('')}
      </div>
      <div class="cli-game-controls">
        <button class="cli-game-btn" id="ttt-reset-btn">Restart Game</button>
      </div>
    </div>
  `;

  const cells = mount.querySelectorAll('.cli-ttt-cell');
  const statusEl = mount.querySelector('#ttt-status');

  function checkWin(b, player) {
    const winConditions = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];
    return winConditions.some(c => c.every(idx => b[idx] === player));
  }

  function aiMove() {
    if (!gameActive) return;
    const emptyIndices = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
    if (emptyIndices.length === 0) return;

    let move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

    board[move] = 'O';
    cells[move].innerText = 'O';
    cells[move].style.color = '#ef4444';

    if (checkWin(board, 'O')) {
      statusEl.innerText = 'AI Wins! 🤖';
      statusEl.style.color = '#ef4444';
      gameActive = false;
    } else if (board.every(cell => cell !== '')) {
      statusEl.innerText = "It's a Draw! 🤝";
      statusEl.style.color = '#f59e0b';
      gameActive = false;
    } else {
      statusEl.innerText = 'Your Turn (X)';
      statusEl.style.color = '#34d399';
    }
  }

  cells.forEach(cell => {
    cell.onclick = () => {
      const idx = parseInt(cell.getAttribute('data-idx'));
      if (board[idx] !== '' || !gameActive) return;

      board[idx] = 'X';
      cell.innerText = 'X';
      cell.style.color = '#38bdf8';

      if (checkWin(board, 'X')) {
        statusEl.innerText = 'YOU WIN! 🎉';
        statusEl.style.color = '#34d399';
        gameActive = false;
      } else if (board.every(c => c !== '')) {
        statusEl.innerText = "It's a Draw! 🤝";
        statusEl.style.color = '#f59e0b';
        gameActive = false;
      } else {
        statusEl.innerText = 'AI Thinking...';
        statusEl.style.color = '#f59e0b';
        setTimeout(aiMove, 400);
      }
    };
  });

  mount.querySelector('#ttt-reset-btn').onclick = () => startTTTGame(mountId);
}

function startGuessGame(mountId) {
  const mount = document.getElementById(mountId);
  if (!mount) return;

  const targetNum = Math.floor(Math.random() * 100) + 1;
  let attempts = 0;

  mount.innerHTML = `
    <div class="cli-game-container">
      <div class="cli-game-header">
        <span>🎯 Number Guessing Game</span>
        <span>Target: 1 ~ 100</span>
      </div>
      <div style="text-align:center; margin:10px 0;">
        <p id="guess-hint" style="color:#38bdf8; font-weight:600;">Guess a number between 1 and 100!</p>
        <div style="display:flex; justify-content:center; gap:8px; margin-top:10px;">
          <input type="number" id="guess-input" min="1" max="100" style="width:90px; padding:6px; background:#1e293b; border:1px solid #334155; color:#fff; border-radius:4px; font-size:1rem; text-align:center;">
          <button class="cli-game-btn" id="guess-submit-btn">Submit</button>
        </div>
      </div>
    </div>
  `;

  const input = mount.querySelector('#guess-input');
  const btn = mount.querySelector('#guess-submit-btn');
  const hint = mount.querySelector('#guess-hint');

  function checkGuess() {
    const val = parseInt(input.value);
    if (isNaN(val) || val < 1 || val > 100) return;
    attempts++;
    if (val === targetNum) {
      hint.innerHTML = `<span style="color:#34d399; font-weight:bold;">🎉 BINGO! Correct in ${attempts} tries!</span>`;
      btn.innerText = 'Play Again';
      btn.onclick = () => startGuessGame(mountId);
    } else if (val > targetNum) {
      hint.innerHTML = `<span style="color:#ef4444;">📉 ${val} is Too High! Try lower. (Attempt #${attempts})</span>`;
    } else {
      hint.innerHTML = `<span style="color:#f59e0b;">📈 ${val} is Too Low! Try higher. (Attempt #${attempts})</span>`;
    }
    input.value = '';
    input.focus();
  }

  btn.onclick = checkGuess;
  input.onkeydown = (e) => { if (e.key === 'Enter') checkGuess(); };
  input.focus();
}
