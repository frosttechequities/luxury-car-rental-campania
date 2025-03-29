// app/[lang]/signup/page.tsx
"use client"; // Mark as Client Component

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react"; // Import signIn
import { Locale } from "@/lib/dictionary";
import { Button } from "@/components/ui/button";

// Basic dictionary structure for the signup page
interface SignupDictionary {
  title: string;
  nameLabel: string;
  emailLabel: string;
  passwordLabel: string;
  signupButton: string;
  loginPrompt: string;
  loginLink: string;
  signupSuccess: string;
  signupError: string;
  errorUserExists: string;
  errorMissingFields: string;
}

// Dummy dictionary function - replace with your actual getDictionary logic if needed
const getSignupDictionary = (lang: Locale): SignupDictionary => {
  if (lang === 'pcm') {
    return {
      title: "Create Account",
      nameLabel: "Full Name",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      signupButton: "Sign Up",
      loginPrompt: "Already get account?",
      loginLink: "Login here",
      signupSuccess: "Account created! Redirecting to login...",
      signupError: "Signup failed. Please try again.",
      errorUserExists: "User with this email already exists.",
      errorMissingFields: "Please fill in all fields.",
    };
  }
  // Default to English
  return {
    title: "Create Account",
    nameLabel: "Full Name",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    signupButton: "Sign Up",
    loginPrompt: "Already have an account?",
    loginLink: "Login here",
    signupSuccess: "Account created! Redirecting to login...",
    signupError: "Signup failed. Please try again.",
    errorUserExists: "User with this email already exists.",
    errorMissingFields: "Please fill in all fields.",
  };
};


export default function SignupPage({ params: { lang } }: { params: { lang: Locale } }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dict = getSignupDictionary(lang);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (!name || !email || !password) {
      setError(dict.errorMissingFields);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle specific errors from the API
        if (res.status === 409) {
          setError(dict.errorUserExists);
        } else if (res.status === 400) {
           setError(dict.errorMissingFields);
        } else {
          setError(data.message || dict.signupError);
        }
      } else {
        // Signup successful
        setSuccess(dict.signupSuccess);
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push(`/${lang}/login`);
        }, 2000); // 2-second delay
      }
    } catch (err) {
      console.error("Signup fetch error:", err);
      setError(dict.signupError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {dict.title}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
           {/* Updated input container */}
          <div className="space-y-4">
             <div>
               {/* Added visible label */}
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {dict.nameLabel}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                disabled={isLoading} // Already had disabled state
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-hl-blue focus:border-hl-blue sm:text-sm disabled:opacity-50"
                placeholder={dict.nameLabel}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
                disabled={isLoading} // Already had disabled state
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
                autoComplete="new-password"
                required
                disabled={isLoading} // Already had disabled state
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-hl-blue focus:border-hl-blue sm:text-sm disabled:opacity-50"
                placeholder={dict.passwordLabel}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Error and Success messages */}
          <div className="h-4"> {/* Reserve space for messages */}
            {error && (
              <p className="text-center text-sm text-red-600">
                {error}
              </p>
            )}
            {success && (
              <p className="text-center text-sm text-green-600">
                {success}
              </p>
            )}
          </div>


          <div>
            {/* Updated Button disabled style */}
            <Button type="submit" className="group relative w-full flex justify-center disabled:opacity-50" disabled={isLoading}>
              {isLoading ? 'Signing up...' : dict.signupButton}
            </Button>
          </div>
        </form> {/* Correct placement of closing form tag */}

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or sign up with</span>
          </div>
        </div>

        {/* Google Sign-in Button */}
        <div>
          <Button
            variant="outline"
            className="w-full flex justify-center items-center gap-2"
            onClick={() => signIn('google', { callbackUrl: `/${lang}` })} // Trigger Google sign-in
            disabled={isLoading} // Disable if credentials signup is loading
          >
             {/* Basic Google Icon Placeholder */}
            <svg className="h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 256S109.8 0 244 0c73 0 135.3 29.7 181.4 78.1L375 152.9C341.5 123.5 298.8 104 244 104c-82.3 0-149.3 66.9-149.3 149.3s67 149.3 149.3 149.3c93.1 0 134.3-71.3 138.1-108.3H244v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
            Sign up with Google
          </Button>
        </div>

        {/* Login link - adjusted margin */}
        <div className="text-sm text-center pt-6"> {/* Increased top padding */}
             <span className="text-gray-600">{dict.loginPrompt} </span>
             <Link href={`/${lang}/login`} className="font-medium text-hl-blue hover:text-hl-dark-blue">
               {dict.loginLink}
             </Link>
           </div>
        {/* Removed extra closing form tag */}
      </div>
    </div>
  );
}