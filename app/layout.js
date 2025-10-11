import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Immo Predict",
  description: "Carte de rentabilité & prédiction immobilière",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="min-h-screen m-0 p-0 overflow-x-hidden bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
        {/* Header commun */}
        <header className="w-screen shadow bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between px-8 py-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Immo Predict
            </Link>
            <nav className="flex items-center gap-6 text-gray-700">
              <Link className="hover:text-blue-600" href="/carte">Carte</Link>
              <Link className="hover:text-blue-600" href="/comparateur">Comparateur</Link>
              <Link className="hover:text-blue-600" href="/prediction">Prédiction</Link>
              <a
                className="hover:text-blue-600"
                href="https://github.com/aurelien-georjon"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </nav>
          </div>
        </header>

        {/* Contenu des pages */}
        <div className="flex-1 w-screen">{children}</div>

        {/* Footer commun */}
        <footer className="w-screen bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Aurélien Georjon — Projet Data Science & Web
        </footer>
      </body>
    </html>
  );
}
