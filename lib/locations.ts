import { Locale } from './dictionary'; // Import the updated Locale type

export interface City {
  name: string; // Use standard English name
  slug: {
    [key in Locale]: string;
  };
  latitude: number; // Added latitude
  longitude: number; // Added longitude
}

// Simplified list of major Nigerian cities with approximate coordinates
export const nigerianCities: City[] = [
  {
    name: 'Lagos',
    slug: {
      en: 'lagos',
      pcm: 'lagos',
    },
    latitude: 6.5244,
    longitude: 3.3792,
  },
  {
    name: 'Abuja',
    slug: {
      en: 'abuja',
      pcm: 'abuja',
    },
    latitude: 9.0765,
    longitude: 7.3986,
  },
  {
    name: 'Port Harcourt',
    slug: {
      en: 'port-harcourt',
      pcm: 'port-harcourt',
    },
    latitude: 4.8156,
    longitude: 7.0498,
  },
  {
    name: 'Kano',
    slug: {
      en: 'kano',
      pcm: 'kano',
    },
    latitude: 12.0022,
    longitude: 8.5920,
  },
  {
    name: 'Ibadan',
    slug: {
      en: 'ibadan',
      pcm: 'ibadan',
    },
    latitude: 7.3776,
    longitude: 3.9470,
  }, // Removed extra closing brace here
  // Add more major cities as needed
];

// --- Helper Functions ---

// Get all city locations
export const getAllLocations = (): City[] => {
  return nigerianCities;
};

// Get city details by slug and language
export const getLocationBySlug = (
  citySlug: string,
  lang: Locale
): City | undefined => {
  return nigerianCities.find(c => c.slug[lang] === citySlug);
};

// Note: Province/Region structure and helpers removed as we are simplifying to cities for now.
