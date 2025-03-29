interface Quote {
    text: string;
    author: string;
}

interface TestimonialsBlockProps {
  title: string;
  quotes: Quote[];
  bgColor: string;
  commonPadding: string;
}

export default function TestimonialsBlock({ title, quotes, bgColor, commonPadding }: TestimonialsBlockProps) {
  // Add a check for empty quotes array
  if (!quotes || quotes.length === 0) {
    return null; // Don't render the section if there are no quotes
  }

  return (
    <section className={`${bgColor} ${commonPadding}`}>
      <h2 className="text-2xl font-bold text-center mb-8 text-hl-dark-blue">{title}</h2>
      <div className="max-w-2xl mx-auto space-y-6"> {/* Added space-y-6 */}
        {quotes.map((quote, i) => (
          <blockquote key={i} className="bg-white p-6 rounded shadow border-l-4 border-hl-blue"> {/* Removed mb-4 */}
            <p className="italic mb-2 text-hl-grey-text">{`"${quote.text}"`}</p> {/* Use CSS var */}
            <footer className="text-sm text-right text-hl-grey-text">- {quote.author}</footer> {/* Use CSS var */}
          </blockquote>
        ))}
      </div>
    </section>
  );
}
