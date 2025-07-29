import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import { insertCategorySchema, type Category, type InsertCategory } from "@shared/schema";
import { getTranslation, type Language } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface CategoryFormProps {
  category?: Category;
  language: Language;
  onSubmit: (data: InsertCategory) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const formSchema = insertCategorySchema.extend({
  keywords: z.array(z.string()).default([])
});

export default function CategoryForm({ category, language, onSubmit, onCancel, isLoading }: CategoryFormProps) {
  const [keywordInput, setKeywordInput] = useState("");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      keywords: category?.keywords || []
    }
  });

  const keywords = form.watch("keywords");

  const addKeyword = () => {
    try {
      if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
        form.setValue("keywords", [...keywords, keywordInput.trim()]);
        setKeywordInput("");
      }
    } catch (error) {
      console.error('Add keyword error:', error);
    }
  };

  const removeKeyword = (index: number) => {
    try {
      form.setValue("keywords", keywords.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Remove keyword error:', error);
    }
  };

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    try {
      onSubmit(data);
    } catch (error) {
      console.error('Form submit error:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {category 
            ? getTranslation('edit_category', language) 
            : getTranslation('create_category', language)
          }
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{getTranslation('category_name', language)}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={getTranslation('category_name_placeholder', language)}
                      {...field}
                      data-testid="category-name-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{getTranslation('description', language)}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={getTranslation('description_placeholder', language)}
                      rows={3}
                      {...field}
                      value={field.value || ""}
                      data-testid="category-description-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>{getTranslation('keywords', language)}</FormLabel>
              
              {/* Add keyword input */}
              <div className="flex space-x-2">
                <Input
                  placeholder={getTranslation('add_keyword', language)}
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  data-testid="keyword-input"
                />
                <Button
                  type="button"
                  onClick={addKeyword}
                  size="sm"
                  variant="outline"
                  data-testid="add-keyword-button"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Keywords list */}
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword, index) => (
                    <div
                      key={index}
                      className="bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                      data-testid={`keyword-tag-${index}`}
                    >
                      <span>{keyword}</span>
                      <button
                        type="button"
                        onClick={() => removeKeyword(index)}
                        className="hover:text-red-600 transition-colors"
                        data-testid={`remove-keyword-${index}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
                data-testid="submit-category-button"
              >
                {isLoading ? (
                  <>Loading...</>
                ) : category ? (
                  getTranslation('update_category', language)
                ) : (
                  getTranslation('create_category', language)
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                data-testid="cancel-category-button"
              >
                {getTranslation('cancel', language)}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}