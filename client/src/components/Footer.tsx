import { getTranslation, type Language } from "@/lib/i18n";

interface FooterProps {
  language: Language;
}

export default function Footer({ language }: FooterProps) {
  const quickLinks = [
    { key: 'browse_videos', href: '#' },
    { key: 'categories', href: '#' },
    { key: 'upload_video', href: '#' },
    { key: 'help_center', href: '#' },
  ];

  const supportLinks = [
    { key: 'contact_us', href: '#' },
    { key: 'privacy_policy', href: '#' },
    { key: 'terms_of_service', href: '#' },
    { key: 'community_guidelines', href: '#' },
  ];

  const socialLinks = [
    { icon: 'fab fa-facebook-f', href: '#', label: 'Facebook' },
    { icon: 'fab fa-twitter', href: '#', label: 'Twitter' },
    { icon: 'fab fa-youtube', href: '#', label: 'YouTube' },
    { icon: 'fab fa-instagram', href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="bg-dark text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-play text-white text-lg"></i>
              </div>
              <span className="text-2xl font-bold">MyVideo</span>
            </div>
            <p className="text-gray-300 mb-4">
              {getTranslation('footer_description', language)}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="text-gray-300 hover:text-primary transition-colors"
                  data-testid={`social-${label.toLowerCase()}`}
                  aria-label={label}
                >
                  <i className={`${icon} text-xl`}></i>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">
              {getTranslation('quick_links', language)}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map(({ key, href }) => (
                <li key={key}>
                  <a
                    href={href}
                    className="text-gray-300 hover:text-primary transition-colors"
                    data-testid={`footer-link-${key}`}
                  >
                    {getTranslation(key, language)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">
              {getTranslation('support', language)}
            </h3>
            <ul className="space-y-2">
              {supportLinks.map(({ key, href }) => (
                <li key={key}>
                  <a
                    href={href}
                    className="text-gray-300 hover:text-primary transition-colors"
                    data-testid={`footer-link-${key}`}
                  >
                    {getTranslation(key, language)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            {getTranslation('copyright', language)}
          </p>
        </div>
      </div>
    </footer>
  );
}
