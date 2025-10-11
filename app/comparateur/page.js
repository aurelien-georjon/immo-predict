"use client";
import dynamic from "next/dynamic";
import Link from "next/link";

// Import dynamique du composant (si besoin, pour éviter les erreurs SSR)
const Comparateur = dynamic(() => import("../components/Comparateur"), {
  ssr: false,
});

export default function ComparateurPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-gray-50 text-gray-800 py-10">
      <div className="w-full max-w-4xl px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">🔍 Comparateur de biens immobiliers</h1>
        <p className="text-gray-600 text-center mb-8">
          Entrez une adresse et choisissez une typologie pour trouver les 10 biens les plus proches,
          selon les données DVF.
        </p>

        {/* --- Le vrai composant --- */}
        <Comparateur />

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
