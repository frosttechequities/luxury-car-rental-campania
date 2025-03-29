// components/ServiceCardList.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { services, Service } from '@/lib/services'; // Assuming Service type is exported
import { Locale } from '@/lib/dictionary';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ServiceCardListProps {
  lang: Locale;
  // Pass services data if it's dynamic, otherwise import directly if static
  // services: Service[];
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Stagger animation of cards
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 }, // Start further down
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function ServiceCardList({ lang }: ServiceCardListProps) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-screen-xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible" // Trigger animation when in view
      viewport={{ once: true, amount: 0.2 }} // Trigger once, when 20% is visible
    >
      {services.map((service) => (
        <motion.div key={service.id} variants={itemVariants}>
          {/* Card component with existing hover effects */}
          <Card className="flex flex-col text-center h-full hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out"> {/* Added h-full */}
            <CardContent className="p-0">
              <div className="relative h-40 w-full overflow-hidden rounded-t-lg">
                 <Image
                    src={ service.id === 'weddings' ? '/images/pexels-kampratt-3457780.jpg' : service.id === 'birthdays' ? '/images/pexels-garvin-st-villier-719266-3972755.jpg' : '/images/pexels-lloyd-freeman-599375-1429775.jpg'}
                    alt={service.name[lang]}
                    fill
                    className="object-cover"
                 />
              </div>
            </CardContent>
            <CardHeader>
              <CardTitle className="text-xl text-hl-blue">{service.name[lang]}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-hl-grey-text">{service.description[lang]}</p>
            </CardContent>
            <CardFooter className="mt-auto justify-center">
              <Link href={`/${lang}/${service.slug[lang]}`} className="text-sm font-bold text-hl-blue hover:underline">
                Learn More &amp;rarr;
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}