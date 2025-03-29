'use client'; // Needs to be a client component because of useState/useEffect

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation'; // Import usePathname
import { useSession, signOut } from 'next-auth/react'; // Import auth hooks
import { DictionaryType, Locale } from '@/lib/dictionary'; // Import Locale type
import HeaderClient from './HeaderClient'; // Import the client component for the overlay
import { Button } from '@/components/ui/button'; // Import shadcn Button

// Define props for the Header, including the dictionary and current language
interface HeaderProps {
  dict: DictionaryType;
  lang: Locale; // Use imported Locale type
}

export default function Header({ dict, lang }: HeaderProps) {
  // Lifted state from HeaderClient
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname(); // Get current pathname
  const { data: session, status } = useSession(); // Get session status

  // Log session status for debugging
  console.log("Header Status:", status, "Session User:", session?.user?.name);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close menu if window resizes to desktop width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // Tailwind's md breakpoint
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine the alternate language and URL (needed for switcher)
  const otherLang = lang === 'en' ? 'pcm' : 'en';
  // Simple replacement, assumes lang is always at the start segment
  const redirectedPathName = pathname ? pathname.replace(`/${lang}`, `/${otherLang}`) : `/${otherLang}`;

  return (
    <>
      {/* Adjusted padding, added shadow, removed border */}
      <header className="fixed top-0 w-full bg-white py-4 px-6 shadow-md z-50 min-h-[70px] flex items-center"> {/* Changed px-8 to px-6 */}
        <nav className="flex justify-between items-center w-full max-w-screen-xl mx-auto">
          {/* Logo */}
          <Link href={`/${lang}`} className="logo flex-shrink-0"> {/* Added flex-shrink-0 */}
            {/* Slightly smaller logo */}
            <Image src="/images/luxury-car-7393276.webp" alt="Dudu-Black Autos Logo" width={120} height={30} priority className="h-8 w-auto" /> {/* Adjusted size and class h-9 to h-8 */}
          </Link>

          {/* Right side container for Nav, Actions, Lang Switcher, Mobile Toggle */}
          <div className="flex items-center gap-6"> {/* Use gap for spacing */}
            {/* Desktop Navigation */}
            <ul className="hidden md:flex gap-6 items-center"> {/* Adjusted gap */}
              <li><Link href={`/${lang}`} className="text-sm font-bold text-hl-dark-blue hover:text-hl-blue transition-colors">{dict.header.home}</Link></li>
              <li><Link href={`/${lang}/#services`} className="text-sm font-bold text-hl-dark-blue hover:text-hl-blue transition-colors">{dict.header.services}</Link></li>
              <li><Link href={`/${lang}/contact`} className="text-sm font-bold text-hl-dark-blue hover:text-hl-blue transition-colors">{dict.header.contact}</Link></li>
            </ul>

            {/* Desktop Actions (Login & Language) */}
            <div className="hidden md:flex items-center gap-4">
               {/* Language Switcher - Improved Styling */}
               <Link href={redirectedPathName} locale={otherLang} className="text-xs font-semibold border border-hl-gold px-3 py-1 rounded text-hl-gold hover:bg-hl-gold hover:text-white transition-colors duration-200">
                 {otherLang === 'en' ? 'English' : 'Pidgin'} {/* Reverted to Full Text */}
               </Link>
               {/* Conditional Login/Logout for Desktop */}
               {status === 'loading' && (
                 <span className="text-sm text-gray-500">...</span> // Simple loading indicator
               )}
               {/* Simplified condition */}
               {status === 'authenticated' && (
                 <div className="flex items-center gap-4"> {/* Increased gap slightly */}
                    <span className="text-sm font-medium text-gray-700 hidden lg:inline">Hi, {session?.user?.name || 'User'}</span> {/* Keep optional chaining here */}
                    {/* Profile Link */}
                    <Link href={`/${lang}/profile`} className="text-sm font-medium text-gray-600 hover:text-hl-blue transition-colors">Profile</Link>
                    {/* Logout Button */}
                    <Button onClick={() => signOut({ callbackUrl: `/${lang}` })} variant="outline" size="sm">Logout</Button>
                 </div>
               )}
               {status === 'unauthenticated' && (
                 <div className="flex items-center gap-2"> {/* Wrap buttons */}
                   <Link href={`/${lang}/login`} passHref legacyBehavior>
                     <Button as="a" size="sm">{dict.header.login}</Button>
                   </Link>
                   <Link href={`/${lang}/signup`} passHref legacyBehavior>
                      {/* Assuming you add 'signup' to your dictionary */}
                     <Button as="a" variant="outline" size="sm">{dict.header.signup || 'Sign Up'}</Button>
                   </Link>
                 </div>
               )}
            </div>

            {/* Mobile Menu Toggle Button (Moved from HeaderClient) */}
            <button
              className="md:hidden main-nav-toggle text-2xl text-[--hl-blue]" // Removed ml-4
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              ☰
            </button>
          </div>
        </nav>
      </header>

      {/* Render Client Component ONLY for the mobile menu overlay */}
      {/* Pass state and toggle function as props */}
      <HeaderClient
        dict={dict}
        lang={lang}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMenu={toggleMenu}
        redirectedPathName={redirectedPathName} // Pass necessary path info
        otherLang={otherLang} // Pass necessary lang info
      />
    </>
  );
}
