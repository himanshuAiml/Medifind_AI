import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine

# Load from multiple locations: cwd, root, ml/, backend/
root_dir = Path(__file__).resolve().parents[1]
load_dotenv(root_dir / ".env")
load_dotenv(root_dir / "ml" / ".env")
load_dotenv(root_dir / "backend" / ".env")
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is missing. Please set DATABASE_URL in your .env or environment variables.")

# Handle PostgreSQL dialects from cloud providers (e.g. Render/Supabase)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg2://", 1)
elif DATABASE_URL.startswith("postgresql://") and not DATABASE_URL.startswith("postgresql+"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
