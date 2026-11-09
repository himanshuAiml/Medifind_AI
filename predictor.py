from pathlib import Path

import joblib
import pandas as pd
from sqlalchemy import text

from backend.db import engine

# Load the trained model once, when the server starts
MODEL_PATH = Path(__file__).resolve().parents[1] / "ml" / "models" / "availability_model.joblib"
saved = joblib.load(MODEL_PATH)
model = saved["model"]
columns = saved["columns"]

# Load the small lookup tables once
medicines = pd.read_sql(
    text("select id, name, category, popularity, is_chronic, is_seasonal, base_price from medicines"),
    engine,
).set_index("id")

pharmacies = pd.read_sql(
    text("select id, name, address, latitude, longitude, size, restock_day from pharmacies"),
    engine,
)


def predict_availability(medicine_id, day):
    med = medicines.loc[medicine_id]  # raises KeyError if the id does not exist

    dow = (day.weekday() + 1) % 7  # database convention: 0 = Sunday

    X = pharmacies[["size", "restock_day"]].copy()
    X["category"] = med["category"]
    X["day_of_week"] = dow
    X["month"] = day.month
    X["days_since_restock"] = (dow - X["restock_day"] + 7) % 7
    X["popularity"] = float(med["popularity"])
    X["is_chronic"] = int(med["is_chronic"])
    X["is_seasonal"] = int(med["is_seasonal"])
    X["base_price"] = float(med["base_price"])

    proba = model.predict_proba(X[columns])[:, 1]

    out = pharmacies[["id", "name", "address", "latitude", "longitude", "size"]].copy()
    out["probability"] = proba.astype(float).round(3)
    out = out.sort_values("probability", ascending=False)

    return {
        "medicine_id": int(medicine_id),
        "medicine_name": med["name"],
        "date": str(day),
        "results": out.to_dict(orient="records"),
    }