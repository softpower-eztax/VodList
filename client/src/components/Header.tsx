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
  { code: "en" as Language, flag: "🇺🇸", label: "EN" },
  { code: "es" as Language, flag: "🇪🇸", label: "ES" },
  { code: "ko" as Language, flag: "🇰🇷", label: "KO" },
];

const navigationItems = [
  { key: "Favorite", href: "/favor", active: false },
  { key: "dashboard", href: "/", active: true },
  { key: "categories", href: "/categories", active: false },
];

export default function Header({
  language,
  onLanguageChange,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
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
              <span className="text-2xl font-bold text-dark">
                My Youtube Home 2
              </span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
