import { Locale } from './dictionary'; // Import the updated Locale type

export interface Service {
  id: string;
  slug: {
    [key in Locale]: string; // Use Locale type here
  };
  name: {
    [key in Locale]: string; // Use Locale type here
  };
  description: { // Placeholder descriptions
    [key in Locale]: string; // Use Locale type here
  };
  // Add other relevant fields later, e.g., specific images, features
}

// Define services for Dudu-Black Autos in Nigeria
export const services: Service[] = [
  {
    id: 'birthdays',
    slug: {
      en: 'birthday-luxury-car-hire-nigeria', // Updated slug
      pcm: 'birthday-beta-car-hire-naija', // Example Pidgin slug
    },
    name: {
      en: 'Birthday Celebrations', // Updated name
      pcm: 'Birthday Jollification', // Example Pidgin name
    },
    description: {
      en: 'Arrive in style and make your birthday unforgettable with our Dudu-Black Autos Rolls Royce Ghost chauffeur service in Nigeria.', // Updated description
      pcm: 'Show up correct & make your birthday sweet well-well with our Dudu-Black Autos Rolls Royce Ghost driver service for Naija.', // Example Pidgin description
    },
  },
  {
    id: 'weddings',
    slug: {
      en: 'wedding-luxury-car-hire-nigeria', // Updated slug
      pcm: 'wedding-beta-car-hire-naija', // Example Pidgin slug
    },
    name: {
      en: 'Weddings',
      pcm: 'Wedding Day', // Example Pidgin name
    },
    description: {
      en: 'Experience ultimate luxury and elegance on your special day with our chauffeured Rolls Royce Ghost from Dudu-Black Autos.', // Updated description
      pcm: 'Enjoy beta luxury and swag on your special day with our Rolls Royce Ghost plus driver from Dudu-Black Autos.', // Example Pidgin description
    },
  },
  {
    id: 'private-parties',
    slug: {
      en: 'private-party-luxury-car-hire-nigeria', // Updated slug
      pcm: 'private-party-beta-car-hire-naija', // Example Pidgin slug
    },
    name: {
      en: 'Private Parties & Events', // Updated name
      pcm: 'Private Parties & Functions', // Example Pidgin name
    },
    description: {
      en: 'Make a grand entrance at your exclusive event in Nigeria with our premium Dudu-Black Autos Rolls Royce Ghost chauffeur service.', // Updated description
      pcm: 'Enter your exclusive function with levels using our premium Dudu-Black Autos Rolls Royce Ghost driver service for Naija.', // Example Pidgin description
    },
  },
];

// Helper function to get service by slug and language
export const getServiceBySlug = (slug: string, lang: Locale): Service | undefined => { // Use updated Locale type
  return services.find(service => service.slug[lang] === slug);
};

// Helper function to get service by ID
export const getServiceById = (id: string): Service | undefined => {
  return services.find(service => service.id === id);
};
