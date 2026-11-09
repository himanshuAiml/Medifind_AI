from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes import medicines, predict, forecast, pharmacies

app = FastAPI(title="MediFind AI API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(medicines.router)
app.include_router(predict.router)
app.include_router(forecast.router)
app.include_router(pharmacies.router)


@app.get("/health")
def health():
    return {"status": "ok"}