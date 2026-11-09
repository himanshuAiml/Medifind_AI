import re
import pandas as pd
from rapidfuzz import process, fuzz
from sqlalchemy import text

from backend.db import engine


def normalize(s):
    return re.sub(r"[^a-z0-9]", "", (s or "").lower())


# Loaded once, when the server starts
medicines = pd.read_sql(
    text("select id, name, generic_name, category, base_price from medicines"), engine
)
meds_by_id = medicines.set_index("id")

entries = []
for row in medicines.itertuples():
    for label in (row.name, row.generic_name):
        key = normalize(label)
        if key:
            entries.append((key, row.id))
choices = [e[0] for e in entries]


def search_medicine(query, limit=5, cutoff=60):
    q = normalize(query)
    if not q:
        return []

    hits = process.extract(q, choices, scorer=fuzz.WRatio, limit=limit * 3, score_cutoff=cutoff)

    best = {}
    for _, score, idx in hits:
        med_id = entries[idx][1]
        if med_id not in best:
            best[med_id] = score

    results = []
    for med_id, score in list(best.items())[:limit]:
        row = meds_by_id.loc[med_id]
        results.append({
            "id": int(med_id),
            "name": row["name"],
            "generic_name": row["generic_name"],
            "category": row["category"],
            "base_price": float(row["base_price"]),
            "score": round(float(score), 1),
        })
    return results