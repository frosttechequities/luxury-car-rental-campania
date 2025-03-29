import 'server-only'; // Ensures this module runs only on the server

// Define the structure of your dictionary (optional but good practice)
// You might expand this interface as you add more keys
interface Dictionary {
  header: {
    home: string;
    services: string;
    contact: string;
    login: string;
    signup?: string; // Added optional signup key
  };
  // Add other sections as needed based on your JSON files
  [key: string]: any; // Allow for flexibility
}

// Define the supported locales
export type Locale = 'en' | 'pcm'; // Updated locales: Standard English, Nigerian Pidgin

// Load dictionaries dynamically
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  'en': () => import('./locales/en.json').then((module) => module.default), // Use en.json
  'pcm': () => import('./locales/pcm.json').then((module) => module.default), // Use pcm.json
};

// Function to get the dictionary for a given locale
export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  // Validate locale or fallback safely to 'en'
  const validLocale = locale === 'en' || locale === 'pcm' ? locale : 'en';
  const loadDictionary = dictionaries[validLocale];
  return loadDictionary();
};

// Helper type for easier usage in components
export type DictionaryType = Awaited<ReturnType<typeof getDictionary>>;
