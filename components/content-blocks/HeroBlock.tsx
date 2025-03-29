import Image from 'next/image';

interface HeroBlockProps {
  title: string;
  subtitle: string;
  bgColor: string;
  commonPadding: string;
}

export default function HeroBlock({ title, subtitle, bgColor, commonPadding }: HeroBlockProps) {
  return (
    <section className={`${bgColor} ${commonPadding} text-center relative min-h-[40vh] flex flex-col justify-center items-center`}>
       <Image
         src={`/images/modern-luxury-car-EA1M35.jpg`} // Consider making image dynamic later
         alt={`${title} Background`}
         fill // Use the boolean 'fill' prop
         quality={60}
         className="absolute inset-0 z-0 opacity-20 object-cover" // Add 'object-cover' class
       />
       <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-hl-dark-blue">{title}</h1>
          <p className="text-lg text-hl-grey-text max-w-2xl mx-auto">{subtitle}</p>
       </div>
    </section>
  );
}
