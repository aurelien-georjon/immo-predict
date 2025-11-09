"use client";
import dynamic from "next/dynamic";
import Link from "next/link";

const CarteRenta = dynamic(() => import("../components/CarteRenta"), {
  ssr: false,
});

export default function CartePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-gray-50 text-gray-900 py-10">
      <div className="w-full max-w-6xl px-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Carte interactive de rentabilité
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Explorez la rentabilité brute des communes françaises selon le département et la typologie de bien.
        </p>
        <CarteRenta />
        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
