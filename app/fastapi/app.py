from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.fastapi.comparateur import router as comparateur_router
from app.fastapi.prediction import router as prediction_router

app = FastAPI(title="ImmoPredict API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enregistrement des routes
app.include_router(comparateur_router)
app.include_router(prediction_router)