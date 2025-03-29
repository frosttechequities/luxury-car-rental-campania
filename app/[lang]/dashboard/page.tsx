// app/[lang]/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
// Assuming your NextAuth config is in app/api/auth/[...nextauth]/route.ts
// You might need to export the authOptions if you haven't already
// For now, we'll fetch session directly, but middleware will handle protection
import { Locale } from "@/lib/dictionary";

// Dummy dictionary function
const getDashboardDictionary = (lang: Locale) => ({
  title: lang === 'pcm' ? "Your Dashboard" : "Your Dashboard",
  welcome: lang === 'pcm' ? "Welcome" : "Welcome",
  content: lang === 'pcm' ? "Dis na your protected dashboard area." : "This is your protected dashboard area.",
});

export default async function DashboardPage({ params: { lang } }: { params: { lang: Locale } }) {
  // Fetch session server-side (though middleware will protect the route)
  const session = await getServerSession(); // Pass authOptions if needed
  const dict = getDashboardDictionary(lang);

  // Note: Middleware should redirect before this page even renders if not authenticated
  // But we can still use session data here if needed
  const userName = session?.user?.name || "User";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{dict.title}</h1>
      <p className="text-lg">{dict.welcome}, {userName}!</p>
      <p>{dict.content}</p>
      {/* Add dashboard content here */}
    </div>
  );
}