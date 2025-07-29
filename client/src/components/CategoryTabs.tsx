import { Music, Cross, Video, TrendingUp } from "lucide-react";
import { getTranslation, type Language } from "@/lib/i18n";

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  language: Language;
}

const categories = [
  { key: 'music', icon: Music, translationKey: 'music' },
  { key: 'sermon', icon: Cross, translationKey: 'sermons' },
  { key: 'other', icon: Video, translationKey: 'other' },
];

export default function CategoryTabs({ activeCategory, onCategoryChange, language }: CategoryTabsProps) {
  return (
    <div className="mb-8">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {categories.map(({ key, icon: Icon, translationKey }) => {
            const isActive = activeCategory === key;
            return (
              <button
                key={key}
                onClick={() => onCategoryChange(key)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                  ${isActive 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
                data-testid={`category-tab-${key}`}
              >
                <Icon className="w-4 h-4" />
                <span>{getTranslation(translationKey, language)}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
