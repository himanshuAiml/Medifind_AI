import os
import re
import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from rapidfuzz import process, fuzz

# 1. Connect and load medicines
load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"))
medicines = pd.read_sql(text("select id, name, generic_name, category from medicines"), engine)


# 2. Normalizer: lowercase, keep only letters and digits
def normalize(s):
    return re.sub(r"[^a-z0-9]", "", s.lower())


# 3. One searchable entry per brand name and per generic name
entries = []
for row in medicines.itertuples():
    entries.append((normalize(row.name), row.id))
    entries.append((normalize(row.generic_name), row.id))

choices = [e[0] for e in entries]


# 4. The search function
def search_medicine(query, limit=5, cutoff=60):
    q = normalize(query)
    if not q:
        return pd.DataFrame(columns=["name", "generic_name", "score"])

    hits = process.extract(q, choices, scorer=fuzz.WRatio, limit=limit * 3, score_cutoff=cutoff)

    best = {}
    for _, score, idx in hits:
        med_id = entries[idx][1]
        if med_id not in best:
            best[med_id] = score

    out = medicines.set_index("id").loc[list(best), ["name", "generic_name"]].copy()
    out["score"] = [round(best[i], 1) for i in out.index]
    return out.head(limit)


# 5. Try it with typos
for q in ["dolo650", "paracetmol", "crocin advnce", "metformin", "glycomet500", "asthalin inhler", "xyzabc"]:
    print(f"\nSearch: {q!r}")
    result = search_medicine(q)
    print(result.to_string() if not result.empty else "No match found")