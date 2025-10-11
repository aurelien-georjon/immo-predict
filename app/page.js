"use client"
import dynamic from "next/dynamic";
import { Github } from "lucide-react"; // icône GitHub sympa

// Charge ta carte uniquement côté client
const CarteRenta = dynamic(() => import("./components/CarteRenta"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
      {/* ====== HEADER ====== */}
      <header className="w-full shadow-md bg-white/70 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-blue-600 tracking-tight">
            Immo Predict
          </h1>
          <nav className="flex items-center gap-4 text-gray-700">
            <a
              href="https://github.com/aurelien-georjon"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-blue-600 transition-colors"
            >
              <Github size={20} />
              <span>GitHub</span>
            </a>
          </nav>
        </div>
      </header>

      {/* ====== HERO SECTION ====== */}
      <section className="text-center py-12 px-6 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 w-full">
        <h2 className="text-3xl font-semibold text-gray-800">
          Analyse de la rentabilité immobilière par commune
        </h2>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Visualisez les rentabilités brutes estimées à partir des données DVF
          et ANIL. Explorez les communes françaises selon le type de bien et
          découvrez où investir intelligemment 💡
        </p>
      </section>

      {/* ====== CONTENU (CARTE) ====== */}
      <section className="flex-1 mx-auto w-full p-6">
        <div className="max-w-6xl mx-auto">
          <CarteRenta />
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="mt-10 bg-white border-t border-gray-200 py-6 w-full">
        <div className="mx-auto text-center text-sm text-gray-500">
          © {new Date().getFullYear()}{" "}
          <a
            href="https://github.com/aurelien-georjon"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline"
          >
            Aurélien Georjon
          </a>{" "}
          — Projet personnel Data Science & Web
        </div>
      </footer>
    </main>
  );
}