from datetime import date as Date
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from backend.locator import nearby_pharmacies

router = APIRouter(prefix="/pharmacies", tags=["pharmacies"])


@router.get("/nearby")
def nearby(
    lat: float = Query(..., ge=-90, le=90, description="User latitude"),
    lng: float = Query(..., ge=-180, le=180, description="User longitude"),
    radius_km: float = Query(5, gt=0, le=50, description="Search radius in km"),
    limit: int = Query(10, ge=1, le=50),
    medicine_id: Optional[int] = Query(None, ge=1, description="If given, rank by stock probability"),
    date: Optional[Date] = Query(None, description="YYYY-MM-DD, defaults to today"),
):
    try:
        results = nearby_pharmacies(lat, lng, radius_km, limit, medicine_id, date)
    except KeyError:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return {
        "lat": lat,
        "lng": lng,
        "radius_km": radius_km,
        "medicine_id": medicine_id,
        "count": len(results),
        "results": results,
    }