import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { fetchCategories } from "@/modules/home/api";
import { normalizeCategories } from "@/lib/utils";

interface Props {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean) => void;
}

export const CategoriesSidebar = ({ onOpenChange, open }: Props) => {
  const router = useRouter();

  const [categories, setCategories] = useState<OldCategory[]>([]);

  const { data, isLoading, error } = useSuspenseQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    if (data) {
      // Optionally normalize data here if needed
      setCategories(normalizeCategories(data));
    }
  }, [data]);

  const [parentCategories, setParentCategories] = useState<
    OldCategory[] | null
  >(null);
  const [selectedCategory, setSelectedCategory] = useState<OldCategory | null>(
    null
  );

  // if we have parent categories, show those, otherwisenshow root categories
  const currentCategories = parentCategories ?? categories ?? [];

  const handleOpenChange = (open: boolean) => {
    setSelectedCategory(null);
    setParentCategories(null);
    onOpenChange(open);
  };

  const handleCategoryClick = (category: OldCategory) => {
    console.log(category);
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as OldCategory[]);
      setSelectedCategory(category);
    } else {
      // leaf category (no subcategories)
      if (parentCategories && selectedCategory) {
        //  This is a subcategory - naigate to /category/subcategory
        router.push(`/${selectedCategory.slug}/${category.slug}`);
      } else {
        // This is a root category - navigate to /category
        if (category.slug === "all") {
          // If the category is "all", navigate to the home page
          router.push("/");
        } else {
          router.push(`/${category.slug}`);
        }
      }

      handleOpenChange(false);
    }
  };

  const handleBackClick = () => {
    if (parentCategories) {
      setParentCategories(null);
      setSelectedCategory(null);
    }
  };

  const backgroundColor = selectedCategory?.color || "white";

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        className="p-0 transition-none"
        style={{ backgroundColor }}
      >
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
              onClick={() => handleCategoryClick(category as OldCategory)}
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
