import { CheckCircleIcon } from '@heroicons/react/24/outline'; // Import icon at the top

interface ServiceHighlightsBlockProps {
  title: string;
  points: string[];
  bgColor: string;
  commonPadding: string;
}

export default function ServiceHighlightsBlock({ title, points, bgColor, commonPadding }: ServiceHighlightsBlockProps) {
  // Add border-t and border-hl-border-grey/10 for subtle top border if bg is white
  const borderClass = bgColor === 'bg-white' ? 'border-t border-hl-border-grey/10' : '';

  return (
    <section className={`${bgColor} ${commonPadding} ${borderClass}`}>
      <h2 className="text-2xl font-bold text-center mb-8 text-hl-dark-blue">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
        {points.map((point: string, i: number) => (
          <div key={i} className="p-4 flex flex-col items-center"> {/* Center content */}
            <CheckCircleIcon className="h-8 w-8 mb-2 text-hl-gold" /> {/* Changed text-hl-blue to text-hl-gold */}
            <p className="text-sm font-medium">{point}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
