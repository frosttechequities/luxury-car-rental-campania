// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"; // Import GoogleProvider
import bcrypt from 'bcryptjs'; // Import bcryptjs
import { supabaseAdmin } from '@/lib/supabaseAdmin'; // Import Supabase admin client
import { AuthOptions } from 'next-auth'; // Import AuthOptions type

// Define AuthOptions separately
export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!, // Assert non-null with !
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // Assert non-null with !
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        // IMPORTANT: This is a placeholder. Replace with your actual user validation logic.
        // Example: Check credentials against a database
        console.log("Attempting authorization with:", credentials);

        if (!credentials?.email || !credentials?.password) {
           console.log("Missing email or password");
           return null;
        }

        // --- Supabase Logic ---
        // Fetch user from Supabase
        const { data: user, error: fetchError } = await supabaseAdmin
           .from('users') // Your table name
           .select('id, name, email, hashed_password') // Select necessary fields including the hash
           .eq('email', credentials.email)
           .single(); // Use single() as email should be unique

        if (fetchError && fetchError.code !== 'PGRST116') { // Handle potential errors, ignore 'No rows found'
            console.error("Supabase fetch user error:", fetchError);
            // Optionally throw an error or return null based on desired behavior for DB errors
            return null;
        }

        if (!user) {
            console.log("User not found for email:", credentials.email);
            return null; // User not found
        }

        // Compare passwords
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.hashed_password // Use the correct column name from your DB
        );

        if (isPasswordCorrect) {
          console.log("Authorization successful for:", user.email);
          // Return user object without the password hash
          // Ensure the returned object structure matches what NextAuth expects/needs
          return {
              id: user.id,
              name: user.name,
              email: user.email,
              // Add any other user properties you want in the session/JWT
          };
        }
        // --- End Supabase Logic ---

        // If user not found or password doesn't match
        console.log("Authorization failed for:", credentials?.email);
        return null;
      }
    })
  ],
  // Add other configurations like session strategy, pages, callbacks etc. here if needed
  // pages: {
  //   signIn: '/auth/signin', // Optional: Custom sign-in page
  // }
  secret: process.env.AUTH_SECRET, // Ensure AUTH_SECRET is read

  // Callbacks to control JWT and session content
  callbacks: {
    async jwt({ token, user }) {
      // Add user id to the JWT token right after sign in
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user id to the session object from the JWT token
      if (session.user && token.id) {
        // Ensure session.user exists before assigning
        (session.user as any).id = token.id; // Cast to any or define extended Session type
      }
      return session;
    },
  },
}; // Changed closing parenthesis and added semicolon

// Create the handler using the options
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }