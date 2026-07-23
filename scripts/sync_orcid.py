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

def determine_category(title):
    t = title.lower()
    if any(k in t for k in ['ai', 'deep learning', 'machine learning', 'exposure rate', 'eer', 'infrared', 'gaussian splatting']):
        return 'ai'
    if any(k in t for k in ['virtual reality', 'vr', 'lidar', 'smartphone', 'education', 'anxiety', 'questionnaire']):
        return 'tech'
    if 'case report' in t:
        return 'case-report'
    return 'recon'

def is_duplicate(new_item, existing_items):
    new_title_norm = normalize_text(new_item.get('title', ''))
    new_doi_norm = normalize_doi(new_item.get('doi', ''))

    for ex in existing_items:
        ex_title_norm = normalize_text(ex.get('title', ''))
        ex_doi_norm = normalize_doi(ex.get('doi', ''))

        # 1. DOI Exact Matching
        if new_doi_norm and ex_doi_norm and new_doi_norm == ex_doi_norm:
            return True

        # 2. Normalized Title Exact Matching
        if new_title_norm and ex_title_norm and new_title_norm == ex_title_norm:
            return True

        # 3. Fuzzy Sequence Similarity Matching (>= 0.75 threshold)
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
            
            contributors = data.get('contributors', {}).get('contributor', [])
            authors_list = []
            for c in contributors:
                cname = c.get('credit-name', {}).get('value', '') if c.get('credit-name') else ''
                if cname:
                    authors_list.append(cname)
            authors_str = ", ".join(authors_list) if authors_list else "Kwon H, et al."
            
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

            full_journal = expand_journal_name(journal_val)

            return {
                'title': title_val,
                'authors': authors_str,
                'journal': full_journal,
                'year': year_val or '2025',
                'volume': 'In press',
                'doi': doi_val,
                'url': url_val or (f"https://doi.org/{doi_val}" if doi_val else f"https://orcid.org/{ORCID_ID}"),
                'category': determine_category(title_val)
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

    print("Fetching publication details from ORCID API...")
    orcid_works = fetch_all_orcid_works()
    print(f"Fetched {len(orcid_works)} works from ORCID API.")

    new_items = []
    for ow in reversed(orcid_works):
        if not is_duplicate(ow, existing) and not is_duplicate(ow, new_items):
            ow['id'] = len(existing) + len(new_items) + 1
            new_items.append(ow)
            print(f"Added new unique publication: {ow['title']}")

    if new_items:
        combined = new_items + existing
        for i, p in enumerate(combined):
            p['id'] = i + 1
            
        with open(PUBLICATIONS_FILE, 'w', encoding='utf-8') as f:
            json.dump(combined, f, ensure_ascii=False, indent=2)
            
        print(f"Successfully merged {len(new_items)} new publications.")
    else:
        print("Database is 100% up to date with full journal names.")

if __name__ == '__main__':
    main()
