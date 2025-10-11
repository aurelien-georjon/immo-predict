"use client";
import Link from "next/link";

export default function ComparateurPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">🔍 Comparateur de biens</h1>
      <p className="text-gray-600 max-w-md text-center mb-8">
        Cette page permettra de rechercher des biens similaires à une adresse donnée
        pour visualiser les prix du marché local.
      </p>
      <Link href="/" className="text-blue-600 hover:underline">← Retour à l'accueil</Link>
    </main>
  );
}
