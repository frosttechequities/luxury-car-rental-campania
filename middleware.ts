// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withAuth } from "next-auth/middleware"; // Import withAuth

const locales = ['en', 'pcm'];
const defaultLocale = 'en';

function localeMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Handle explicit redirect for old/incorrect locale code (en-GB -> en)
  if (pathname.startsWith('/en-GB')) {
    const newPathname = pathname.replace('/en-GB', '/en');
    const url = request.nextUrl.clone();
    url.pathname = newPathname;
    console.log(`Redirecting from ${pathname} to ${url.pathname}`);
    return NextResponse.redirect(url);
  }

  // 2. Check if there is any *supported* locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // 3. Redirect root or paths missing locale prefix (excluding assets, api, auth)
  if (pathnameIsMissingLocale &&
      !pathname.startsWith('/_next') &&
      !pathname.startsWith('/api') && // Keep skipping API routes
      !pathname.includes('.')
     ) {
    const url = request.nextUrl.clone();
    const newPathname = pathname === '/' ? '' : pathname;
    url.pathname = `/${defaultLocale}${newPathname}`;
    console.log(`Redirecting from ${pathname} to ${url.pathname}`);
    return NextResponse.redirect(url);
  }

  // If locale handling didn't redirect, let the request proceed (or be handled by withAuth)
  return undefined; // Return undefined to allow withAuth to potentially take over
}

// Wrap the localeMiddleware with withAuth
export default withAuth(
  // Note that this function IS invoked BEFORE the authorization check by default
  function middleware(request) {
    // Run the locale handling logic first (redirects if locale missing)
    const localeResponse = localeMiddleware(request);
    if (localeResponse) {
      return localeResponse;
    }

    // Intercept default NextAuth sign-in redirect
    const { pathname, searchParams } = request.nextUrl;
    if (pathname === '/api/auth/signin') {
        // Extract locale from where the user was trying to go (callbackUrl) or use default
        const callbackUrl = searchParams.get('callbackUrl') || `/${defaultLocale}`;
        const urlLocaleMatch = callbackUrl.match(/^\/([a-z]{2})\/?/);
        const locale = urlLocaleMatch && locales.includes(urlLocaleMatch[1]) ? urlLocaleMatch[1] : defaultLocale;

        // Construct the correct custom login page URL
        const loginUrl = new URL(`/${locale}/login`, request.url);
        // Preserve the original callbackUrl
        loginUrl.searchParams.set('callbackUrl', callbackUrl);

        console.log(`Intercepting /api/auth/signin, redirecting to: ${loginUrl.toString()}`);
        return NextResponse.redirect(loginUrl);
    }

    // If not a locale redirect and not the signin intercept, proceed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname;
        // Check if the path requires authentication
        const requiresAuth = pathname.includes('/dashboard') || pathname.includes('/profile'); // Add other protected paths here

        if (requiresAuth) {
          // If path requires auth, user needs a token
          return !!token;
        }
        // If path doesn't require auth, always allow access
        return true;
      }
    },
    // Remove pages config, rely on intercepting the default redirect
  }
);

// Update the config to include the paths you want to protect
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (your public images folder)
     * - login page itself (to avoid redirect loop)
     * - signup page itself
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|login|signup).*)',
    // Apply middleware to the root path '/' explicitly
    '/',
  ],
};
