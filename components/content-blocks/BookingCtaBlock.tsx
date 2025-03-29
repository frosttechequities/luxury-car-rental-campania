import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Import shadcn Button

interface BookingCtaBlockProps {
      title: string;
      buttonText: string;
      link: string; // Pass the constructed link
      bgColor: string;
      commonPadding: string;
    }

    export default function BookingCtaBlock({ title, buttonText, link, bgColor, commonPadding }: BookingCtaBlockProps) {
      return (
        <section className={`${bgColor} ${commonPadding} text-center`}>
          <h2 className="text-2xl font-bold mb-4 text-hl-dark-blue">{title}</h2>
          {/* Replace styled Link with shadcn Button */}
          <Button asChild>
            <Link href={link}>
              {buttonText}
            </Link>
          </Button>
        </section>
      );
    }
