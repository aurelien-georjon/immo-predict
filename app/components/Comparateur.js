"use client";
import { useState, useEffect } from "react";

export default function Comparateur() {
  const [adresse, setAdresse] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [typologie, setTypologie] = useState("maison");
  const [resultats, setResultats] = useState(null);
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

  // --- Lancer la recherche ---
  async function chercherComparateur() {
    if (!adresse) return;
    setLoading(true);
    setError(null);
    setResultats(null);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/comparateur?adresse=${encodeURIComponent(adresse)}&typologie=${typologie}`
      );
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResultats(data);
      }
    } catch {
      setError("Erreur réseau");
    }
    setLoading(false);
  }

  function choisirSuggestion(sugg) {
    setAdresse(sugg.properties.label);
    setSuggestions([]);
  }

  return (
    <div className="max-w-xl mx-auto p-4 relative">
      <h2 className="text-2xl font-semibold mb-4">Comparer les 10 logements les plus proches</h2>

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

      <select
        value={typologie}
        onChange={(e) => setTypologie(e.target.value)}
        className="w-full mt-4 mb-4 p-3 border border-gray-300 rounded-lg"
      >
        <option value="maison">Maison</option>
        <option value="t1_t2">T1/T2</option>
        <option value="t3_plus">T3 et plus</option>
      </select>

      <button
        onClick={chercherComparateur}
        disabled={loading || !adresse}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Recherche..." : "Chercher"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {resultats && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Résultats :</h3>
          <ul className="space-y-1">
            {resultats.map((r, i) => (
              <li key={i} className="text-sm text-gray-800">
                {r.nom_commune} — {r.typologie} — {r.surface_reelle_bati} m² — {r.valeur_fonciere} €
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
