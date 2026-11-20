# MediFind AI

An AI-powered medicine availability and alternative finder. Search for a medicine (even with spelling mistakes), see which nearby pharmacies are likely to have it in stock, compare cheaper brands with the same active ingredient, and, for pharmacy owners, view a demand forecast with a suggested order quantity.

**Live demo:** https://medifind-ai-pi.vercel.app
**API docs:** https://medifind-api-9mhu.onrender.com/docs

> The backend runs on a free tier and sleeps when idle, so the first request after a break can take about a minute. The pharmacy and sales data is synthetic demo data, and stock predictions are estimates, not live inventory.

## Features

**For patients**
- Typo-tolerant medicine search (fuzzy matching on brand and generic names)
- Stock-availability prediction for nearby pharmacies (ML model), ranked by chance in stock and distance
- Interactive map with colour-coded pharmacies
- Cheaper alternatives: other brands with the same active ingredient, with price savings
- Location options: browser location, pick a point on the map, or a demo location

**For pharmacies**
- 28-day demand forecast per medicine (daily and weekly charts)
- Suggested order quantity with a safety buffer

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Leaflet (react-leaflet), Chart.js |
| Backend | Python, FastAPI, Uvicorn, SQLAlchemy |
| Database | PostgreSQL on Supabase |
| ML | scikit-learn, XGBoost, pandas, RapidFuzz |
| Hosting | Vercel (frontend), Render (backend) |

## How the ML works

- **Availability model:** an XGBoost classifier predicts the probability that a pharmacy has a medicine in stock, from features such as day of week, days since last restock, medicine popularity, category and seasonality. Trained with a time-based split, compared against a baseline, logistic regression and random forest, and checked with ROC-AUC and calibration.
- **Demand forecast:** a log-target regression with trend, weekend and seasonal terms, evaluated with WAPE and MAE against a simple baseline.
- **Fuzzy search:** normalised names matched with RapidFuzz (WRatio) with a score cutoff.

## Project structure

```
backend/    FastAPI app, routes, services and the SQL schema/seed file
frontend/   React + Vite app
ml/         Training scripts and saved models (ml/models/*.joblib)
```

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Service status |
| GET | `/medicines/search?q=` | Fuzzy medicine search |
| GET | `/medicines/{id}/alternatives` | Same-ingredient brands, cheapest first |
| POST | `/predict/availability` | Stock probability per pharmacy |
| GET | `/pharmacies/nearby` | Nearby pharmacies, ranked by stock chance and distance |
| GET | `/forecast/demand` | Demand forecast for a medicine |
| GET | `/stats` | Catalogue counts |

## Running locally

### 1. Clone

```bash
git clone https://github.com/himanshuAiml/Medifind_AI.git
cd Medifind_AI
```

### 2. Database

Create a PostgreSQL database (for example on Supabase) and run `backend/schema_and_seed.sql` in the SQL editor to create the tables and demo data.

Create a `.env` file inside the `ml` folder:

```env
DATABASE_URL="postgresql+psycopg2://USER:PASSWORD@HOST:5432/postgres"
```

Never commit this file.

### 3. Backend

```bash
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

API: http://127.0.0.1:8000, docs: http://127.0.0.1:8000/docs

### 4. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173. To point the frontend at a different API, set `VITE_API_URL`.

## Deployment

- **Backend (Render):** build `pip install -r backend/requirements.txt`, start `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`, environment variables `DATABASE_URL` and `PYTHON_VERSION`.
- **Frontend (Vercel):** root directory `frontend`, environment variable `VITE_API_URL` set to the backend URL.

## Notes and limitations

- Pharmacies, inventory and sales history are synthetic, so the app demonstrates the approach rather than real availability.
- The "For pharmacies" view is a separate tab, not an access-controlled area. Real role-based access would need authentication.
- Same active ingredient does not guarantee the same strength or suitability. Always consult a pharmacist or doctor before switching medicines.

## Author

Himanshu Gupta
