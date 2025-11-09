"use client";
import { useState, useEffect } from "react";

export default function Prediction() {
  const [adresse, setAdresse] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [typologie, setTypologie] = useState("maison");
  const [surface, setSurface] = useState("");
  const [nbPieces, setNbPieces] = useState("");
  const [resultat, setResultat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Autocomplétion adresse ---
  useEffect(() => {
    if (adresse.length < 3) {
      setSuggestions([]);
      return;
    }
    const timeoutId = setTimeout(() => {
      fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(adresse)}&limit=5`)
        .then((res) => res.json())
        .then((data) => setSuggestions(data.features || []))
        .catch(() => setSuggestions([]));
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [adresse]);

  function choisirSuggestion(sugg) {
    setAdresse(sugg.properties.label);
    setSuggestions([]);
  }

  // --- Appel API ---
  async function chercherPrediction() {
    if (!adresse || !surface || !nbPieces) return;
    setLoading(true);
    setError(null);
    setResultat(null);
    try {
      const res = await fetch(
        `http://127.0.0.1:8001/prediction?adresse=${encodeURIComponent(adresse)}&typologie=${typologie}&surface=${surface}&nb_pieces=${nbPieces}`
      );
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResultat(data);
    } catch {
      setError("Erreur réseau");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto p-4 relative">
      <h2 className="text-2xl font-semibold mb-4">Estimation de prix immobilier</h2>

      {/* Adresse */}
      <div className="relative">
        <input
          type="text"
          placeholder="Adresse"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="off"
        />
        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 right-0 bg-white border border-t-0 border-gray-300 rounded-b-lg shadow z-10 max-h-52 overflow-y-auto">
            {suggestions.map((sugg) => (
              <li
                key={sugg.properties.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => choisirSuggestion(sugg)}
              >
                {sugg.properties.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Typologie */}
      <select
        value={typologie}
        onChange={(e) => setTypologie(e.target.value)}
        className="w-full mt-4 p-3 border border-gray-300 rounded-lg"
      >
        <option value="maison">Maison</option>
        <option value="t1_t2">T1/T2</option>
        <option value="t3_plus">T3 et plus</option>
      </select>

      {/* Surface et nb pièces */}
      <div className="flex gap-2 mt-4">
        <input
          type="number"
          placeholder="Surface (m²)"
          value={surface}
          onChange={(e) => setSurface(e.target.value)}
          className="w-1/2 p-3 border border-gray-300 rounded-lg"
          min="10"
        />
        <input
          type="number"
          placeholder="Nb pièces"
          value={nbPieces}
          onChange={(e) => setNbPieces(e.target.value)}
          className="w-1/2 p-3 border border-gray-300 rounded-lg"
          min="1"
        />
      </div>

      {/* Bouton */}
      <button
        onClick={chercherPrediction}
        disabled={loading || !adresse || !surface || !nbPieces}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg mt-4 hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Calcul en cours..." : "Estimer le prix"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {/* Résultat */}
      {resultat && !error && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Résultat de l'estimation</h3>
          <p className="text-gray-700">
            <strong>Adresse :</strong> {resultat.adresse}
          </p>
          <p className="text-gray-700">
            <strong>Typologie :</strong> {resultat.typologie}
          </p>
          <p className="text-gray-700">
            <strong>Surface :</strong> {resultat.surface} m²
          </p>
          <p className="text-gray-700">
            <strong>Nombre de pièces :</strong> {resultat.nb_pieces}
          </p>

          <div className="mt-3 p-3 bg-white rounded-lg border">
            <p className="text-xl font-bold text-blue-700">
              {Number(resultat.valeur_totale_estimee).toLocaleString("fr-FR")} €
            </p>
            <p className="text-sm text-gray-500">
              ≈ {resultat.prix_m2_estime.toLocaleString("fr-FR")} € / m²
            </p>
          </div>

          <div className="mt-3 text-sm text-gray-600">
            <p>R² : {resultat.r2}</p>
          </div>
        </div>
      )}
    </div>
  );
}
