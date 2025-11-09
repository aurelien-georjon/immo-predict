from fastapi import Query, APIRouter
import pandas as pd
from sklearn.neighbors import NearestNeighbors
from sklearn.linear_model import LinearRegression
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

@router.get("/prediction")
def get_prediction(
    adresse: str = Query(...),
    typologie: str = Query(...),
    surface: float = Query(...),
    nb_pieces: int = Query(...)
):
    coords = geocode_adresse(adresse)
    if coords is None:
        return {"error": "Adresse non trouvée"}

    lon, lat = coords
    df_typo = df[df["typologie"] == typologie].copy()
    if df_typo.empty:
        return {"error": "Aucun bien trouvé avec cette typologie"}

    geo_nn = NearestNeighbors(n_neighbors=min(500, len(df_typo)))
    geo_nn.fit(df_typo[["longitude", "latitude"]])
    distances, indices = geo_nn.kneighbors([[lon, lat]])
    voisins = df_typo.iloc[indices[0]].copy()
    voisins["prix_m2"] = voisins["valeur_fonciere"] / voisins["surface_reelle_bati"]

    X = voisins[["longitude", "latitude", "surface_reelle_bati", "nombre_pieces_principales"]]
    y = voisins["prix_m2"]

    model = LinearRegression()
    model.fit(X, y)
    prix_m2_pred = model.predict([[lon, lat, surface, nb_pieces]])[0]
    valeur_predite = prix_m2_pred * surface
    r2 = model.score(X, y)

    return {
        "adresse": adresse,
        "typologie": typologie,
        "surface": surface,
        "nb_pieces": nb_pieces,
        "prix_m2_estime": round(prix_m2_pred, 2),
        "valeur_totale_estimee": round(valeur_predite, 0),
        "r2": round(r2, 4),
        "nombre_voisins": len(voisins),
    }
