"use client";
import dynamic from "next/dynamic";

const CarteRenta = dynamic(() => import("../components/CarteRenta"), {
  ssr: false,
});

export default function CartePage() {
  return (
    <main className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <section className="flex-1 w-full p-6">
        <div className="max-w-6xl mx-auto">
          <CarteRenta />
        </div>
      </section>
    </main>
  );
}
