// app/[lang]/profile/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"; // Import authOptions from lib
import { Locale } from "@/lib/dictionary";
import { redirect } from 'next/navigation'; // Import redirect
import { supabaseAdmin } from '@/lib/supabaseAdmin'; // Import Supabase

// Dummy dictionary function - replace/extend your actual getDictionary
const getProfileDictionary = (lang: Locale) => ({
  title: lang === 'pcm' ? "Your Profile" : "Your Profile",
  nameLabel: lang === 'pcm' ? "Name:" : "Name:",
  emailLabel: lang === 'pcm' ? "Email:" : "Email:",
  memberSinceLabel: lang === 'pcm' ? "Member Since:" : "Member Since:", // Added
  notLoggedIn: lang === 'pcm' ? "You need to login to see this page." : "You need to be logged in to view this page.",
});

export default async function ProfilePage({ params: { lang } }: { params: { lang: Locale } }) {
  // Fetch session server-side
  // Note: Middleware should handle the redirect, but this is a safeguard
  // and allows us to access session data directly on the server.
  const session = await getServerSession(authOptions); // Pass authOptions
  const dict = getProfileDictionary(lang);

  // Safeguard redirect if middleware somehow fails or for direct access attempts
  if (!session || !session.user) {
    // This redirect might be redundant due to middleware, but good practice
    const loginUrl = new URL(`/${lang}/login`, 'http://localhost:3002'); // Base URL needed for server-side redirect
    loginUrl.searchParams.set('callbackUrl', `/${lang}/profile`);
    redirect(loginUrl.toString());
  }

  // --- Fetch full user data from Supabase ---
  let userData: { name: string | null; email: string | null; created_at: string | null } | null = null;
  let fetchError: string | null = null;

  // Type assertion/check for user ID on session
  const userId = (session.user as any)?.id;

  if (userId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users') // Your table name
        .select('name, email, created_at')
        .eq('id', userId)
        .single();

      if (error) throw error;
      userData = data;
    } catch (error: any) {
      console.error("Error fetching user profile data:", error);
      fetchError = "Failed to load profile data.";
    }
  } else {
      // This case should ideally not happen if session exists, but handle it
      console.error("User ID not found in session on profile page.");
      fetchError = "User session invalid.";
      // Optionally redirect again, though middleware should have caught it
      // redirect(`/${lang}/login`);
  }
  // --- End Fetch ---


  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-120px)]">
      <h1 className="text-3xl font-bold mb-6">{dict.title}</h1>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
        {fetchError ? (
           <p className="text-red-600">{fetchError}</p>
        ) : userData ? (
          <>
            <div className="mb-4">
              <span className="font-semibold">{dict.nameLabel} </span>
              {/* Use data fetched from DB */}
              <span>{userData.name ?? session.user.name ?? 'N/A'}</span>
            </div>
            <div className="mb-4"> {/* Added margin bottom */}
              <span className="font-semibold">{dict.emailLabel} </span>
               {/* Use data fetched from DB */}
              <span>{userData.email ?? session.user.email ?? 'N/A'}</span>
            </div>
             {/* Display Member Since Date */}
            {userData.created_at && (
              <div>
                <span className="font-semibold">{dict.memberSinceLabel} </span>
                <span>{new Date(userData.created_at).toLocaleDateString()}</span> {/* Format date */}
              </div>
            )}
          </>
        ) : (
           <p>Loading profile...</p> // Should not happen if fetchError is also null
        )}
      </div>
    </div>
  );
}
