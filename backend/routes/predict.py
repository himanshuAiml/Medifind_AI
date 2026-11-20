from datetime import date as Date
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from backend.predictor import predict_availability

router = APIRouter(prefix="/predict", tags=["predict"])


class AvailabilityRequest(BaseModel):
    medicine_id: int = Field(..., ge=1, description="Id of the medicine")
    date: Optional[Date] = Field(None, description="YYYY-MM-DD, defaults to today")


@router.post("/availability")
def availability(req: AvailabilityRequest):
    day = req.date or Date.today()
    try:
        return predict_availability(req.medicine_id, day)
    except KeyError:
        raise HTTPException(status_code=404, detail="Medicine not found")