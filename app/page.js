"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] text-center px-6">
      <div className="max-w-2xl">
        <h2 className="text-5xl font-extrabold text-blue-700 mb-6">
          Bienvenue sur <span className="text-blue-600">Immo Predict 🏡</span>
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-10">
          Application d’analyse et de prédiction immobilière.<br />
          Explorez la rentabilité des communes françaises, comparez les biens similaires,
          et estimez la valeur de votre futur investissement en toute simplicité.
        </p>
        <Link
          href="/carte"
          className="bg-blue-600 text-white text-lg px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
        >
          Voir la carte de rentabilité
        </Link>
      </div>
    </main>
  );
}
