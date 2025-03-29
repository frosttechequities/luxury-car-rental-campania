// Remove PlusIcon import, add Accordion imports
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FaqItem {
    q: string;
    a: string;
}

interface FaqBlockProps {
  title: string;
  questions: FaqItem[];
  bgColor: string;
  commonPadding: string;
}

export default function FaqBlock({ title, questions, bgColor, commonPadding }: FaqBlockProps) {
  // Add a check for empty questions array
  if (!questions || questions.length === 0) {
    return null; // Don't render the section if there are no questions
  }

  // Add border-t and border-hl-border-grey/10 for subtle top border if bg is white
  const borderClass = bgColor === 'bg-white' ? 'border-t border-hl-border-grey/10' : '';

  return (
    <section className={`${bgColor} ${commonPadding} ${borderClass}`}>
      <h2 className="text-2xl font-bold text-center mb-8 text-hl-dark-blue">{title}</h2>
      {/* Replace custom details/summary with shadcn Accordion */}
      <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
        {questions.map((item, i) => (
          <AccordionItem value={`item-${i}`} key={i}>
            <AccordionTrigger className="text-left font-semibold text-hl-blue hover:no-underline"> {/* Added text-left */}
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-hl-grey-text">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
