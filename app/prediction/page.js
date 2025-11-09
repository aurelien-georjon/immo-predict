"use client";
import dynamic from "next/dynamic";
import Link from "next/link";

const Prediction = dynamic(() => import("../components/Prediction"), {
  ssr: false,
});


export default function PredictionPage() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 text-gray-800 p-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-2 text-center text-blue-700"> Prédiction immobilière</h1>
        <p className="text-gray-600 text-center mb-6">
          Renseignez les caractéristiques d'un bien pour obtenir une estimation de son prix.
        </p>
        <Prediction />
        <div className="text-center mt-6">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
