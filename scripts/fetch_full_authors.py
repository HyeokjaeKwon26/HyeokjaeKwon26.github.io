import urllib.request
import json
import os
import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

PUBLICATIONS_FILE = os.path.join(os.path.dirname(__file__), "..", "publications.json")

def format_author_name(author):
    family = author.get('family', '').strip()
    given = author.get('given', '').strip()
    
    if not family and not given:
        return ""
    if not given:
        return family
    if not family:
        return given
        
    # Extract initials from given name (e.g. "Hyeokjae" -> "H", "Sung-Hwan" -> "S-H", "Seung-Hyun" -> "S-H")
    parts = given.replace('.', '').split()
    initials_parts = []
    for p in parts:
        subparts = p.split('-')
        init_sub = "-".join([sp[0].upper() for sp in subparts if sp])
        if init_sub:
            initials_parts.append(init_sub)
    initials = "".join(initials_parts)
    
    return f"{family} {initials}".strip()

def fetch_authors_from_crossref(doi):
    if not doi:
        return None
    clean_doi = doi.strip().replace("https://doi.org/", "").replace("http://doi.org/", "").replace("doi:", "")
    url = f"https://api.crossref.org/works/{clean_doi}"
    req = urllib.request.Request(url, headers={'User-Agent': 'AcademicWeb/1.0 (mailto:kwon.hyeokjae@cnuh.co.kr)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as res:
            data = json.loads(res.read().decode('utf-8'))
            authors_data = data.get('message', {}).get('author', [])
            if not authors_data:
                return None
                
            formatted_list = []
            for a in authors_data:
                formatted = format_author_name(a)
                if formatted:
                    formatted_list.append(formatted)
            return formatted_list
    except Exception as e:
        print(f"CrossRef error for DOI {doi}: {e}")
        return None

def apply_et_al_rule(authors_list):
    if not authors_list:
        return "Kwon H, et al."
    if len(authors_list) <= 6:
        return ", ".join(authors_list)
    else:
        return ", ".join(authors_list[:6]) + ", et al."

def main():
    with open(PUBLICATIONS_FILE, 'r', encoding='utf-8') as f:
        pubs = json.load(f)

    print(f"Processing {len(pubs)} publications to fetch complete author lists...")

    for p in pubs:
        doi = p.get('doi', '')
        old_authors_str = p.get('authors', '')
        
        crossref_authors = fetch_authors_from_crossref(doi) if doi else None
        
        if crossref_authors:
            new_authors_str = apply_et_al_rule(crossref_authors)
            p['authors'] = new_authors_str
            print(f"[{p['id']}] Fetched {len(crossref_authors)} authors -> '{new_authors_str}'")
        else:
            # Fallback if CrossRef not available: parse existing string
            existing_parts = [a.strip() for a in old_authors_str.replace(', et al.', '').replace(' et al.', '').split(',') if a.strip()]
            new_authors_str = apply_et_al_rule(existing_parts)
            p['authors'] = new_authors_str
            print(f"[{p['id']}] Formatted existing authors -> '{new_authors_str}'")

    with open(PUBLICATIONS_FILE, 'w', encoding='utf-8') as f:
        json.dump(pubs, f, ensure_ascii=False, indent=2)

    print("\nSuccessfully updated all publication author lists with <=6 explicit author / >6 et al. rule.")

if __name__ == '__main__':
    main()
