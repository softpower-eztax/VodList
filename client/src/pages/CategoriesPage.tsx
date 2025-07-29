import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, ArrowLeft } from "lucide-react";
import { type Category, type InsertCategory } from "@shared/schema";
import { type Language, getTranslation } from "@/lib/i18n";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryForm from "@/components/CategoryForm";
import CategoryList from "@/components/CategoryList";
import { Button } from "@/components/ui/button";

export default function CategoriesPage() {
  const [language, setLanguage] = useState<Language>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const { toast } = useToast();

  // Fetch categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['/api/categories'],
    select: (data: Category[]) => {
      if (!data) return [];
      
      // Apply search filter
      if (searchQuery) {
        return data.filter(category => 
          category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.keywords?.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      return data;
    }
  });

  // Create category mutation
  const createMutation = useMutation({
    mutationFn: (data: InsertCategory) => apiRequest('/api/categories', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      setShowForm(false);
      setEditingCategory(undefined);
      toast({
        title: getTranslation('success', language),
        description: getTranslation('category_created_success', language),
      });
    },
    onError: () => {
      toast({
        title: getTranslation('error', language),
        description: getTranslation('category_create_error', language),
        variant: "destructive",
      });
    }
  });

  // Update category mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertCategory> }) => 
      apiRequest(`/api/categories/${id}`, 'PATCH', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      setShowForm(false);
      setEditingCategory(undefined);
      toast({
        title: getTranslation('success', language),
        description: getTranslation('category_updated_success', language),
      });
    },
    onError: () => {
      toast({
        title: getTranslation('error', language),
        description: getTranslation('category_update_error', language),
        variant: "destructive",
      });
    }
  });

  // Delete category mutation
  const [deletingId, setDeletingId] = useState<string>();
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/categories/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      setDeletingId(undefined);
      toast({
        title: getTranslation('success', language),
        description: getTranslation('category_deleted_success', language),
      });
    },
    onError: () => {
      setDeletingId(undefined);
      toast({
        title: getTranslation('error', language),
        description: getTranslation('category_delete_error', language),
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (data: InsertCategory) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = (categoryId: string) => {
    try {
      if (confirm(getTranslation('confirm_delete_category', language))) {
        setDeletingId(categoryId);
        deleteMutation.mutate(categoryId);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: getTranslation('error', language),
        description: getTranslation('category_delete_error', language),
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(undefined);
  };

  const handleCreateNew = () => {
    setEditingCategory(undefined);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-light">
      <Header
        language={language}
        onLanguageChange={setLanguage}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                try {
                  window.location.href = '/';
                } catch (error) {
                  console.error('Navigation error:', error);
                }
              }}
              data-testid="back-to-dashboard"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {getTranslation('back_to_dashboard', language)}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-dark mb-2">
                {getTranslation('manage_categories', language)}
              </h1>
              <p className="text-gray-600">
                {getTranslation('manage_categories_description', language)}
              </p>
            </div>
            
            {!showForm && (
              <Button
                onClick={handleCreateNew}
                className="bg-primary hover:bg-red-600"
                data-testid="create-category-button"
              >
                <Plus className="w-4 h-4 mr-2" />
                {getTranslation('create_category', language)}
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {showForm ? (
          <CategoryForm
            category={editingCategory}
            language={language}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        ) : (
          <>
            {/* Categories List */}
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                    <div className="bg-gray-200 h-6 rounded mb-3 w-1/3"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <CategoryList
                categories={categories}
                language={language}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleteLoading={deletingId}
              />
            )}
          </>
        )}
      </main>

      <Footer language={language} />
    </div>
  );
}