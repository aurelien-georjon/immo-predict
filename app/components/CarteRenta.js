"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const CarteRenta = () => {
  const [geoData, setGeoData] = useState(null);
  const [departement, setDepartement] = useState("");
  const [typologie, setTypologie] = useState("");
  const [filteredFeatures, setFilteredFeatures] = useState([]);
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
      <div className="text-base md:text-lg text-gray-700 bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
        <button
          className="font-semibold text-blue-700 underline hover:text-blue-800 focus:outline-none text-lg"
          onClick={() => setShowRenta((v) => !v)}
        >
          Comment la rentabilité est-elle calculée ?
        </button>

        {showRenta && (
          <div className="mt-3 leading-relaxed">
            Pour chaque bien disposant de données de vente, un loyer moyen est estimé à partir des informations de la commune et du type de logement.
            Trois catégories sont distinguées : les <strong>maisons</strong>, les <strong>appartements T1/T2</strong> (1 à 2 pièces) et les <strong>appartements T3 et plus</strong> (3 pièces ou davantage).<br />
            <br />
            La rentabilité brute est ensuite calculée avec la formule suivante :
            <p className="text-center mt-3 text-700 font-medium">
              <strong>Rentabilité brute</strong> = (Loyer annuel estimé / Prix d'achat) × 100
            </p>
          </div>
        )}

        <hr className="my-5 border-gray-300" />

        <button
          className="font-semibold text-blue-700 underline hover:text-blue-800 focus:outline-none text-lg"
          onClick={() => setShowConfiance((v) => !v)}
        >
          Comment l'indice de confiance est-il calculé ?
        </button>

        {showConfiance && (
          <div className="mt-3 leading-relaxed">
            L’indice de confiance évalue la fiabilité de l’estimation selon la qualité des données de loyers disponibles
            et le volume de ventes observées dans la commune. Un indice plus élevé indique une estimation plus représentative du marché local.
          </div>
        )}
      </div>

      {/* Sélecteurs */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <select
          value={departement}
          onChange={(e) => setDepartement(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
        >
          <option value="">-- Département --</option>
          {geoData &&
            Array.from(
              new Set(geoData.features.map((f) => f.properties.code_departement))
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
          className="border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
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
