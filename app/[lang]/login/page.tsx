// app/[lang]/login/page.tsx
"use client"; // Mark as Client Component

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; // Use next/navigation for App Router
import Link from "next/link"; // Import Link
import { Locale } from "@/lib/dictionary"; // Assuming Locale is defined here
import { Button } from "@/components/ui/button"; // Assuming you have a Button component

// Basic dictionary structure for the login page
interface LoginDictionary {
  title: string;
  emailLabel: string;
  passwordLabel: string;
  loginButton: string;
  loginError: string;
  signupPrompt: string;
  signupLink: string;
  forgotPasswordLink?: string; // Added optional
}

// Dummy dictionary function - replace with your actual getDictionary logic if needed
const getLoginDictionary = (lang: Locale): LoginDictionary => {
  if (lang === 'pcm') {
    return {
      title: "Login",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      loginButton: "Login",
      loginError: "Login failed. Check your details.",
      signupPrompt: "No get account?",
      signupLink: "Sign up here",
      forgotPasswordLink: "Forget password?", // Added
    };
  }
  // Default to English
  return {
    title: "Login",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    loginButton: "Login",
    loginError: "Login failed. Check your details.",
    signupPrompt: "Don't have an account?",
    signupLink: "Sign up here",
    forgotPasswordLink: "Forgot password?", // Added
};
};


export default function LoginPage({ params: { lang } }: { params: { lang: Locale } }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const router = useRouter();
  const dict = getLoginDictionary(lang); // Get dictionary text

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true); // Set loading true

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        // callbackUrl: `/${lang}` // Optional: Where to redirect after successful login
      });

      if (result?.error) {
        console.error("Login Error:", result.error);
        setError(dict.loginError); // Show generic error from dictionary
      } else if (result?.ok) {
        // Login successful
        console.log("Login successful, redirecting...");
        router.push(`/${lang}`); // Redirect to homepage or dashboard
        router.refresh(); // Refresh server components
      } else {
         // Handle unexpected cases where result is ok but no error (shouldn't usually happen with credentials)
         console.warn("Login status unclear:", result);
         setError("An unexpected error occurred during login.");
      }
    } catch (err) {
      console.error("Sign in function error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false); // Set loading false in finally block
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50"> {/* Adjust min-height if header/footer height differs */}
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {dict.title}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Removed hidden input */}
          {/* Updated input container */}
          <div className="space-y-4">
            <div>
              {/* Added visible label */}
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                {dict.emailLabel}
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isLoading} // Disable when loading
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-hl-blue focus:border-hl-blue sm:text-sm disabled:opacity-50"
                placeholder={dict.emailLabel}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
               {/* Added visible label */}
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {dict.passwordLabel}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={isLoading} // Disable when loading
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-hl-blue focus:border-hl-blue sm:text-sm disabled:opacity-50"
                placeholder={dict.passwordLabel}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

           {/* Forgot Password Link */}
           <div className="flex items-center justify-end">
             <div className="text-sm">
               <Link href="#" className="font-medium text-hl-blue hover:text-hl-dark-blue">
                 {dict.forgotPasswordLink || 'Forgot password?'}
               </Link>
             </div>
           </div>

          {error && (
            <p className="mt-2 text-center text-sm text-red-600">
              {error}
            </p>
          )}

          <div>
            {/* Updated Button text and disabled state */}
            <Button type="submit" className="group relative w-full flex justify-center disabled:opacity-50" disabled={isLoading}>
              {isLoading ? 'Logging in...' : dict.loginButton}
            </Button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Google Sign-in Button */}
        <div>
          <Button
            variant="outline"
            className="w-full flex justify-center items-center gap-2"
            onClick={() => signIn('google', { callbackUrl: `/${lang}` })} // Trigger Google sign-in
            disabled={isLoading} // Optionally disable if credential login is loading
          >
             {/* Basic Google Icon Placeholder - consider using react-icons or an SVG */}
            <svg className="h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 256S109.8 0 244 0c73 0 135.3 29.7 181.4 78.1L375 152.9C341.5 123.5 298.8 104 244 104c-82.3 0-149.3 66.9-149.3 149.3s67 149.3 149.3 149.3c93.1 0 134.3-71.3 138.1-108.3H244v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
            Sign in with Google
          </Button>
        </div>

        {/* Sign up link - adjusted margin */}
        <div className="text-sm text-center pt-6"> {/* Increased top padding */}
          <span className="text-gray-600">{dict.signupPrompt} </span>
          <Link href={`/${lang}/signup`} className="font-medium text-hl-blue hover:text-hl-dark-blue">
            {dict.signupLink}
          </Link>
        </div>
      </div>
    </div>
  );
}