import "./globals.css";

export const metadata = { title: "Immo Predict", description: "..." };

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </div>
      </body>
    </html>
  );
}
