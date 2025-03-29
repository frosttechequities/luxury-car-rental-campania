import { getDictionary, DictionaryType, Locale } from '@/lib/dictionary'; // Import Locale
import { services, getServiceBySlug, Service } from '@/lib/services';
import { getAllLocations, City } from '@/lib/locations'; // Import correct function and type
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface ServicePageProps {
  params: {
    lang: Locale; // Use imported Locale
    serviceSlug: string;
  };
}

// Generate static paths for all services in both languages
export async function generateStaticParams() {
  const paths: { lang: Locale; serviceSlug: string }[] = [];
  const locales: Locale[] = ['en', 'pcm']; // Use updated locales

  locales.forEach(lang => {
    services.forEach(service => {
      // Ensure slug exists for the current language
      if (service.slug[lang]) {
        paths.push({ lang, serviceSlug: service.slug[lang] });
      }
    });
  });

  return paths;
}

// Fetch dictionary and service data
async function getData(lang: Locale, serviceSlug: string) {
  const dictionary = await getDictionary(lang);
  const service = getServiceBySlug(serviceSlug, lang); // Use correct lang type
  if (!service) {
    notFound();
  }
  return { dictionary, service };
}

// Generate metadata for the service page
export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
    const { lang, serviceSlug } = params;
    let service: Service | undefined;
    try {
        const data = await getData(lang, serviceSlug);
        service = data.service;
    } catch (error) {
        return {
            title: "Service Not Found | Dudu-Black Autos", // Updated company name
            description: "The requested service could not be found.",
        };
    }
    const dict = await getDictionary(lang);

    const title = `${service.name[lang]} - Dudu-Black Autos Nigeria`; // Updated company name
    const description = `Luxury Rolls Royce chauffeur service for ${service.name[lang].toLowerCase()} events in Nigeria by Dudu-Black Autos.`; // Updated description

    // Find the alternate slug
    const alternateLang: Locale = lang === 'en' ? 'pcm' : 'en';
    const alternateSlug = service.slug[alternateLang] ?? service.slug[lang]; // Fallback

    // Ensure language keys are correct
    const languages: { [key in Locale]?: string } = {};
    languages['en'] = `/en/${lang === 'en' ? serviceSlug : alternateSlug}`;
    languages['pcm'] = `/pcm/${lang === 'pcm' ? serviceSlug : alternateSlug}`;


    return {
        title,
        description,
        alternates: {
            canonical: `/${lang}/${serviceSlug}`,
            languages, // Use updated languages object
        },
    };
}

// Service Landing Page Component
export default async function ServicePage({ params }: ServicePageProps) {
  const { lang, serviceSlug } = params;
  const { dictionary, service } = await getData(lang, serviceSlug);
  const allCities = getAllLocations(); // Get cities data

  return (
    <>
      {/* Service-Specific Hero */}
      <section className="service-hero bg-gray-100 pt-12 px-4 text-center relative min-h-[50vh] flex flex-col justify-center items-center">
         <Image
           src={`/images/pexels-harrisonhaines-2834653.jpg`} // Use a suitable generic image
           alt={`${service.name[lang]} Service`}
           layout="fill"
           objectFit="cover"
           quality={75}
           className="absolute inset-0 z-0 opacity-30"
           priority
         />
         <div className="relative z-10">
           <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[--hl-dark-blue]">{service.name[lang]}</h1>
           <p className="text-lg text-[--hl-grey-text] max-w-2xl mx-auto">{service.description[lang]}</p>
         </div>
      </section>

      {/* Service Details Section */}
      <section className="py-12 px-4">
        <h2 className="text-2xl font-bold text-center mb-8 text-[--hl-dark-blue]">Why Choose Us for Your {service.name[lang]}?</h2>
        <div className="max-w-4xl mx-auto space-y-4 text-center"> {/* Centered text */}
            <p className="text-hl-grey-text">More details about the {service.name[lang]} service... Dudu-Black Autos offers unparalleled luxury and professionalism for your special occasion.</p>
            {/* Example: Add different content/components for weddings vs birthdays */}
            {service.id === 'weddings' && <p className="text-hl-grey-text">Our wedding package includes decorations, complimentary champagne, and a dedicated coordinator to ensure everything runs smoothly.</p>}
            {service.id === 'birthdays' && <p className="text-hl-grey-text">Celebrate in style! Add a personalized touch with music choices and route planning for your birthday celebration.</p>}
            {service.id === 'private-parties' && <p className="text-hl-grey-text">Ensure your guests arrive and depart with sophistication. We cater to all types of private events and parties.</p>}
        </div>
      </section>

       {/* Vehicle Showcase (Rolls Royce Ghost) */}
      <section className="bg-hl-light-grey-bg py-12 px-4"> {/* Use custom bg color */}
        <h2 className="text-2xl font-bold text-center mb-8 text-[--hl-dark-blue]">{dictionary.service_page.vehicle_details}</h2>
        <div className="max-w-4xl mx-auto text-center">
            <Image src="/images/pexels-mikebirdy-120049.jpg" alt="Rolls Royce Ghost" width={800} height={450} className="rounded shadow-md mb-4 inline-block"/>
            <h3 className="text-xl font-semibold mb-2 text-hl-blue">{dictionary.service_page.rolls_royce_ghost}</h3>
            <p className="text-[--hl-grey-text]">Experience the pinnacle of automotive luxury.</p>
            {/* Add more details/features later */}
        </div>
      </section>

      {/* Call to Action / Link to Location Pages */}
      <section className="py-16 px-4 text-center bg-white">
        <h2 className="text-2xl font-bold mb-4 text-[--hl-dark-blue]">Available Across Nigeria</h2>
        <p className="mb-8 text-[--hl-grey-text] max-w-xl mx-auto">Find our {service.name[lang]} service in your specific city. Select your location below or contact us for inquiries.</p>
        {/* Add List of Locations for this Service */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {allCities.map(city => (
            // Ensure city and service slugs for the current lang exist
            (city.slug[lang] && service.slug[lang]) ? (
              <Link key={city.slug[lang]} href={`/${lang}/${service.slug[lang]}/${city.slug[lang]}`} className="text-sm text-center text-hl-blue hover:underline p-2 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100">
                {city.name}
              </Link>
            ) : null // Don't render link if slug is missing for this lang
          ))}
        </div>
         <div className="mt-12">
             <Link href={`/${lang}/contact`} className="cta-button">
               {dictionary.service_page.book_now} / Inquire
             </Link>
         </div>
      </section>
    </>
  );
}