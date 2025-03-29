import { getDictionary, DictionaryType, Locale } from '@/lib/dictionary'; // Import correct Locale type
import { Metadata } from 'next';

// Remove incorrect Locale definition

interface ContactPageProps {
  params: {
    lang: Locale; // Use imported Locale
  };
}

// Fetch dictionary
async function getData(lang: Locale) { // Use imported Locale
  const dictionary = await getDictionary(lang);
  return { dictionary };
}

// Generate metadata for the contact page
export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
    const { lang } = params;
    const { dictionary } = await getData(lang);

    // Use company name from dictionary or fallback
    const companyName = dictionary.company_name || "Dudu-Black Autos";
    const title = `${dictionary.contact_page.title} | ${companyName}`;
    const description = dictionary.contact_page.subtitle;

    return {
        title,
        description,
        alternates: {
            canonical: `/${lang}/contact`,
            languages: { // Use standard keys, map to actual paths
                'en': '/en/contact',
                'en-NG': '/pcm/contact', // Use 'en-NG' key for '/pcm' path
            },
        },
    };
}

// Contact Page Component
export default async function ContactPage({ params }: ContactPageProps) { // Use imported Locale
  const { lang } = params;
  const { dictionary } = await getData(lang);

  return (
    <section className="py-16 px-4 bg-hl-light-grey-bg"> {/* Consistent background */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-hl-dark-blue">
          {dictionary.contact_page.title}
        </h1>
        <p className="text-lg text-center mb-12 text-hl-grey-text">
          {dictionary.contact_page.subtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded shadow-md border border-hl-border-grey">
            <form> {/* Add form submission logic later */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{dictionary.contact_page.form_name}</label>
                <input type="text" id="name" name="name" required className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-hl-blue focus:border-hl-blue" />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{dictionary.contact_page.form_email}</label>
                <input type="email" id="email" name="email" required className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-hl-blue focus:border-hl-blue" />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">{dictionary.contact_page.form_message}</label>
                <textarea id="message" name="message" rows={5} required className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-hl-blue focus:border-hl-blue"></textarea>
              </div>
              <button type="submit" className="cta-button w-full">
                {dictionary.contact_page.form_submit}
              </button>
            </form>
          </div>

          {/* Contact Details */}
          <div className="space-y-6 mt-8 md:mt-0">
             <h2 className="text-xl font-semibold text-hl-dark-blue mb-4">{dictionary.contact_page.details_title}</h2>
             <div className="space-y-3 text-sm">
                <div>
                    <h3 className="font-medium text-gray-800">{dictionary.contact_page.email}:</h3>
                    <a href={`mailto:${dictionary.placeholders.email_address}`} className="text-hl-blue hover:underline">{dictionary.placeholders.email_address}</a>
                </div>
                 <div>
                    <h3 className="font-medium text-gray-800">{dictionary.contact_page.phone}:</h3>
                    <p>{dictionary.placeholders.phone_number}</p>
                </div>
                 <div>
                    <h3 className="font-medium text-gray-800">{dictionary.contact_page.address}:</h3>
                    <p>{dictionary.placeholders.street_address}</p>
                 </div>
             </div>
             {/* Optional: Add a map placeholder here */}
             <div className="bg-gray-300 h-48 rounded mt-6 flex items-center justify-center text-gray-500">Map Placeholder</div>
          </div>
        </div>
      </div>
    </section>
  );
}
