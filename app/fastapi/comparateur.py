from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from sklearn.neighbors import NearestNeighbors
import requests
import os

# --- Application FastAPI ---
app = FastAPI(title="ImmoPredict Comparateur API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Chargement de la base DVF ---
BASE_PATH = os.path.join(os.path.dirname(__file__), "data", "dvf_loyer.parquet")

print(f"Chargement du fichier : {BASE_PATH}")
df = pd.read_parquet(BASE_PATH)
df = df.dropna(subset=["longitude", "latitude", "surface_reelle_bati", "nombre_pieces_principales"])
print(f"{len(df)} lignes chargées.")

# --- Géocodage d'une adresse (OpenStreetMap / Nominatim) / Récupération de la longitude et latitude d'une adresse ---
def geocode_adresse(adresse: str):
    url = "https://nominatim.openstreetmap.org/search" 
    params = {"q": adresse, "format": "json", "limit": 1}#Envoie d'une adresse q, on récupère un json et on veut une correspondance vraie (1)
    headers = {"User-Agent": "ImmoPredictApp"}
    r = requests.get(url, params=params, headers=headers, timeout=5)
    r.raise_for_status()
    data = r.json()
    if not data:
        return None
    return float(data[0]["lon"]), float(data[0]["lat"])

# --- Route principale ---
@app.get("/comparateur")
def get_comparateur(adresse: str = Query(...), typologie: str = Query(...)):
    """
    Retourne les 10 logements les plus proches d'une adresse donnée,
    avec la même typologie.
    """
    coords = geocode_adresse(adresse)
    if coords is None:
        return {"error": "Adresse non trouvée"}

    lon, lat = coords
    df_typo = df[df["typologie"] == typologie].copy()
    if df_typo.empty:
        return {"error": "Aucun bien trouvé avec cette typologie"}

    # Recherche des plus proches voisins (coordonnées)
    geo_nn = NearestNeighbors(n_neighbors=min(10, len(df_typo)))
    geo_nn.fit(df_typo[["longitude", "latitude"]])
    distances, indices = geo_nn.kneighbors([[lon, lat]])
    voisins = df_typo.iloc[indices[0]]

    cols = [
        "date_mutation",
        "valeur_fonciere",
        "nom_commune",
        "typologie",
        "surface_reelle_bati",
        "nombre_pieces_principales",
        "longitude",
        "latitude",
        "loypredm2",
        "R2_adj",
    ]

    return voisins[cols].to_dict(orient="records")
