import json
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

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

def main():
    with open(PUBLICATIONS_FILE, 'r', encoding='utf-8') as f:
        pubs = json.load(f)

    updated_count = 0
    for p in pubs:
        old_j = p.get('journal', '')
        new_j = expand_journal_name(old_j)
        if old_j != new_j:
            print(f"[{p['id']}] Expanded: '{old_j}' -> '{new_j}'")
            p['journal'] = new_j
            updated_count += 1

    with open(PUBLICATIONS_FILE, 'w', encoding='utf-8') as f:
        json.dump(pubs, f, ensure_ascii=False, indent=2)

    print(f"\nExpanded {updated_count} journal names to full terms in publications.json.")

if __name__ == '__main__':
    main()
