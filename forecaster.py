from pathlib import Path

import joblib
import numpy as np
import pandas as pd

from backend.search import meds_by_id

# Load the trained demand model and its metadata once, at startup
MODEL_PATH = Path(__file__).resolve().parents[1] / "ml" / "models" / "demand_model.joblib"
saved = joblib.load(MODEL_PATH)
model = saved["model"]
columns = saved["columns"]
start = saved["start"]
seasonal = saved["seasonal"]


def add_features(frame):
    # Must match the training script exactly
    frame = frame.copy()
    frame["t"] = (frame["record_date"] - start).dt.days
    frame["is_weekend"] = (frame["record_date"].dt.dayofweek >= 5).astype(int)
    angle = 2 * np.pi * frame["record_date"].dt.dayofyear / 365.25
    for k in (1, 2):
        frame[f"sin{k}"] = frame["is_seasonal"] * np.sin(k * angle)
        frame[f"cos{k}"] = frame["is_seasonal"] * np.cos(k * angle)
    return frame


def forecast_demand(medicine_id, days, from_date):
    key = str(medicine_id)
    if key not in seasonal:
        raise KeyError(medicine_id)

    future = pd.DataFrame({"record_date": pd.date_range(pd.Timestamp(from_date), periods=days)})
    future["medicine_id"] = key
    future["is_seasonal"] = int(seasonal[key])
    future = add_features(future)
    future["units"] = np.exp(model.predict(future[columns])).round().astype(int)

    future["week"] = np.arange(len(future)) // 7
    weekly = future.groupby("week").agg(
        week_start=("record_date", "min"),
        days=("units", "size"),
        units=("units", "sum"),
    )

    return {
        "medicine_id": int(medicine_id),
        "medicine_name": meds_by_id.loc[medicine_id, "name"],
        "from_date": str(pd.Timestamp(from_date).date()),
        "days": days,
        "total_units": int(future["units"].sum()),
        "weekly": [
            {"week_start": r.week_start.strftime("%Y-%m-%d"), "days": int(r.days), "units": int(r.units)}
            for r in weekly.itertuples()
        ],
        "daily": [
            {"date": d.strftime("%Y-%m-%d"), "units": int(u)}
            for d, u in zip(future["record_date"], future["units"])
        ],
    }