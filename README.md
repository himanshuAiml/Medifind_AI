MediFind AI

MediFind AI is a medicine discovery and healthcare information platform built using React, Vite, FastAPI, and Python. It provides medicine search, predictions, forecasting, alternatives, pharmacy location, and statistical insights.

# How to Run Locally

1. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/himanshuAiml/Medifind_AI.git
```

Move into the project folder:

```bash
cd Medifind_AI
```



# 2. Run the Backend

Open a terminal in the project folder and run these commands one by one:

```bash
python -m venv venv
```

Activate the virtual environment:

```bash
venv\Scripts\activate
```

Install the required packages:

```bash
pip install -r backend/requirements.txt
```

Start the backend:

```bash
python -m uvicorn backend.main:app --reload --port 8000
```

The backend will run at:

http://127.0.0.1:8000

API documentation:

http://127.0.0.1:8000/docs

# 3. Run the Frontend

Open a **new terminal**. Navigate to the frontend folder:

```bash
cd Medifind_AI/frontend
```

Install the required packages:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend will run at:

http://localhost:5173

Open the above link in your browser to use MediFind AI.

Important

Create a .env file inside the ML folder and add your database connection string:

DATABASE_URL="your_database_url"

Replace your_database_url with your actual database connection string.

Keep both terminals running while using the application.
