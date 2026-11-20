import pandas as pd
from sqlalchemy import text

from backend.db import engine

with engine.connect() as conn:
    _meds = pd.read_sql(
        text("SELECT id, name, generic_name, category, base_price FROM medicines"),
        conn,
    )

_meds["generic_key"] = _meds["generic_name"].str.lower().str.strip()


def get_alternatives(medicine_id: int) -> dict:
    row = _meds[_meds["id"] == medicine_id]
    if row.empty:
        raise KeyError(medicine_id)
    med = row.iloc[0]
    price = float(med["base_price"])

    same = _meds[
        (_meds["generic_key"] == med["generic_key"]) & (_meds["id"] != medicine_id)
    ].sort_values("base_price")

    alternatives = []
    for _, r in same.iterrows():
        p = float(r["base_price"])
        alternatives.append(
            {
                "id": int(r["id"]),
                "name": r["name"],
                "base_price": p,
                "saving": round(price - p, 2),
                "saving_pct": round((price - p) / price * 100) if price else 0,
            }
        )

    return {
        "medicine": {
            "id": int(med["id"]),
            "name": med["name"],
            "generic_name": med["generic_name"],
            "base_price": price,
        },
        "alternatives": alternatives,
    }