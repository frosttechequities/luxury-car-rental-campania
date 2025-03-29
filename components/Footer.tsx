import Link from 'next/link';
import { DictionaryType, Locale } from '@/lib/dictionary'; // Import Locale type
import { services } from '@/lib/services'; // Import services data
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa'; // Import specific social icons

interface FooterProps {
  dict: DictionaryType;
  lang: Locale; // Use imported Locale type
}

export default function Footer({ dict, lang }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    // Changed background, increased padding, removed top border
    <footer className="bg-hl-dark-blue text-gray-300 py-16 px-8 mt-16">
      <div className="max-w-screen-xl mx-auto">
        {/* Footer Grid - Increased gap */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10"> {/* Increased gap and bottom margin */}
          {/* Column 1: Company */}
          <div className="footer-section">
            {/* Adjusted heading color */}
            <h3 className="text-sm font-bold uppercase text-gray-400 mb-4">{dict.footer.company}</h3>
            <ul>
              {/* Brighter link color */}
              <li><Link href={`/${lang}/about`} className="text-sm text-gray-300 hover:text-white block pb-2 transition-colors">{dict.footer.about}</Link></li>
              <li><Link href={`/${lang}/careers`} className="text-sm text-gray-300 hover:text-white block pb-2 transition-colors">{dict.footer.careers}</Link></li>
              <li><Link href={`/${lang}/contact`} className="text-sm text-gray-300 hover:text-white block pb-2 transition-colors">{dict.header.contact}</Link></li>
            </ul>
          </div>

          {/* Column 2: Services */}
          {/* Column 2: Services - Now dynamic */}
          <div className="footer-section">
            <h3 className="text-sm font-bold uppercase text-gray-400 mb-4">{dict.footer.services}</h3>
            <ul>
              {services.map((service) => {
                // Log values for debugging
                console.log(`Footer Service Map: lang='${lang}', service.id='${service.id}', slug='${service.slug[lang]}', name='${service.name[lang]}'`);
                return (
                  <li key={service.id}>
                    {/* Ensure service.slug[lang] exists before creating link */}
                    {service.slug[lang] ? (
                      // Removed comment, applied brighter link color
                      <Link href={`/${lang}/${service.slug[lang]}`} className="text-sm text-gray-300 hover:text-white block pb-2 transition-colors">
                      {service.name[lang]}
                    </Link>
                  ) : (
                    // Fallback or omit if slug for current lang doesn't exist
                    <span className="text-sm text-gray-600 block pb-2">{service.name[lang]} (N/A)</span>
                  )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="footer-section">
            <h3 className="text-sm font-bold uppercase text-gray-400 mb-4">{dict.footer.resources}</h3>
            <ul>
               {/* Brighter link color */}
              <li><Link href={`/${lang}/blog`} className="text-sm text-gray-300 hover:text-white block pb-2 transition-colors">{dict.footer.blog}</Link></li>
              <li><Link href={`/${lang}/faq`} className="text-sm text-gray-300 hover:text-white block pb-2 transition-colors">FAQ</Link></li>
              {/* Add more resource links */}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="footer-section">
            <h3 className="text-sm font-bold uppercase text-gray-400 mb-4">{dict.footer.legal}</h3>
            <ul>
               {/* Brighter link color */}
              <li><Link href={`/${lang}/privacy-policy`} className="text-sm text-gray-300 hover:text-white block pb-2 transition-colors">{dict.footer.privacy}</Link></li>
              <li><Link href={`/${lang}/terms-of-service`} className="text-sm text-gray-300 hover:text-white block pb-2 transition-colors">{dict.footer.terms}</Link></li>
              <li><Link href={`/${lang}/cookie-policy`} className="text-sm text-gray-300 hover:text-white block pb-2 transition-colors">{dict.footer.cookies}</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom: Copyright & Social Links - Adjusted border and text color */}
        <div className="footer-bottom mt-10 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>{dict.footer.copyright.replace('{year}', currentYear.toString())}</p>
          {/* Use react-icons and add placeholder hrefs */}
          <div className="social-links flex gap-6 mt-4 md:mt-0"> {/* Increased gap */}
            <Link href="https://twitter.com/dudublackautos" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-500 hover:text-white transition-colors">
              <FaTwitter className="h-5 w-5" />
            </Link>
            <Link href="https://facebook.com/dudublackautos" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-500 hover:text-white transition-colors">
              <FaFacebookF className="h-5 w-5" />
            </Link>
            <Link href="https://linkedin.com/company/dudublackautos" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-500 hover:text-white transition-colors">
              <FaLinkedinIn className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
