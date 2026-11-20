
# MediFind AI

MediFind AI is a medicine discovery and healthcare information platform built using React, Vite, FastAPI, and Python. It provides medicine search, predictions, forecasting, alternatives, pharmacy location, and statistical insights.

## Features

- Medicine search
- Medicine prediction
- Forecasting
- Alternative medicine suggestions
- Pharmacy location
- Statistical insights

## Running Locally

### 1. Clone the Repository

```bash
git clone https://github.com/himanshuAiml/Medifind_AI.git
cd Medifind_AI
```

### 2. Set Up the Backend

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

Install the dependencies:

```bash
pip install -r backend/requirements.txt
```

Start the backend server:

```bash
python -m uvicorn backend.main:app --reload --port 8000
```

Backend: http://127.0.0.1:8000

API Documentation: http://127.0.0.1:8000/docs

### 3. Set Up the Frontend

Open a new terminal in the project folder.

Navigate to the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend: http://localhost:5173

Open the frontend URL in your browser to access MediFind AI.

## Environment Configuration

Create a `.env` file inside the `ML` folder and add your database connection string:

```env
DATABASE_URL="your_database_url"
```

Replace `your_database_url` with your actual database connection string.


## Database Setup
1. Create a PostgreSQL database (e.g. on Supabase or locally).
2. Run the SQL script located at `backend/schema_and_seed.sql` in your PostgreSQL database or Supabase SQL Editor to create the tables and seed demo data.

Keep both the backend and frontend servers running while using the application.
