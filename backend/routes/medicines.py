from fastapi import APIRouter, Query

from backend.search import search_medicine

router = APIRouter(prefix="/medicines", tags=["medicines"])


@router.get("/search")
def search(
    q: str = Query(..., min_length=1, description="Medicine name, typos allowed"),
    limit: int = Query(5, ge=1, le=20),
):
    results = search_medicine(q, limit=limit)
    return {"query": q, "count": len(results), "results": results}