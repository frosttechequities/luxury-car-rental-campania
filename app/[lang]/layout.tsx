import type { Metadata } from "next";
// Import desired fonts from next/font/google
import { Inter, Playfair_Display } from "next/font/google";
import "../globals.css";
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import { Locale, getDictionary } from "@/lib/dictionary";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider"; // Import the AuthProvider

// Configure fonts
const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter', // Assign CSS variable for body font
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair', // Assign CSS variable for heading font
  weight: ['400', '700'], // Include weights you might use
});

// Define supported languages using the imported type
const locales: Locale[] = ['en', 'pcm'];

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "Dudu-Black Autos Nigeria",
  description: "Premium Rolls Royce chauffeur service in major Nigerian cities.",
};

export default async function RootLayout({
  children,
  params: { lang },
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Locale };
}>) {
  const dictionary = await getDictionary(lang);

  return (
    // Add font variables to html tag for global access
    <html lang={lang} className={`${inter.variable} ${playfair.variable}`}>
      {/* Apply body font variable via Tailwind config or global CSS */}
      <body className={`pt-[60px] font-body`}> {/* Use font-body utility */}
        <AuthProvider> {/* Wrap content with AuthProvider */}
          <Header dict={dictionary} lang={lang} />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer dict={dictionary} lang={lang} />
        </AuthProvider> {/* Close AuthProvider */}
      </body>
    </html>
  );
}
