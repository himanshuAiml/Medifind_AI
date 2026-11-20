from datetime import date as Date
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from backend.forecaster import forecast_demand

router = APIRouter(prefix="/forecast", tags=["forecast"])


@router.get("/demand")
def demand(
    medicine_id: int = Query(..., ge=1, description="Id of the medicine"),
    days: int = Query(28, ge=7, le=90, description="How many days to forecast"),
    from_date: Optional[Date] = Query(None, description="YYYY-MM-DD, defaults to today"),
):
    try:
        return forecast_demand(medicine_id, days, from_date or Date.today())
    except KeyError:
        raise HTTPException(status_code=404, detail="Medicine not found")