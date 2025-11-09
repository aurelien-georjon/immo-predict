from fastapi import Query, APIRouter
import pandas as pd
from sklearn.neighbors import NearestNeighbors
import requests
import os

router = APIRouter()

BASE_PATH = os.path.join(os.path.dirname(__file__), "data", "dvf_loyer.parquet")
df = pd.read_parquet(BASE_PATH)
df = df.dropna(subset=["longitude", "latitude", "surface_reelle_bati", "nombre_pieces_principales"])

def geocode_adresse(adresse: str):
    url = "https://nominatim.openstreetmap.org/search"
    params = {"q": adresse, "format": "json", "limit": 1}
    headers = {"User-Agent": "ImmoPredictApp"}
    r = requests.get(url, params=params, headers=headers, timeout=5)
    data = r.json()
    if not data:
        return None
    return float(data[0]["lon"]), float(data[0]["lat"])

@router.get("/comparateur")
def get_comparateur(adresse: str = Query(...), typologie: str = Query(...)):
    coords = geocode_adresse(adresse)
    if coords is None:
        return {"error": "Adresse non trouvée"}

    lon, lat = coords
    df_typo = df[df["typologie"] == typologie].copy()
    if df_typo.empty:
        return {"error": "Aucun bien trouvé avec cette typologie"}

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
    ]

    return voisins[cols].to_dict(orient="records")
