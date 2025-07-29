import { Edit, Trash2, Tag } from "lucide-react";
import { type Category } from "@shared/schema";
import { getTranslation, type Language } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryListProps {
  categories: Category[];
  language: Language;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  isDeleteLoading?: string; // ID of category being deleted
}

export default function CategoryList({ 
  categories, 
  language, 
  onEdit, 
  onDelete, 
  isDeleteLoading 
}: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {getTranslation('no_categories', language)}
          </h3>
          <p className="text-gray-500">
            {getTranslation('no_categories_description', language)}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <Card key={category.id} className="hover:shadow-md transition-shadow border-l-4 border-l-primary border-l-opacity-30">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 
                    className="text-lg font-semibold text-dark"
                    data-testid={`category-name-${category.id}`}
                  >
                    {category.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {new Date(category.createdAt || '').toLocaleDateString()}
                  </span>
                </div>
                
                {category.description && (
                  <p 
                    className="text-gray-600 mb-3"
                    data-testid={`category-description-${category.id}`}
                  >
                    {category.description}
                  </p>
                )}
                
                {category.keywords && category.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs font-medium text-gray-500 mr-2">Keywords:</span>
                    {category.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold border border-gray-300"
                        data-testid={`category-keyword-${category.id}-${index}`}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(category)}
                  data-testid={`edit-category-${category.id}`}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  {getTranslation('edit', language)}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(category.id)}
                  disabled={isDeleteLoading === category.id}
                  data-testid={`delete-category-${category.id}`}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {isDeleteLoading === category.id 
                    ? getTranslation('deleting', language)
                    : getTranslation('delete', language)
                  }
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}