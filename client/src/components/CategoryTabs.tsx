import { Music, Cross, Video, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTranslation, type Language } from "@/lib/i18n";
import { type Category } from "@shared/schema";

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  language: Language;
}

// Icon mapping for categories (case-insensitive)
const categoryIcons: Record<string, any> = {
  'music': Music,
  'lesson': Cross,
  'sermon': Cross,
  'other': Video,
  'default': TrendingUp,
};

export default function CategoryTabs({ activeCategory, onCategoryChange, language }: CategoryTabsProps) {
  // Fetch categories from database
  const { data: categories, isLoading } = useQuery({
    queryKey: ['/api/categories'],
    select: (data: Category[]) => data || []
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <div className="animate-pulse bg-gray-200 h-10 w-20 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-10 w-20 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-10 w-20 rounded"></div>
          </nav>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {categories?.map((category) => {
            const isActive = activeCategory === category.name;
            const Icon = categoryIcons[category.name.toLowerCase()] || categoryIcons.default;
            
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.name)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                  ${isActive 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
                data-testid={`category-tab-${category.name}`}
              >
                <Icon className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
