import urllib.request
import json
import os
import re

ORCID_ID = "0000-0002-1418-3448"
ORCID_URL = f"https://pub.orcid.org/v3.0/{ORCID_ID}/works"
PUBLICATIONS_FILE = os.path.join(os.path.dirname(__file__), "..", "publications.json")

def normalize_text(text):
    if not text:
        return ""
    # Strip non-alphanumeric characters for clean string comparison
    return re.sub(r'[^a-z0-9]', '', text.lower())

def normalize_doi(doi):
    if not doi:
        return ""
    return doi.strip().lower().replace("https://doi.org/", "").replace("http://doi.org/", "").replace("doi:", "")

def determine_category(title):
    t = title.lower()
    if any(k in t for k in ['ai', 'deep learning', 'machine learning', 'exposure rate', 'eer', 'infrared']):
        return 'ai'
    if any(k in t for k in ['virtual reality', 'vr', 'lidar', 'smartphone', 'education', 'anxiety']):
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

        # 1. DOI Matching
        if new_doi_norm and ex_doi_norm and new_doi_norm == ex_doi_norm:
            return True

        # 2. Normalized Title Exact Matching
        if new_title_norm and ex_title_norm and new_title_norm == ex_title_norm:
            return True

        # 3. Substring/Prefix Similarity Matching (handles slight subtitle punctuation diffs)
        if len(new_title_norm) > 20 and len(ex_title_norm) > 20:
            if new_title_norm.startswith(ex_title_norm[:30]) or ex_title_norm.startswith(new_title_norm[:30]):
                return True

    return False

def fetch_orcid_works():
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
                
                title_val = w.get('title', {}).get('title', {}).get('value', '') if w.get('title') else ''
                if not title_val:
                    continue
                
                journal_val = w.get('journal-title', {}).get('value', '') if w.get('journal-title') else ''
                
                year_val = ''
                pub_date = w.get('publication-date')
                if pub_date and pub_date.get('year'):
                    year_val = str(pub_date.get('year', {}).get('value', ''))
                
                doi_val = ''
                url_val = ''
                ext_ids = w.get('external-ids', {}).get('external-id', [])
                for ext in ext_ids:
                    if ext.get('external-id-type') == 'doi':
                        doi_val = ext.get('external-id-value', '')
                        url_val = ext.get('external-id-url', {}).get('value', '') if ext.get('external-id-url') else f"https://doi.org/{doi_val}"
                        break
                
                if not url_val and w.get('url'):
                    url_val = w.get('url', {}).get('value', '')

                extracted.append({
                    'title': title_val,
                    'authors': 'Kwon H, et al.',
                    'journal': journal_val or 'Peer-Reviewed Journal',
                    'year': year_val or '2025',
                    'volume': 'In press',
                    'doi': doi_val,
                    'url': url_val or (f"https://doi.org/{doi_val}" if doi_val else "https://orcid.org/0000-0002-1418-3448"),
                    'category': determine_category(title_val)
                })
            return extracted
    except Exception as e:
        print(f"Error fetching ORCID works: {e}")
        return []

def main():
    existing = []
    if os.path.exists(PUBLICATIONS_FILE):
        with open(PUBLICATIONS_FILE, 'r', encoding='utf-8') as f:
            existing = json.load(f)

    orcid_works = fetch_orcid_works()
    print(f"Fetched {len(orcid_works)} works from ORCID API.")

    new_items = []
    
    for ow in reversed(orcid_works):
        if not is_duplicate(ow, existing) and not is_duplicate(ow, new_items):
            ow['id'] = len(existing) + len(new_items) + 1
            new_items.append(ow)
            print(f"Added new unique publication: {ow['title']}")

    if new_items:
        combined = existing + new_items
        for i, p in enumerate(combined):
            p['id'] = i + 1
            
        with open(PUBLICATIONS_FILE, 'w', encoding='utf-8') as f:
            json.dump(combined, f, ensure_ascii=False, indent=2)
            
        print(f"Successfully added {len(new_items)} new unique publications.")
    else:
        print("No new unique publications found. Database is completely up to date.")

if __name__ == '__main__':
    main()
