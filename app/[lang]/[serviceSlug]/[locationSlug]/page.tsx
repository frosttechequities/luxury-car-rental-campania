import { getDictionary, Locale, DictionaryType } from '@/lib/dictionary';
import { services, getServiceBySlug, Service } from '@/lib/services';
import { getAllLocations, getLocationBySlug, City } from '@/lib/locations';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';

// Import Content Blocks
import HeroBlock from '@/components/content-blocks/HeroBlock';
import ServiceHighlightsBlock from '@/components/content-blocks/ServiceHighlightsBlock';
import VehicleBlock from '@/components/content-blocks/VehicleBlock';
import LocationFocusBlock from '@/components/content-blocks/LocationFocusBlock';
import TestimonialsBlock from '@/components/content-blocks/TestimonialsBlock';
import FaqBlock from '@/components/content-blocks/FaqBlock';
import BookingCtaBlock from '@/components/content-blocks/BookingCtaBlock';

// Dynamically import MapDisplay to avoid SSR issues
const MapDisplay = dynamic(() => import('@/components/MapDisplay'), {
  ssr: false,
  loading: () => <div className="bg-gray-300 h-64 rounded flex items-center justify-center text-gray-500">Loading Map...</div>
});

interface ServiceLocationPageProps {
  params: {
    lang: Locale;
    serviceSlug: string;
    locationSlug: string;
  };
}

// Types for block props (matching block definitions)
interface Quote { text: string; author: string; }
interface FaqItem { q: string; a: string; }

export async function generateStaticParams() {
  const paths: { lang: Locale; serviceSlug: string; locationSlug: string }[] = [];
  const locales: Locale[] = ['en', 'pcm'];
  const allCities = getAllLocations();

  locales.forEach(lang => {
    services.forEach(service => {
      allCities.forEach(city => {
        if (service.slug[lang] && city.slug[lang]) {
          paths.push({
            lang,
            serviceSlug: service.slug[lang],
            locationSlug: city.slug[lang]
          });
        }
      });
    });
  });

  return paths;
}

async function getData(lang: Locale, serviceSlug: string, locationSlug: string) {
  const dictionary = await getDictionary(lang);
  const service = getServiceBySlug(serviceSlug, lang);
  const city = getLocationBySlug(locationSlug, lang);

  if (!service || !city) {
    notFound();
  }

  return { dictionary, service, city };
}

export async function generateMetadata({ params }: ServiceLocationPageProps): Promise<Metadata> {
  const { lang, serviceSlug, locationSlug } = params;
  let service: Service | undefined;
  let city: City | undefined;

  try {
      const data = await getData(lang, serviceSlug, locationSlug);
      service = data.service;
      city = data.city;
  } catch (error) {
      return {
          title: "Page Not Found | Dudu-Black Autos",
          description: "The requested service or location could not be found.",
      };
  }

  if (!service || !city) {
       return {
           title: "Page Not Found | Dudu-Black Autos",
           description: "The requested service or location could not be found.",
       };
   }

  const title = `${service.name[lang]} in ${city.name} | Dudu-Black Autos`;
  const description = `Book our luxury ${service.name[lang].toLowerCase()} chauffeur service in ${city.name}, Nigeria with Dudu-Black Autos. Experience unparalleled style and comfort.`;

  const alternateLang: Locale = lang === 'en' ? 'pcm' : 'en';
  const alternateServiceSlug = service.slug[alternateLang] ?? service.slug[lang];
  const alternateLocationSlug = city.slug[alternateLang] ?? city.slug[lang];

  const languages: { [key in Locale]?: string } = {};
  if (service.slug['en'] && city.slug['en']) {
      languages['en'] = `/en/${lang === 'en' ? serviceSlug : alternateServiceSlug}/${lang === 'en' ? locationSlug : alternateLocationSlug}`;
  }
  if (service.slug['pcm'] && city.slug['pcm']) {
      languages['pcm'] = `/pcm/${lang === 'pcm' ? serviceSlug : alternateServiceSlug}/${lang === 'pcm' ? locationSlug : alternateLocationSlug}`;
  }

  return {
    title,
    description,
    alternates: {
        canonical: `/${lang}/${serviceSlug}/${locationSlug}`,
        languages,
    },
  };
}

// Main Page Component using Content Blocks
export default async function ServiceLocationPage({ params }: ServiceLocationPageProps) {
  const { lang, serviceSlug, locationSlug } = params;
  const { dictionary, service, city } = await getData(lang, serviceSlug, locationSlug);

  // Define common styles - Increased vertical padding
  const commonPadding = "py-16 px-4 md:px-8"; // Increased py-12 to py-16
  const bgWhite = "bg-white";
  const bgLightGrey = "bg-hl-light-grey-bg"; // Use color from tailwind config

  // Prepare data for blocks
  const heroTitle = `${service.name[lang]} in ${city.name}`;
  const heroSubtitle = service.description[lang]; // Use service description

  // Use the refined descriptions directly from the dictionary
  const highlightPoints = [
      dictionary.highlights.professionalism_desc,
      dictionary.highlights.luxury_desc,
      dictionary.highlights.punctuality_desc,
      `${dictionary.highlights.local_expertise_title} ${city.name}`, // Keep location specific point
  ];

  const vehicleFeatures = [
      dictionary.vehicle_features.feature1 || "Plush Leather Seating", // Use dictionary or fallback
      dictionary.vehicle_features.feature2 || "State-of-the-Art Sound System",
      dictionary.vehicle_features.feature3 || "Privacy Partition",
      dictionary.vehicle_features.feature4 || "Complimentary Refreshments",
  ];

  const locationText = `${dictionary.location_focus.desc_prefix} ${city.name}. ${dictionary.location_focus.desc_suffix}`;

  const testimonials: Quote[] = [
    { text: dictionary.testimonials.placeholder1, author: "Satisfied Client" },
    { text: dictionary.testimonials.placeholder2, author: "Happy Customer" },
  ];

  const faqs: FaqItem[] = [
    { q: dictionary.faq.q1, a: dictionary.faq.a1 },
    { q: `${dictionary.faq.q2} ${city.name}?`, a: dictionary.faq.a2 },
    { q: dictionary.faq.q3, a: dictionary.faq.a3 },
    { q: `${dictionary.faq.q4_prefix} ${service.name[lang]}?`, a: dictionary.faq.a4_generic }, // Generic answer
  ];

  const ctaTitle = `${dictionary.booking_cta.title_prefix} ${service.name[lang]} in ${city.name}?`;
  const ctaLink = `/${lang}/contact`;

  return (
    <div className="flex flex-col">
      {/* 1. Hero Block */}
      <HeroBlock
        title={heroTitle}
        subtitle={heroSubtitle}
        bgColor={bgLightGrey} // Example background
        commonPadding={commonPadding}
      />

      {/* 2. Service Highlights Block */}
      <ServiceHighlightsBlock
         title={dictionary.highlights.block_title || `Why Choose Us for ${service.name[lang]}?`} // Use dictionary or fallback
         points={highlightPoints}
         bgColor={bgWhite}
         commonPadding={commonPadding}
      />

      {/* 3. Vehicle Block */}
      <VehicleBlock
        title={dictionary.service_page.vehicle_details || "Our Featured Vehicle"}
        vehicleName={dictionary.service_page.rolls_royce_ghost}
        features={vehicleFeatures}
        bgColor={bgLightGrey}
        commonPadding={commonPadding}
        dictionary={dictionary} // Pass dictionary as this block uses it
      />

      {/* 4. Location Focus Block */}
      <LocationFocusBlock
        title={`${dictionary.location_focus.title_prefix} ${city.name}`}
        text={locationText}
        city={city} // Pass the full city object
        mapPlaceholder={false} // We are providing the map component
        bgColor={bgWhite}
        commonPadding={commonPadding}
      />

      {/* 5. Testimonials Block */}
      <TestimonialsBlock
        title={dictionary.testimonials.block_title || "What Our Clients Say"}
        quotes={testimonials}
        bgColor={bgLightGrey}
        commonPadding={commonPadding}
      />

      {/* 6. FAQ Block */}
      <FaqBlock
        title={dictionary.faq.block_title || "Frequently Asked Questions"}
        questions={faqs}
        bgColor={bgWhite}
        commonPadding={commonPadding}
      />

      {/* 7. Booking CTA Block */}
      <BookingCtaBlock
        title={ctaTitle}
        buttonText={dictionary.booking_cta.button_text}
        link={ctaLink}
        bgColor={bgLightGrey}
        commonPadding={commonPadding}
      />

    </div>
  );
}
