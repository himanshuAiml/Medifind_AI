from fastapi import APIRouter, HTTPException

from backend.alternatives import get_alternatives

router = APIRouter(prefix="/medicines", tags=["alternatives"])


@router.get("/{medicine_id}/alternatives")
def alternatives(medicine_id: int):
    try:
        return get_alternatives(medicine_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Medicine not found")