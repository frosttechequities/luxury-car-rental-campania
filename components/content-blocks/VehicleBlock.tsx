import Image from 'next/image';
import { DictionaryType } from '@/lib/dictionary';

interface VehicleBlockProps {
  title: string;
  vehicleName: string;
  features: string[];
  bgColor: string;
  commonPadding: string;
  dictionary: DictionaryType; // Pass dictionary if needed for sub-labels like "Features"
}

export default function VehicleBlock({ title, vehicleName, features, bgColor, commonPadding, dictionary }: VehicleBlockProps) {
  return (
    <section className={`${bgColor} ${commonPadding}`}>
      <h2 className="text-2xl font-bold text-center mb-8 text-hl-dark-blue">{title}</h2>
      <div className="max-w-4xl mx-auto md:flex gap-8 items-center">
        {/* Use a Rolls Royce image */}
        <div className="md:w-1/2 mb-6 md:mb-0 flex justify-center">
           <Image src={`/images/2014-rolls-royce-wraith-british-luxury-car-G249G7.jpg`} alt={vehicleName} width={600} height={400} className="rounded shadow-md max-w-full h-auto"/>
        </div>
        <div className="md:w-1/2 text-center md:text-left">
          <h3 className="text-xl font-semibold mb-2 text-hl-blue">{vehicleName}</h3> {/* Reduced mb */}
          {/* Add vehicle description */}
          <p className="text-sm mb-4 text-gray-700">{dictionary.service_page.rolls_royce_ghost_desc}</p>
          <h4 className="font-semibold mb-2">{dictionary.service_page.features}:</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {features.map((feature: string, i: number) => <li key={i}>{feature}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
