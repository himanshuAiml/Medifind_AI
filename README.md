# MediFind AI

AI-powered medicine availability and alternative finder. Search for a medicine (typos allowed), find nearby pharmacies, and see how likely it is to be in stock.

**Team MediFind (Team id = 8)**

| Member | Role | Area |
|---|---|---|
| Himanshu Gupta | Team Leader and ML Lead | `ml/` |
| Chaudhary Harsh | Backend and Database Lead | `database/`, `backend/` |
| Hitesh Kumar | Frontend Lead | `frontend/` |

## Repository structure

| Folder | Contents | Synopsis section |
|---|---|---|
| `docs/` | Idea proposal and project synopsis | All sections |
| `database/` | Supabase (PostgreSQL) schema and synthetic data generation SQL | 12. Data Design |
| `ml/` | Availability prediction pipeline, saved model, requirements | 2. Technologies and ML Models, 11. Architecture |
| `backend/` | API and FastAPI ML microservice (planned) | 11. Architecture |
| `frontend/` | React + Tailwind UI (planned) | 11. Architecture |

## ML: availability prediction

Predicts whether a medicine is in stock at a pharmacy on a given day.

- Data: 438,000 rows (365 days x 30 medicines x 40 pharmacies), joined from three tables
- Split: time-based (train on the past, test on the last 65 days)
- Models compared: majority baseline, Logistic Regression, Random Forest, XGBoost

| Model | Accuracy | ROC-AUC |
|---|---|---|
| Baseline | 0.522 | 0.500 |
| Logistic Regression | 0.672 | 0.722 |
| Random Forest | 0.673 | 0.725 |
| XGBoost | 0.675 | 0.727 |

XGBoost probabilities are well calibrated (Brier score 0.21), so the app shows a percentage chance instead of a hard yes/no.

## Setup (ML)

```
python -m venv .venv
.venv\Scripts\activate
pip install -r ml/requirements.txt
```

Create `ml/.env` with one line (never commit this file):

```
DATABASE_URL=postgresql+psycopg2://<user>:<password>@<host>:5432/postgres
```

Run:

```
python ml/01_load_and_split.py
```

## Backend API (FastAPI)

Run from the repository root with the virtual environment active:

```
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

Interactive docs are at `http://127.0.0.1:8000/docs`. The API reads `DATABASE_URL` from `ml/.env` and loads the saved models from `ml/models/`.

| Endpoint | Method | Purpose |
|---|---|---|
| `/health` | GET | Server status check |
| `/medicines/search?q=paracetmol` | GET | Typo-tolerant medicine search (RapidFuzz), matches brand and generic names |
| `/predict/availability` | POST | Stock probability for a medicine at every pharmacy, ranked. Body: `{"medicine_id": 1, "date": "2026-12-25"}` (date optional) |
| `/forecast/demand?medicine_id=1&days=28` | GET | Daily and weekly demand forecast for a medicine |
| `/pharmacies/nearby?lat=27.4924&lng=77.6737&radius_km=3&medicine_id=1` | GET | Pharmacies within a radius, optionally ranked by stock probability (`medicine_id` optional) |

### Backend structure

| File | Role |
|---|---|
| `backend/main.py` | App setup, CORS, router registration |
| `backend/db.py` | Database connection (SQLAlchemy) |
| `backend/search.py` | Fuzzy search logic |
| `backend/predictor.py` | Availability model: feature building and prediction |
| `backend/forecaster.py` | Demand model: feature building and forecasting |
| `backend/locator.py` | Haversine distance and nearby ranking |
| `backend/routes/` | One router file per endpoint group |

## Progress (week-wise plan from the synopsis)

- [x] Week 1-2: schema and synthetic data generator
- [x] Week 3: fuzzy medicine search (RapidFuzz)
- [x] Week 5: availability prediction model trained, calibrated and saved
- [x] Week 5: FastAPI service (search, availability, forecast, nearby endpoints)
- [x] Week 6: demand forecasting
- [ ] Week 4: pharmacy locator map (frontend)
- [ ] Week 6: price comparison
- [ ] Week 7: generic alternatives, hardening
- [ ] Week 8: deployment and demo
