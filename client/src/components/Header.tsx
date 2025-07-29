import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { getTranslation, type Language } from "@/lib/i18n";

interface HeaderProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const languageOptions = [
  { code: 'en' as Language, flag: '🇺🇸', label: 'EN' },
  { code: 'es' as Language, flag: '🇪🇸', label: 'ES' },
  { code: 'ko' as Language, flag: '🇰🇷', label: 'KO' },
];

const navigationItems = [
  { key: 'dashboard', href: '#', active: true },
  { key: 'browse', href: '#', active: false },
  { key: 'categories', href: '#', active: false },
  { key: 'favorites', href: '#', active: false },
];

export default function Header({ language, onLanguageChange, searchQuery, onSearchChange }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-play text-white text-lg"></i>
              </div>
              <span className="text-2xl font-bold text-dark">MyVideo</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map(({ key, href, active }) => (
                <a
                  key={key}
                  href={href}
                  className={`
                    ${active 
                      ? 'text-primary font-medium border-b-2 border-primary pb-1' 
                      : 'text-gray-600 hover:text-primary transition-colors'
                    }
                  `}
                  data-testid={`nav-${key}`}
                >
                  {getTranslation(key, language)}
                </a>
              ))}
            </nav>

            {/* Search & Language */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64">
                <Search className="text-gray-400 mr-3 w-4 h-4" />
                <input
                  type="text"
                  placeholder={getTranslation('search_placeholder', language)}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="bg-transparent outline-none flex-1 text-sm"
                  data-testid="search-input"
                />
              </div>

              {/* Language Selector */}
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => onLanguageChange(e.target.value as Language)}
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  data-testid="language-selector"
                >
                  {languageOptions.map(({ code, flag, label }) => (
                    <option key={code} value={code}>
                      {flag} {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                data-testid="mobile-menu-toggle"
              >
                {isMobileMenuOpen ? (
                  <X className="text-gray-600 w-5 h-5" />
                ) : (
                  <Menu className="text-gray-600 w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setIsMobileMenuOpen(false)}
          data-testid="mobile-menu-overlay"
        >
          <div 
            className="bg-white w-64 h-full shadow-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-xl font-bold text-dark">Menu</span>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-menu-close"
              >
                <X className="text-gray-600 w-5 h-5" />
              </button>
            </div>
            <nav className="space-y-4">
              {navigationItems.map(({ key, href, active }) => (
                <a
                  key={key}
                  href={href}
                  className={`block ${active ? 'text-primary font-medium' : 'text-gray-600 hover:text-primary transition-colors'}`}
                  data-testid={`mobile-nav-${key}`}
                >
                  {getTranslation(key, language)}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                  <Search className="text-gray-400 mr-2 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={getTranslation('search_placeholder', language)}
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="bg-transparent outline-none flex-1 text-sm"
                    data-testid="mobile-search-input"
                  />
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
