import "./globals.css";

export const metadata = {
  title: "Immo Predict",
  description: "Cartes de rentabilité et prédiction de prix immobilier",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="min-h-screen antialiased text-gray-900 m-0 p-0 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
