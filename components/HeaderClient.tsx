'use client'; // Mark this as a Client Component

    import { useState, useEffect } from 'react';
    import Link from 'next/link';
    import { usePathname } from 'next/navigation'; // Import usePathname
    import { useSession, signOut } from 'next-auth/react'; // Import auth hooks
    import { DictionaryType, Locale } from '@/lib/dictionary'; // Import Locale type
    import { Button } from '@/components/ui/button'; // Import shadcn Button
    
    // Updated props interface
interface HeaderClientProps {
  dict: DictionaryType;
  lang: Locale;
  isMobileMenuOpen: boolean; // State passed from parent
  toggleMenu: () => void; // Function passed from parent
  redirectedPathName: string; // Path info passed from parent
  otherLang: string; // Lang info passed from parent
}

// Accept new props
export default function HeaderClient({
  dict,
  lang,
  isMobileMenuOpen,
  toggleMenu,
  redirectedPathName,
  otherLang
}: HeaderClientProps) {
      const { data: session, status } = useSession(); // Get session status

      // Log session status for debugging
      console.log("HeaderClient Status:", status, "Session User:", session?.user?.name);

      // Removed state and effect logic (moved to Header.tsx)
      // Removed pathname logic (moved to Header.tsx)

      // Only render the mobile menu overlay
      return (
        <>
          {/* Language Switcher and Mobile Toggle Button are now rendered in Header.tsx */}

          {/* Mobile Menu Overlay */}
          {/* Use passed state and function */}
          {isMobileMenuOpen && (
            <div className={`mobile-menu fixed inset-0 bg-white z-[100] p-6 overflow-y-auto transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
               <div className="flex justify-between items-center mb-8">
                 <span className="text-xl font-bold text-[--hl-blue]">Menu</span> {/* Or Logo */}
                 <button
                    className="close-menu text-3xl text-[--hl-dark-blue]"
                    onClick={toggleMenu}
                    aria-label="Close menu"
                 >
                    ✕
                 </button>
               </div>
               <ul className="text-center space-y-4">
                 {/* Use dictionary for links */}
                 <li><Link href={`/${lang}`} className="text-lg font-semibold text-[--hl-dark-blue] block py-2" onClick={toggleMenu}>{dict.header.home}</Link></li>
                 <li><Link href={`/${lang}/#services`} className="text-lg font-semibold text-[--hl-dark-blue] block py-2" onClick={toggleMenu}>{dict.header.services}</Link></li>
                 <li><Link href={`/${lang}/contact`} className="text-lg font-semibold text-[--hl-dark-blue] block py-2" onClick={toggleMenu}>{dict.header.contact}</Link></li>
                 {/* Add Language Switcher to Mobile Menu */}
                 <li className="pt-2">
                    <Link href={redirectedPathName} locale={otherLang} className="text-base font-semibold text-gray-600 block py-2" onClick={toggleMenu}>
                      Switch to {otherLang === 'en' ? 'English' : 'Pidgin'}
                    </Link>
                 </li>
                 {/* Conditional Login/Logout */}
                 <li className="pt-4">
                   {status === 'loading' && (
                     <span className="text-gray-500">Loading...</span>
                   )}
                    {/* Simplified condition */}
                   {status === 'authenticated' && (
                     <div className="flex flex-col items-center space-y-4"> {/* Increased space */}
                        <span className="text-lg font-semibold text-gray-700">Hi, {session?.user?.name || 'User'}</span> {/* Keep optional chaining here */}
                        {/* Profile Link */}
                        <Link href={`/${lang}/profile`} className="text-lg font-semibold text-gray-600 hover:text-hl-blue transition-colors block py-1" onClick={toggleMenu}>Profile</Link>
                        {/* Logout Button */}
                        <Button onClick={() => signOut({ callbackUrl: `/${lang}` })} variant="outline" className="w-full">Logout</Button>
                     </div>
                   )}
                   {status === 'unauthenticated' && (
                     <div className="flex flex-col items-center space-y-2">
                       <Link href={`/${lang}/login`} passHref legacyBehavior>
                         {/* Use asChild on Button */}
                         <Button asChild className="w-full" onClick={toggleMenu}><a>{dict.header.login}</a></Button>
                       </Link>
                       <Link href={`/${lang}/signup`} passHref legacyBehavior>
                          {/* Use asChild on Button */}
                         <Button asChild variant="outline" className="w-full" onClick={toggleMenu}><a>{dict.header.signup || 'Sign Up'}</a></Button>
                       </Link>
                     </div>
                   )}
                 </li>
               </ul>
            </div>
          )}
        </>
      );
    }
