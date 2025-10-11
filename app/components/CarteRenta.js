"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const CarteRenta = () => {
  const [geoData, setGeoData] = useState(null);
  const [departement, setDepartement] = useState("");
  const [typologie, setTypologie] = useState("");
  const [filteredFeatures, setFilteredFeatures] = useState([]);
  const [showCalculation, setShowCalculation] = useState(false);
  const [showRenta, setShowRenta] = useState(false);
  const [showConfiance, setShowConfiance] = useState(false);

  useEffect(() => {
    fetch("/data/rentabilites_communes_geo.geojson")
      .then((res) => res.json())
      .then((geo) => setGeoData(geo))
      .catch((err) => console.error("Erreur chargement geojson:", err));
  }, []);

  useEffect(() => {
    if (!geoData || !departement || !typologie) {
      setFilteredFeatures([]);
      return;
    }

    const filtered = geoData.features.filter(
      (f) =>
        f.properties.code_departement === departement &&
        f.properties.typologie === typologie
    );
    setFilteredFeatures(filtered);
  }, [geoData, departement, typologie]);

  const getColor = (r) => {
    if (r == null) return "#cccccc";
    if (r < 3) return "#ffeda0";
    if (r < 5) return "#feb24c";
    if (r < 7) return "#fd8d3c";
    return "#e31a1c";
  };

  const styleFeature = (feature) => ({
    fillColor: getColor(feature.properties.rentabilite_brute_mean),
    weight: 1,
    color: "white",
    fillOpacity: 0.7,
  });

  const center = filteredFeatures.length
    ? [
        filteredFeatures[0].properties.latitude,
        filteredFeatures[0].properties.longitude,
      ]
    : [46.6, 1.9];

  const CenterUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      if (center) map.setView(center);
    }, [center]);
    return null;
  };

  const getConfidenceRating = (note) => {
    if (note == null) return "★☆☆☆☆";
    return "★★★★★☆☆☆☆".slice(5 - note, 10 - note);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 text-center">
      Rentabilité par commune (carte interactive)
      </h1>

      <div className="text-md text-gray-500 mb-4">
        <button
          className="font-semibold underline hover:text-blue-600 focus:outline-none"
          onClick={() => setShowRenta((v) => !v)}
        >
          Comment la rentabilité est-elle calculée ?
        </button>
        {showRenta && (
          <div className="mt-2">
            Pour chaque bien pour lequel nous disposons de données de vente, nous estimons un loyer moyen en fonction de sa commune et de sa typologie. Nous distinguons trois types de biens : les maisons, les appartements de type T1/T2 (1 à 2 pièces), et les appartements T3 et plus (3 pièces et plus).<br />
            La rentabilité brute est ensuite calculée selon la formule suivante : <br />
            <p className="text-center">
              <strong>Rentabilité brute</strong> = (Loyer annuel estimé / Prix d'achat) × 100
            </p>
          </div>
        )}
        <br />
        <button
          className="font-semibold underline hover:text-blue-600 focus:outline-none mt-2"
          onClick={() => setShowConfiance((v) => !v)}
        >
          Comment l'indice de confiance est-il calculé ?
        </button>
        {showConfiance && (
          <div className="mt-2">
            L'indice de confiance est basé sur la qualité des données de loyers estimés que nous récupérons, ainsi que sur le volume de ventes enregistrées dans chaque commune.
          </div>
        )}
      </div>

      <div className="flex items-center justify-center mb-4">
        <span className="text-lg font-semibold text-gray-700">
          Fonctionnement de la carte :
          <span className="font-normal text-gray-600"> Choisissez un département et une typologie de bien pour afficher les données sur la carte.</span>
        </span>
      </div>

      <div className="flex gap-4 mb-4 justify-center">
        <select
          value={departement}
          onChange={(e) => setDepartement(e.target.value)}
          className="border p-2"
        >
          <option value="">-- Département --</option>
          {geoData &&
            Array.from(
              new Set(
                geoData.features.map((f) => f.properties.code_departement)
              )
            )
              .sort()
              .map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
        </select>

        <select
          value={typologie}
          onChange={(e) => setTypologie(e.target.value)}
          className="border p-2"
        >
          <option value="">-- Typologie --</option>
          <option value="t1_t2">T1/T2</option>
          <option value="t3_plus">T3+</option>
          <option value="maison">Maison</option>
        </select>

      </div>

      {departement && typologie && filteredFeatures.length === 0 && (
        <p>Aucune donnée disponible.</p>
      )}

      <div className="h-[600px] w-full">
        <MapContainer
          center={center}
          zoom={departement && typologie ? 9 : 6}
          style={{ height: "100%", width: "100%" }}
          key={`${departement}-${typologie}`}
        >
          <CenterUpdater center={center} />

          <TileLayer
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap"
          />

          {filteredFeatures.length > 0 && (
            <GeoJSON
              data={{ type: "FeatureCollection", features: filteredFeatures }}
              style={styleFeature}
              onEachFeature={(feature, layer) => {
                const r =
                  feature.properties.rentabilite_brute_mean?.toFixed(2) ||
                  "N/A";
                const confiance =
                  getConfidenceRating(feature.properties.indice_confiance);
                layer.bindTooltip(
                  `${feature.properties.nom_commune} — ${r}%\nConfiance : ${confiance}`,
                  { sticky: true }
                );
              }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default CarteRenta;
