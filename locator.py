from datetime import date

import numpy as np

from backend.predictor import pharmacies, predict_availability


def haversine_km(lat1, lon1, lat2, lon2):
    """Straight-line distance in km between two lat/lon points."""
    r = 6371.0  # Earth's radius in km
    p1, p2 = np.radians(lat1), np.radians(lat2)
    dphi = p2 - p1
    dlmb = np.radians(lon2) - np.radians(lon1)
    a = np.sin(dphi / 2) ** 2 + np.cos(p1) * np.cos(p2) * np.sin(dlmb / 2) ** 2
    return 2 * r * np.arcsin(np.sqrt(a))


def nearby_pharmacies(lat, lng, radius_km, limit, medicine_id=None, day=None):
    df = pharmacies[["id", "name", "address", "latitude", "longitude", "size"]].copy()
    df["distance_km"] = haversine_km(lat, lng, df["latitude"], df["longitude"]).round(2)
    df = df[df["distance_km"] <= radius_km]

    if medicine_id is not None:
        pred = predict_availability(medicine_id, day or date.today())  # KeyError if unknown
        probs = {row["id"]: row["probability"] for row in pred["results"]}
        df["probability"] = df["id"].map(probs)
        df = df.sort_values(["probability", "distance_km"], ascending=[False, True])
    else:
        df = df.sort_values("distance_km")

    return df.head(limit).to_dict(orient="records")