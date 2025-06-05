"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Category, Subcategory, MenuItem, SidebarProps } from "@/modules/home/types";
import { CategoryService } from "@/services/categories";

export function Sidebar({
  onCategorySelect,
  onSubcategorySelect,
  isSidebarOpen,
}: SidebarProps) {
  const [currentParent, setCurrentParent] = React.useState<string | null>(null);
  const [parentStack, setParentStack] = React.useState<string[]>([]);
  const [subcategoryCache, setSubcategoryCache] = React.useState<Record<number, MenuItem[]>>({});
  const [loadingSubcategories, setLoadingSubcategories] = React.useState<Set<number>>(new Set());

  // Fetch categories from API
  const { 
    data: categories, 
    isLoading: isCategoriesLoading, 
    isError: categoriesError,
    error 
  } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: CategoryService.getCategories,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Convert categories to menu format
  const menuData = React.useMemo(() => {
    if (!categories) return [];
    
    return categories.map(category => ({
      id: `category-${category.category_id}`,
      label: category.name,
      children: subcategoryCache[category.category_id] || []
    }));
  }, [categories, subcategoryCache]);

  // Fetch subcategories when a category is expanded
  const fetchSubcategories = React.useCallback(async (categoryId: number) => {
    // Return cached data if available
    if (subcategoryCache[categoryId]) {
      return subcategoryCache[categoryId];
    }

    // Prevent multiple simultaneous requests for the same category
    if (loadingSubcategories.has(categoryId)) {
      return [];
    }

    setLoadingSubcategories(prev => new Set(prev).add(categoryId));

    try {
      const subcategories = await CategoryService.getSubcategories(categoryId);

      // Convert to MenuItem format
      const formattedSubcategories = subcategories.map(sub => ({
        id: `subcategory-${sub.sub_category_id}`,
        label: sub.name
      }));

      // Update cache
      setSubcategoryCache(prev => ({
        ...prev,
        [categoryId]: formattedSubcategories
      }));

      return formattedSubcategories;
    } catch (error) {
      console.error(`Error fetching subcategories for category ${categoryId}:`, error);
      // Set empty array in cache to prevent repeated failed requests
      setSubcategoryCache(prev => ({
        ...prev,
        [categoryId]: []
      }));
      return [];
    } finally {
      setLoadingSubcategories(prev => {
        const newSet = new Set(prev);
        newSet.delete(categoryId);
        return newSet;
      });
    }
  }, [subcategoryCache, loadingSubcategories]);

  // Get current items based on navigation state
  const currentItems = React.useMemo(() => {
    if (currentParent === null) {
      return menuData;
    }
    
    const parentItem = menuData.find((item) => item.id === currentParent);
    return parentItem?.children || [];
  }, [menuData, currentParent]);

  // Get current navigation title
  const currentTitle = React.useMemo(() => {
    if (currentParent === null) {
      return "Categories";
    }
    
    const parentItem = menuData.find((item) => item.id === currentParent);
    return parentItem?.label || "Subcategories";
  }, [menuData, currentParent]);

  const handleItemClick = React.useCallback(async (item: MenuItem) => {
    if (currentParent === null) {
      // Category selection
      onCategorySelect(item.label);

      // Extract category ID from item ID
      const categoryId = parseInt(item.id.split('-')[1]);

      // Fetch subcategories
      const subcategories = await fetchSubcategories(categoryId);

      // Only navigate to subcategory view if there are subcategories
      if (subcategories.length > 0) {
        setParentStack(prev => [...prev, "root"]);
        setCurrentParent(item.id);
      }
    } else {
      // Subcategory selection
      onSubcategorySelect(item.label);
    }
  }, [currentParent, onCategorySelect, onSubcategorySelect, fetchSubcategories]);

  const handleBack = React.useCallback(() => {
    setParentStack(prev => {
      const newStack = [...prev];
      newStack.pop();
      setCurrentParent(newStack.length > 0 ? newStack[newStack.length - 1] : null);
      return newStack;
    });
    onCategorySelect(""); // Clear category filter when going back
  }, [onCategorySelect]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isSidebarOpen) return;
      
      if (event.key === 'Escape' && parentStack.length > 0) {
        handleBack();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen, parentStack.length, handleBack]);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
      ))}
    </div>
  );

  // Error component
  const ErrorDisplay = ({ error }: { error: unknown }) => (
    <div className="text-red-500 text-center p-4 space-y-3">
      <div className="text-sm font-medium">Failed to load data</div>
      <div className="text-xs text-gray-500">
        {error instanceof Error ? error.message : 'Unknown error occurred'}
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => window.location.reload()}
        className="text-xs"
      >
        Retry
      </Button>
    </div>
  );

  if (!isSidebarOpen) {
    return null;
  }

  return (
    <div className="w-64 h-screen border-r bg-white dark:bg-gray-800 fixed z-10 transition-transform duration-200 ease-in-out">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 min-h-[32px]">
            {parentStack.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={handleBack}
                aria-label="Go back"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <h2 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
              {currentTitle}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isCategoriesLoading ? (
            <LoadingSkeleton />
          ) : categoriesError ? (
            <ErrorDisplay error={error} />
          ) : currentItems.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-sm">No items found</div>
              <div className="text-xs mt-1 text-gray-400">
                {currentParent === null ? 'No categories available' : 'No subcategories available'}
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {currentItems.map((item) => {
                const categoryId = currentParent === null ? parseInt(item.id.split('-')[1]) : null;
                const isLoadingSubcats = categoryId ? loadingSubcategories.has(categoryId) : false;
                const hasChildren = currentParent === null && item.children && item.children.length > 0;
                const hasSubcategoriesInCache = currentParent === null && categoryId && subcategoryCache[categoryId];
                
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-3 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => handleItemClick(item)}
                    disabled={isLoadingSubcats}
                  >
                    <span className="flex-1 truncate">{item.label}</span>
                    
                    {/* Loading indicator for subcategories */}
                    {isLoadingSubcats && (
                      <div className="ml-2 w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                    )}
                    
                    {/* Chevron for categories with subcategories */}
                    {currentParent === null && !isLoadingSubcats && (hasChildren || !hasSubcategoriesInCache) && (
                      <ChevronRight className="ml-2 h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}