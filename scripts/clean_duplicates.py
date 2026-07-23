import json
import os
import difflib
import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

PUBLICATIONS_FILE = os.path.join(os.path.dirname(__file__), "..", "publications.json")

def normalize(text):
    if not text:
        return ""
    return re.sub(r'[^a-z0-9]', '', text.lower())

def score_quality(item):
    score = 0
    if item.get('authors') and item['authors'] != 'Kwon H, et al.':
        score += 10
    if item.get('volume') and item['volume'] != 'In press':
        score += 5
    if item.get('doi'):
        score += 5
    if item.get('journal') and 'Peer-Reviewed' not in item['journal']:
        score += 2
    return score

def main():
    with open(PUBLICATIONS_FILE, 'r', encoding='utf-8') as f:
        pubs = json.load(f)

    print(f"Original publications count: {len(pubs)}")

    to_remove = set()
    n = len(pubs)

    for i in range(n):
        if i in to_remove:
            continue
        for j in range(i + 1, n):
            if j in to_remove:
                continue

            p1 = pubs[i]
            p2 = pubs[j]

            # 1. DOI Exact match
            doi1 = p1.get('doi', '').strip().lower()
            doi2 = p2.get('doi', '').strip().lower()

            # 2. Title Fuzzy similarity
            t1 = p1.get('title', '')
            t2 = p2.get('title', '')
            sim = difflib.SequenceMatcher(None, normalize(t1), normalize(t2)).ratio()

            is_dupe = False
            if doi1 and doi2 and doi1 == doi2:
                is_dupe = True
                reason = "DOI match"
            elif sim >= 0.75:
                is_dupe = True
                reason = f"Title similarity {sim:.2f}"

            if is_dupe:
                q1 = score_quality(p1)
                q2 = score_quality(p2)
                
                # Keep higher quality one
                if q1 >= q2:
                    to_remove.add(j)
                    print(f"Duplicate found ({reason}): Keeping [{p1['id']}] {p1['title']} over [{p2['id']}] {p2['title']}")
                else:
                    to_remove.add(i)
                    print(f"Duplicate found ({reason}): Keeping [{p2['id']}] {p2['title']} over [{p1['id']}] {p1['title']}")
                    break

    cleaned = [p for idx, p in enumerate(pubs) if idx not in to_remove]
    
    # Re-index IDs
    for idx, p in enumerate(cleaned):
        p['id'] = idx + 1

    with open(PUBLICATIONS_FILE, 'w', encoding='utf-8') as f:
        json.dump(cleaned, f, ensure_ascii=False, indent=2)

    print(f"\nCleaned publications count: {len(cleaned)} (Removed {len(to_remove)} duplicates)")

if __name__ == '__main__':
    main()
