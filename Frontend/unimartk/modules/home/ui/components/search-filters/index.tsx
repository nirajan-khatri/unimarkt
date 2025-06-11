"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { BreadcrumbNavigation } from "./breadcrumb-navigation";
import { Categories } from "./categories";
import { SearchInput } from "./search-input";
import { fetchCategories } from "@/modules/home/api";
import { useEffect, useState } from "react";
import { Category } from "@/modules/home/types";
import { CategoryService } from "@/services/categories";

export const SearchFilters = () => {
  const params = useParams();
  const categoryParam = params.category as string | undefined;
  const activeCategorySlug = categoryParam || "all";
  const [categories, setCategories] = useState<Category[]>([]);

  const { data } = useSuspenseQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.getCategories,
  });

  useEffect(() => {
    if (data) {
      setCategories(data);
    }
  }, [data]);

  const activeCategoryData = categories.find(
    (category) => category.slug === activeCategorySlug
  );
  const activeCategoryName = activeCategoryData?.name || "All";

  const activeSubcategory = params.subcategory as string | undefined;
  const activeSubcategoryName =
    activeCategoryData?.subcategories?.find(
      (subcategory) => subcategory.slug === activeSubcategory
    )?.name || null;

  return (
    <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full">
      <SearchInput />
      <div className="hidden lg:block">
        <Categories data={categories} />
      </div>
      <BreadcrumbNavigation
        activeCategorySlug={activeCategorySlug}
        activeCategoryName={activeCategoryName}
        activeSubcategoryName={activeSubcategoryName}
      />
    </div>
  );
};

export const SearchFilterSkeleton = () => {
  return (
    <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full">
      <SearchInput disabled />
      <div className="hidden lg:block">
        <div className="h-11"></div>
      </div>
    </div>
  );
};
