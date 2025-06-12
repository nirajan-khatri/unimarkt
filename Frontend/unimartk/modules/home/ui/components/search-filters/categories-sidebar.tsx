import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { fetchCategories } from "@/modules/home/api";
import { Category } from "@/modules/home/types";
import { useProducts } from "@/hooks/useProducts";
import { CategoryService } from "@/services/categories";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CategoriesSidebar = ({ onOpenChange, open }: Props) => {
  const router = useRouter();
  const params = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [parentCategories, setParentCategories] = useState<Category[] | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  // Get current category and subcategory from URL path params
  const currentCategory = params.category as string | undefined;
  const currentSubcategory = params.subcategory as string | undefined;

  // Fetch products when category/subcategory changes
  const { data: productsData } = useProducts(
    1, // Start with first page
    "", // No search term
    currentCategory,
    currentSubcategory
  );

  const { data } = useSuspenseQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.getCategories,
  });

  useEffect(() => {
    if (data) {
      setCategories(data);
    }
  }, [data]);

  // Initialize selected category from URL params
  useEffect(() => {
    if (currentCategory && data) {
      const category = data.find(
        (cat: Category) => cat.slug === currentCategory
      );
      if (category) {
        setSelectedCategory(category);
        if (category.subcategories && category.subcategories.length > 0) {
          setParentCategories(category.subcategories as Category[]);
        }
      }
    }
  }, [currentCategory, data]);

  // if we have parent categories, show those, otherwise show root categories
  const currentCategories = parentCategories ?? categories ?? [];

  const handleOpenChange = (open: boolean) => {
    setSelectedCategory(null);
    setParentCategories(null);
    onOpenChange(open);
  };

  const createUrlPath = (category: string, subcategory?: string) => {
    if (subcategory) {
      return `/${category}/${subcategory}`;
    }
    return `/${category}`;
  };

  const handleCategoryClick = (category: Category) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as Category[]);
      setSelectedCategory(category);
      router.push(createUrlPath(category.slug));
    } else {
      // leaf category (no subcategories)
      if (parentCategories && selectedCategory) {
        //  This is a subcategory
        router.push(createUrlPath(selectedCategory.slug, category.slug));
      } else {
        // This is a root category
        if (category.slug === "all") {
          router.push("/");
        } else {
          router.push(createUrlPath(category.slug));
        }
      }
      handleOpenChange(false);
    }
  };

  const handleBackClick = () => {
    if (parentCategories) {
      setParentCategories(null);
      setSelectedCategory(null);
      router.push("/");
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="left" className="p-0 transition-none bg-white">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {parentCategories && (
            <button
              onClick={handleBackClick}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium cursor-pointer"
            >
              <ChevronLeftIcon className="size-4 mr-2" />
              Back
            </button>
          )}
          {currentCategories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryClick(category as Category)}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center justify-between text-base font-medium cursor-pointer"
            >
              {category.name}
              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronRightIcon className="size-4" />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
