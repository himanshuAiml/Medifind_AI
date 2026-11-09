import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine

# The .env file lives in the ml/ folder, so build its path from this file's location
load_dotenv(Path(__file__).resolve().parents[1] / "ml" / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is missing. Check ml/.env")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)