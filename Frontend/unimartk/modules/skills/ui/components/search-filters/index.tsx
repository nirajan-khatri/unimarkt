"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { DEFAULT_BG_COLOR } from "@/modules/home/constants";

import { BreadcrumbNavigation } from "./breadcrumb-navigation";
import { Categories } from "./categories";
import { SearchInput } from "./search-input";
import { skillCategories } from "@/constants/skills-categories";

function normalizeCategory(raw: any): Category {
  const subcategoryList = Array.isArray(raw.subcategories)
    ? raw.subcategories
    : Array.isArray(raw.subcategories?.docs)
      ? raw.subcategories.docs
      : [];

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    color: raw.color ?? undefined,
    subcategories: subcategoryList.map(normalizeCategory),
  };
}

export const SearchFilters = () => {
  const params = useParams();
  const categoryParam = params.category as string | undefined;
  const activeCategorySlug = categoryParam || "all";

  const activeCategoryData = skillCategories.find(
    (category) => category.slug === activeCategorySlug
  );
  const activeCategoryColor = activeCategoryData?.color || DEFAULT_BG_COLOR;
  const activeCategoryName = activeCategoryData?.name || "All";

  const activeSubcategory = params.subcategory as string | undefined;

  const activeSubcategoryName =
    activeCategoryData?.subcategories?.find(
      (subcategory) => subcategory.slug === activeSubcategory
    )?.name || null;

  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
      style={{ backgroundColor: activeCategoryColor }}
    >
      <SearchInput />
      <div className="hidden lg:block">
        <Categories data={skillCategories.map(normalizeCategory)} />
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
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
      style={{ backgroundColor: "#f5f5f5" }}
    >
      <SearchInput disabled />
      <div className="hidden lg:block">
        <div className="h-11"></div>
      </div>
    </div>
  );
};
