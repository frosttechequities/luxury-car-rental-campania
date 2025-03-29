import Image from 'next/image';
    import dynamic from 'next/dynamic';
    import { City } from '@/lib/locations'; // Assuming City type is needed

    // Dynamically import the MapDisplay component, disabling SSR
    const MapDisplay = dynamic(() => import('@/components/MapDisplay'), {
      ssr: false,
      loading: () => <div className="bg-gray-300 h-64 rounded flex items-center justify-center text-gray-500">Loading Map...</div>
    });

    interface LocationFocusBlockProps {
      title: string;
      text: string;
      city: City; // Pass the whole city object
      mapPlaceholder: boolean; // Keep prop, though we set it to false in page
      bgColor: string;
      commonPadding: string;
    }

    export default function LocationFocusBlock({ title, text, city, mapPlaceholder, bgColor, commonPadding }: LocationFocusBlockProps) {
      // Add border-t and border-hl-border-grey/10 for subtle top border if bg is white
      const borderClass = bgColor === 'bg-white' ? 'border-t border-hl-border-grey/10' : '';

      return (
        <section className={`${bgColor} ${commonPadding} ${borderClass}`}>
          <h2 className="text-2xl font-bold text-center mb-8 text-hl-dark-blue">{title}</h2>
          <div className="max-w-4xl mx-auto md:flex gap-8 items-center">
             <div className="md:w-1/2 text-center md:text-left mb-6 md:mb-0">
               <p className="mb-6">{text}</p>
               <p className="text-sm text-gray-500">Experience luxury travel with Dudu-Black Autos in {city.name}.</p>
             </div>
             <div className="md:w-1/2">
               {/* Render the actual map using the dynamically imported component */}
               <MapDisplay
                  lat={city.latitude}
                  lng={city.longitude}
                  popupText={`Dudu-Black Autos Service Area - ${city.name}`}
                  className="h-64 w-full rounded shadow-md"
               />
             </div>
          </div>
        </section>
      );
    }
