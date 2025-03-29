// app/[lang]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { getDictionary, DictionaryType } from '@/lib/dictionary';
import { services } from '@/lib/services'; // Import services data
import { Locale } from '@/lib/dictionary'; // Import Locale type
import { Metadata } from 'next'; // Import Metadata type
import { StarIcon, TruckIcon, CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline'; // Import icons
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card" // Import shadcn Card components
import HeroContent from '@/components/HeroContent'; // Import the new client component
import ServiceCardList from '@/components/ServiceCardList'; // Import the new client component

// No need to redefine Locale

// Fetch dictionary based on lang param
async function getPageDictionary(lang: Locale): Promise<DictionaryType> {
  return getDictionary(lang);
}

export default async function HomePage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getPageDictionary(lang);

  // Example image list for gallery - use actual filenames from public/images
  const galleryImages = [
    { src: "/images/hood-of-the-luxury-car-G7MNGW.jpg", alt: "Rolls Royce Detail" },
    { src: "/images/pexels-lynxexotics-3764984.jpg", alt: "Luxury Car Interior" },
    { src: "/images/modern-luxury-car-EA1M35.jpg", alt: "Modern Luxury Car" },
    { src: "/images/pexels-mayday-1545743.jpg", alt: "Car on Road" },
  ];

  return (
    <>
      {/* Hero Section with Background Image */}
      <section id="hero" className="relative flex items-center justify-center text-center min-h-[70vh] px-4 py-16 text-white overflow-hidden"> {/* Added overflow-hidden */}
         {/* Background Image */}
         <Image
           src="/images/2014-rolls-royce-wraith-british-luxury-car-G249G7.jpg" // Changed to Rolls Royce image
           alt={dict.homepage.hero_title}
           fill // Use boolean 'fill' prop
           quality={75}
           className="absolute inset-0 z-0 object-cover" // Add 'object-cover' class
           priority // Important for LCP
         />
         {/* Gradient Overlay */}
         <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-0"></div>

         {/* Use the animated HeroContent client component */}
         <HeroContent dict={dict} lang={lang} />

      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-4 bg-white"> {/* Ensure background contrast */}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-hl-dark-blue">
          {dict.homepage.services_title}
        </h2>
        {/* Use the animated ServiceCardList client component */}
        <ServiceCardList lang={lang} />
      </section>

      {/* Fleet Highlight Section */}
      <section id="fleet" className="py-16 px-4 bg-hl-light-grey-bg">
        <div className="max-w-screen-xl mx-auto md:flex items-center gap-12">
            <div className="md:w-1/2 mb-8 md:mb-0">
                <Image src="/images/pexels-mikebirdy-120049.jpg" alt="Rolls Royce Ghost" width={600} height={400} className="rounded-lg shadow-lg w-full"/>
            </div>
            <div className="md:w-1/2">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-hl-dark-blue">Our Signature Vehicle</h2>
                <h3 className="text-xl font-semibold mb-3 text-hl-blue">{dict.service_page.rolls_royce_ghost}</h3>
                <p className="text-hl-grey-text mb-6">Indulge in the ultimate automotive luxury. Our Rolls Royce Ghost, complete with a professional chauffeur, ensures an unparalleled travel experience characterized by comfort, style, and sophistication.</p>
                <ul className="list-disc list-inside space-y-1 text-sm mb-6">
                    <li>Exquisite Leather Interior</li>
                    <li>Silent &amp; Smooth Ride</li>
                    <li>Complimentary Refreshments</li>
                    <li>Privacy Assured</li>
                </ul>
                <Link href={`/${lang}/contact`} className="cta-button">
                  Request a Quote
                </Link>
            </div>
        </div>
      </section>

       {/* Why Choose Us Section */}
      <section id="why-us" className="py-16 px-4 bg-white">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-hl-dark-blue">
          Experience the Difference
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-screen-xl mx-auto text-center">
          {/* Replaced placeholder divs with Heroicons and centered content - Updated icon color */}
          <div className="feature-item p-4 flex flex-col items-center">
             <StarIcon className="h-10 w-10 mb-3 text-hl-gold" /> {/* Changed text-hl-blue to text-hl-gold */}
             <h3 className="font-semibold mb-1 text-lg">Impeccable Service</h3>
             <p className="text-sm text-hl-grey-text">Professional, discreet chauffeurs dedicated to your comfort.</p>
          </div>
           <div className="feature-item p-4 flex flex-col items-center">
             <TruckIcon className="h-10 w-10 mb-3 text-hl-gold" /> {/* Changed text-hl-blue to text-hl-gold */}
             <h3 className="font-semibold mb-1 text-lg">Ultimate Luxury</h3>
             <p className="text-sm text-hl-grey-text">Travel in the renowned comfort of a Rolls Royce Ghost.</p>
          </div>
           <div className="feature-item p-4 flex flex-col items-center">
             <CalendarDaysIcon className="h-10 w-10 mb-3 text-hl-gold" /> {/* Changed text-hl-blue to text-hl-gold */}
             <h3 className="font-semibold mb-1 text-lg">Reliability</h3>
             <p className="text-sm text-hl-grey-text">Punctual and dependable service for your important events.</p>
          </div>
           <div className="feature-item p-4 flex flex-col items-center">
             <MapPinIcon className="h-10 w-10 mb-3 text-hl-gold" /> {/* Changed text-hl-blue to text-hl-gold */}
             <h3 className="font-semibold mb-1 text-lg">Nigeria Coverage</h3>
             <p className="text-sm text-hl-grey-text">Serving Lagos, Abuja, Port Harcourt, Kano, Ibadan and other major cities.</p>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section id="gallery" className="py-16 px-4 bg-hl-light-grey-bg">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-hl-dark-blue">
          A Glimpse of Luxury
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-screen-xl mx-auto">
          {galleryImages.map((image, index) => (
            <div key={index} className="gallery-item relative aspect-square overflow-hidden rounded-lg shadow-md group">
              <Image
                src={image.src}
                alt={image.alt}
                fill // Use boolean 'fill' prop
                className="group-hover:scale-105 transition-transform duration-300 object-cover" // Add 'object-cover' class
              />
               {/* Optional overlay on hover */}
               <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Region Focus Section */}
      <section id="region" className="py-16 px-4 bg-white">
         <div className="max-w-screen-lg mx-auto text-center">
             <h2 className="text-2xl md:text-3xl font-bold mb-6 text-hl-dark-blue">Operating Across Nigerias Major Hubs</h2> {/* Correctly Escaped apostrophe */}
             <p className="text-hl-grey-text mb-8 max-w-2xl mx-auto">From the vibrant energy of Lagos to the administrative heart of Abuja, Dudu-Black Autos provides premium chauffeur services where you need it most.</p> {/* Updated Text */}
             <div className="relative h-64 md:h-80 w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg">
                 <Image
                    src="/images/pexels-photo-4141962.webp" // Keep generic scenic image for now, replace with Nigeria-specific later
                    alt="Scenic View in Nigeria" // Updated Alt Text
                    fill // Use boolean 'fill' prop
                    className="object-cover" // Add 'object-cover' class
                 />
                 {/* Removed duplicate image */}
             </div>
         </div>
      </section>

    </>
  );
}

// Generate metadata for the homepage
export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> { // Use imported Locale and add return type
    const dict = await getDictionary(lang);
    // Update metadata for Dudu-Black Autos
    return {
        title: "Dudu-Black Autos | Luxury Chauffeur Service Nigeria", // Updated Title
        description: dict.homepage.hero_subtitle, // Keep dynamic subtitle
        alternates: {
            canonical: `/${lang}`,
            languages: { // Use standard IETF tags as keys, map to actual paths
                'en': '/en',
                'en-NG': '/pcm', // Use 'en-NG' as key, map to '/pcm' path
            },
        },
    };
}
