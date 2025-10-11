"use client";
import Link from "next/link";

export default function PredictionPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">💡 Prédiction immobilière</h1>
      <p className="text-gray-600 max-w-md text-center mb-8">
        Ici, tu pourras saisir les caractéristiques d’un bien (surface, typologie, localisation, etc.)
        et obtenir une estimation du prix grâce à ton modèle de machine learning.
      </p>
      <Link href="/" className="text-blue-600 hover:underline">← Retour à l'accueil</Link>
    </main>
  );
}
