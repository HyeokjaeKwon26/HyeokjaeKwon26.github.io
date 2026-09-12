import urllib.request
import json
import os
import re
import difflib
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ORCID_ID = "0000-0002-1418-3448"
ORCID_URL = f"https://pub.orcid.org/v3.0/{ORCID_ID}/works"
PUBLICATIONS_FILE = os.path.join(os.path.dirname(__file__), "..", "publications.json")

JOURNAL_MAP = {
    "J Craniofac Surg": "Journal of Craniofacial Surgery",
    "Plast Reconstr Surg": "Plastic and Reconstructive Surgery",
    "Front Surg": "Frontiers in Surgery",
    "World J Clin Cases": "World Journal of Clinical Cases",
    "Arch Hand Microsurg": "Archives of Hand and Microsurgery",
    "J Clin Med": "Journal of Clinical Medicine",
    "Arch Aesthetic Plast Surg": "Archives of Aesthetic Plastic Surgery",
    "J Clin Monit Comput": "Journal of Clinical Monitoring and Computing",
    "J Dermatol Treat": "Journal of Dermatological Treatment",
    "Arch Plast Surg": "Archives of Plastic Surgery",
    "J Craniomaxillofac Surg": "Journal of Cranio-Maxillofacial Surgery",
    "J Wound Manag Res": "Journal of Wound Management and Research",
    "J Oral Maxillofac Surg": "Journal of Oral and Maxillofacial Surgery",
    "PLoS One": "PLOS ONE",
    "Medicine (Baltimore)": "Medicine",
    "Journal of Plastic, Reconstructive & Aesthetic Surgery": "Journal of Plastic, Reconstructive & Aesthetic Surgery",
    "Archives of Hand and Microsurgery": "Archives of Hand and Microsurgery",
    "Archives of Hand & Microsurgery": "Archives of Hand and Microsurgery"
}

def expand_journal_name(journal_str):
    if not journal_str:
        return "Peer-Reviewed Journal"
    clean = journal_str.strip()
    return JOURNAL_MAP.get(clean, clean)

def normalize_text(text):
    if not text:
        return ""
    return re.sub(r'[^a-z0-9]', '', text.lower())

def normalize_doi(doi):
    if not doi:
        return ""
    return doi.strip().lower().replace("https://doi.org/", "").replace("http://doi.org/", "").replace("doi:", "")

def format_author_name(author):
    family = author.get('family', '').strip()
    given = author.get('given', '').strip()
    
    if not family and not given:
        return ""
    if not given:
        return family
    if not family:
        return given
        
    parts = given.replace('.', '').split()
    initials_parts = []
    for p in parts:
        subparts = p.split('-')
        init_sub = "-".join([sp[0].upper() for sp in subparts if sp])
        if init_sub:
            initials_parts.append(init_sub)
    initials = "".join(initials_parts)
    
    return f"{family} {initials}".strip()

def normalize_single_name(name):
    name = name.strip()
    if not name:
        return ""
    # If already in 'Family Initials' Vancouver format (e.g. 'Kwon H', 'Oh S-H', 'Jeong CH', 'Kim J-H')
    if re.match(r'^[A-Z][a-zA-Z\'-]+(\-[A-Z][a-zA-Z\'-]+)?\s+[A-Z](\-[A-Z])?$', name):
        return name
    if re.match(r'^[A-Z][a-zA-Z\'-]+(\-[A-Z][a-zA-Z\'-]+)?\s+[A-Z]{1,3}$', name):
        return name
        
    if ',' in name:
        parts = name.split(',', 1)
        family = parts[0].strip()
        given = parts[1].strip()
    else:
        parts = name.split()
        if len(parts) == 1:
            return parts[0]
        family = parts[-1].strip()
        given = ' '.join(parts[:-1]).strip()

    given_clean = given.replace('.', '')
    subparts = given_clean.split()
    initials_parts = []
    for p in subparts:
        hyph_parts = p.split('-')
        init_hyph = '-'.join([hp[0].upper() for hp in hyph_parts if hp])
        if init_hyph:
            initials_parts.append(init_hyph)
    initials = ''.join(initials_parts)
    return f"{family} {initials}".strip()

def normalize_authors_string(authors_str):
    if not authors_str:
        return ""
    author_items = [a.strip() for a in authors_str.split(',') if a.strip()]
    cleaned = []
    for item in author_items:
        if item.lower().startswith('et al'):
            cleaned.append('et al.')
        else:
            cleaned.append(normalize_single_name(item))
    return ', '.join(cleaned)

def fetch_crossref_metadata(doi):
    if not doi:
        return None
    clean_doi = doi.strip().replace("https://doi.org/", "").replace("http://doi.org/", "").replace("doi:", "")
    url = f"https://api.crossref.org/works/{clean_doi}"
    req = urllib.request.Request(url, headers={'User-Agent': 'AcademicWeb/1.0 (mailto:kwon.hyeokjae@cnuh.co.kr)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as res:
            data = json.loads(res.read().decode('utf-8')).get('message', {})
            authors_data = data.get('author', [])
            formatted_authors = []
            for a in authors_data:
                fa = format_author_name(a)
                if fa:
                    formatted_authors.append(fa)
                    
            volume = data.get('volume', '')
            issue = data.get('issue', '')
            page = data.get('page', '')
            vol_str = ""
            if volume:
                vol_str = volume
                if issue:
                    vol_str += f"({issue})"
                if page:
                    vol_str += f":{page}"
                    
            date_parts = None
            if 'published-print' in data and 'date-parts' in data['published-print']:
                date_parts = data['published-print']['date-parts'][0]
            elif 'published-online' in data and 'date-parts' in data['published-online']:
                date_parts = data['published-online']['date-parts'][0]
            elif 'created' in data and 'date-parts' in data['created']:
                date_parts = data['created']['date-parts'][0]
                
            year_val = str(date_parts[0]) if date_parts and date_parts[0] else None

            journal_title = None
            if 'container-title' in data and data['container-title']:
                journal_title = data['container-title'][0].strip()

            return {
                'authors': formatted_authors,
                'raw_authors': authors_data,
                'volume': vol_str,
                'year': year_val,
                'journal': journal_title
            }
    except Exception:
        return None

def apply_et_al_rule(authors_list):
    if not authors_list:
        return "Kwon H, et al."
    if len(authors_list) <= 13:
        return ", ".join(authors_list)
    else:
        return ", ".join(authors_list[:13]) + ", et al."

def determine_authorship_category(doi, authors_str='', crossref_authors=None):
    # 1. 1저자 여부: authors_str의 첫 번째 저자가 Kwon H인지 확인
    if authors_str:
        first_author = authors_str.split(',')[0].strip().lower()
        if 'kwon' in first_author and ('h' in first_author or 'hyeokjae' in first_author):
            return 'primary'

    # 2. CrossRef sequence 'first' 여부 확인 (공동 1저자 포함)
    if crossref_authors:
        for idx, a in enumerate(crossref_authors):
            fam = a.get('family', '').lower()
            giv = a.get('given', '').lower()
            if 'kwon' in fam and ('h' in giv or 'hyeokjae' in giv):
                if idx == 0 or a.get('sequence') == 'first':
                    return 'primary'

    # 3. 알려진 기출간 논문 중 교신저자/공동교신/공동1저자 DOI 매핑
    known_primary_dois = {
        '10.1097/md.0000000000043410', # Medicine (Corresponding author)
        '10.12998/wjcc.v12.i28.6204', # WJCC (Co-corresponding author)
        '10.12998/wjcc.v12.i20.4446', # WJCC (Corresponding author)
        '10.1007/s10877-023-00988-5', # JCMC (Co-first author)
        '10.3390/healthcare14172866', # Healthcare (Corresponding author)
    }
    if doi and doi.strip().lower() in known_primary_dois:
        return 'primary'

    # 4. OpenAlex API를 통한 author_position == 'first' 또는 is_corresponding == True 확인
    if doi:
        clean_doi = doi.strip().replace('https://doi.org/', '').replace('http://doi.org/', '').replace('doi:', '')
        url = f"https://api.openalex.org/works/https://doi.org/{clean_doi}"
        req = urllib.request.Request(url, headers={'User-Agent': 'AcademicWeb/1.0 (mailto:kwon.hyeokjae@cnuh.co.kr)'})
        try:
            with urllib.request.urlopen(req, timeout=5) as res:
                data = json.loads(res.read().decode('utf-8'))
                for a in data.get('authorships', []):
                    name = a.get('author', {}).get('display_name', '').lower()
                    if 'kwon' in name and ('h' in name or 'hyeokjae' in name):
                        if a.get('author_position') == 'first' or a.get('is_corresponding') is True:
                            return 'primary'
        except Exception:
            pass

    return 'coauthor'

def is_duplicate(new_item, existing_items):
    new_title_norm = normalize_text(new_item.get('title', ''))
    new_doi_norm = normalize_doi(new_item.get('doi', ''))

    for ex in existing_items:
        ex_title_norm = normalize_text(ex.get('title', ''))
        ex_doi_norm = normalize_doi(ex.get('doi', ''))

        if new_doi_norm and ex_doi_norm and new_doi_norm == ex_doi_norm:
            return True
        if new_title_norm and ex_title_norm and new_title_norm == ex_title_norm:
            return True
        if new_title_norm and ex_title_norm:
            sim = difflib.SequenceMatcher(None, new_title_norm, ex_title_norm).ratio()
            if sim >= 0.75:
                return True

    return False

def fetch_orcid_work_details(put_code):
    detail_url = f"https://pub.orcid.org/v3.0/{ORCID_ID}/work/{put_code}"
    req = urllib.request.Request(detail_url, headers={'Accept': 'application/json'})
    try:
        with urllib.request.urlopen(req) as res:
            data = json.loads(res.read().decode('utf-8'))
            title_val = data.get('title', {}).get('title', {}).get('value', '') if data.get('title') else ''
            journal_val = data.get('journal-title', {}).get('value', '') if data.get('journal-title') else ''
            
            pub_date = data.get('publication-date')
            year_val = str(pub_date.get('year', {}).get('value', '')) if pub_date and pub_date.get('year') else ''
            
            doi_val = ''
            url_val = ''
            ext_ids = data.get('external-ids', {}).get('external-id', [])
            for ext in ext_ids:
                if ext.get('external-id-type') == 'doi':
                    doi_val = ext.get('external-id-value', '')
                    url_val = ext.get('external-id-url', {}).get('value', '') if ext.get('external-id-url') else f"https://doi.org/{doi_val}"
                    break

            if not url_val and data.get('url'):
                url_val = data.get('url', {}).get('value', '')

            crossref = fetch_crossref_metadata(doi_val) if doi_val else None
            
            if crossref and crossref.get('authors'):
                authors_str = apply_et_al_rule(crossref['authors'])
            else:
                contributors = data.get('contributors', {}).get('contributor', [])
                authors_list = []
                for c in contributors:
                    cname = c.get('credit-name', {}).get('value', '') if c.get('credit-name') else ''
                    if cname:
                        authors_list.append(normalize_single_name(cname))
                authors_str = apply_et_al_rule(authors_list) if authors_list else "Kwon H, et al."

            authors_str = normalize_authors_string(authors_str)

            volume_val = (crossref.get('volume') if crossref and crossref.get('volume') else '') or 'In press'
            if crossref and crossref.get('year'):
                year_val = crossref['year']

            if crossref and crossref.get('journal'):
                raw_journal = crossref['journal']
            else:
                raw_journal = journal_val

            full_journal = expand_journal_name(raw_journal)

            return {
                'title': title_val,
                'authors': authors_str,
                'journal': full_journal,
                'year': year_val or '2025',
                'volume': volume_val,
                'doi': doi_val,
                'url': url_val or (f"https://doi.org/{doi_val}" if doi_val else f"https://orcid.org/{ORCID_ID}"),
                'category': determine_authorship_category(doi_val, authors_str, crossref.get('raw_authors') if crossref else None)
            }
    except Exception as e:
        print(f"Error fetching put-code {put_code}: {e}")
        return None

def fetch_all_orcid_works():
    req = urllib.request.Request(ORCID_URL, headers={'Accept': 'application/json'})
    try:
        with urllib.request.urlopen(req) as res:
            data = json.loads(res.read().decode('utf-8'))
            groups = data.get('group', [])
            extracted = []
            
            for g in groups:
                summaries = g.get('work-summary', [])
                if not summaries:
                    continue
                w = summaries[0]
                put_code = w.get('put-code')
                
                if put_code:
                    detail = fetch_orcid_work_details(put_code)
                    if detail and detail.get('title'):
                        extracted.append(detail)
            return extracted
    except Exception as e:
        print(f"Error fetching ORCID summary: {e}")
        return []

def main():
    existing = []
    if os.path.exists(PUBLICATIONS_FILE):
        with open(PUBLICATIONS_FILE, 'r', encoding='utf-8') as f:
            existing = json.load(f)

    print("Refreshing live volume, issue, and authorship categories via CrossRef/OpenAlex APIs...")
    for p in existing:
        doi = p.get('doi', '')
        if doi:
            crossref = fetch_crossref_metadata(doi)
            if crossref:
                if crossref.get('volume'):
                    p['volume'] = crossref['volume']
                if crossref.get('year'):
                    p['year'] = crossref['year']
            p['category'] = determine_authorship_category(doi, p.get('authors', ''), crossref.get('raw_authors') if crossref else None)
        p['authors'] = normalize_authors_string(p.get('authors', ''))

    print("Fetching publication details from ORCID API...")
    orcid_works = fetch_all_orcid_works()
    print(f"Fetched {len(orcid_works)} works from ORCID API.")

    new_items = []
    for ow in reversed(orcid_works):
        if not is_duplicate(ow, existing) and not is_duplicate(ow, new_items):
            ow['id'] = len(existing) + len(new_items) + 1
            ow['authors'] = normalize_authors_string(ow.get('authors', ''))
            new_items.append(ow)
            print(f"Added new unique publication: {ow['title']}")

    combined = new_items + existing
    for i, p in enumerate(combined):
        p['id'] = i + 1
        p['authors'] = normalize_authors_string(p.get('authors', ''))
        
    with open(PUBLICATIONS_FILE, 'w', encoding='utf-8') as f:
        json.dump(combined, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully updated publication database. Total: {len(combined)} publications.")
    
    update_cv_html(combined)

def update_cv_html(pubs):
    cv_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'cv.html')
    if not os.path.exists(cv_file):
        return
    sorted_pubs = sorted(pubs, key=lambda p: int(p.get('year', 0)) if str(p.get('year', '')).isdigit() else 9999, reverse=True)
    pub_items = []
    for idx, p in enumerate(sorted_pubs):
        authors = p.get('authors', '')
        authors_bold = re.sub(r'\b(Kwon\s+H\b|Hyeokjae\s+Kwon\b|Kwon,\s*Hyeokjae\b)', r'<strong>\1</strong>', authors)
        title = p.get('title', '').strip()
        if not title.endswith('.'):
            title += '.'
        journal = p.get('journal', '').strip()
        year = p.get('year', '').strip()
        volume = p.get('volume', '').strip()
        doi = p.get('doi', '').strip()
        url = f'https://doi.org/{doi}' if doi else p.get('url', '')
        
        meta_str = f'{journal}. {year}'
        if volume:
            meta_str += f';{volume}'
        meta_str += '.'
        
        item = f'''        <div class="cv-pub-item">
          <div class="cv-pub-authors"><span class="cv-pub-num">{idx+1}.</span> {authors_bold}.</div>
          <div class="cv-pub-title">{title}</div>
          <div class="cv-pub-meta">{meta_str} <a href="{url}" target="_blank" rel="noopener">{url}</a></div>
        </div>'''
        pub_items.append(item)
        
    pubs_html = "\n".join(pub_items)
    with open(cv_file, 'r', encoding='utf-8') as f:
        content = f.read()
    pattern = r'(<div class="cv-pub-list" id="cv-pub-list">)(.*?)(</div>\s*</section>)'
    new_content = re.sub(pattern, r'\g<1>\n' + pubs_html + r'\n      \g<3>', content, flags=re.DOTALL)
    with open(cv_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully updated cv.html publications list.")

if __name__ == '__main__':
    main()
