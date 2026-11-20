from fastapi import APIRouter

from backend.stats import get_stats

router = APIRouter(tags=["stats"])


@router.get("/stats")
def stats():
    return get_stats()