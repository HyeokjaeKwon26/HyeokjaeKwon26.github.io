import urllib.request
import json
import os
import re

ORCID_ID = "0000-0002-1418-3448"
ORCID_URL = f"https://pub.orcid.org/v3.0/{ORCID_ID}/works"
PUBLICATIONS_FILE = os.path.join(os.path.dirname(__file__), "..", "publications.json")
SCRIPT_JS_FILE = os.path.join(os.path.dirname(__file__), "..", "script.js")

def normalize_text(text):
    if not text:
        return ""
    return re.sub(r'[^a-zA-Z0-9]', '', text.lower())

def determine_category(title):
    t = title.lower()
    if any(k in t for k in ['ai', 'deep learning', 'machine learning', 'exposure rate', 'eer', 'infrared']):
        return 'ai'
    if any(k in t for k in ['virtual reality', 'vr', 'lidar', 'smartphone', 'education', 'anxiety']):
        return 'tech'
    if 'case report' in t:
        return 'case-report'
    return 'recon'

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
                    'authors': 'Kwon H, et al.',  # default placeholder for new ORCID imports
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

    existing_titles = {normalize_text(p['title']): p for p in existing}
    
    updated = False
    new_items = []
    
    for ow in reversed(orcid_works):
        norm = normalize_text(ow['title'])
        if norm not in existing_titles:
            new_id = len(existing) + len(new_items) + 1
            ow['id'] = new_id
            new_items.append(ow)
            updated = True
            print(f"Added new publication from ORCID: {ow['title']}")

    if new_items:
        combined = existing + new_items
        # Re-index IDs
        for i, p in enumerate(combined):
            p['id'] = i + 1
            
        with open(PUBLICATIONS_FILE, 'w', encoding='utf-8') as f:
            json.dump(combined, f, ensure_ascii=False, indent=2)
            
        print(f"Successfully added {len(new_items)} new publications.")

if __name__ == '__main__':
    main()
