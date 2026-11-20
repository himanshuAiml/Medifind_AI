from sqlalchemy import text

from backend.db import engine


def get_stats() -> dict:
    with engine.connect() as conn:
        pharmacies = conn.execute(text("SELECT COUNT(*) FROM pharmacies")).scalar()
        medicines = conn.execute(text("SELECT COUNT(*) FROM medicines")).scalar()
        generics = conn.execute(
            text("SELECT COUNT(DISTINCT generic_name) FROM medicines")
        ).scalar()
    return {
        "pharmacies": int(pharmacies),
        "medicines": int(medicines),
        "generics": int(generics),
    }