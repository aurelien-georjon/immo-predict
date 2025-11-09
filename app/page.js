"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] text-center px-6">
      <div className="max-w-2xl">
        <h2 className="text-5xl font-extrabold text-blue-700 mb-6">
          Bienvenue sur Immo Predict
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-10">
          Application d’analyse et de prédiction immobilière.<br />
          Permet d'explorer la rentabilité des communes françaises, comparer des biens similaires,
          et estimer la valeur d'un bien immobilier.
        </p>

        <div className="flex flex-col gap-4 items-center">
          <Link
            href="/carte"
            className="bg-blue-600 text-white text-lg px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-md w-full max-w-sm"
          >
            Voir la carte de rentabilité
          </Link>

          <Link
            href="/comparateur"
            className="bg-blue-600 text-white text-lg px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-md w-full max-w-sm"
          >
            Comparer des biens similaires
          </Link>

          <Link
            href="/prediction"
            className="bg-blue-600 text-white text-lg px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-md w-full max-w-sm"
          >
            Estimer la valeur d’un bien
          </Link>
        </div>
      </div>
    </main>
  );
}
