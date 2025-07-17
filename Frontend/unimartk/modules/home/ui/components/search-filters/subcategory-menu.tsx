import { Category } from "@/modules/home/types";
import Link from "next/link";
import React from "react";

interface Props {
  category: Category;
  isOpen: boolean;
}

const SubcategoryMenu = ({ category, isOpen }: Props) => {
  if (
    !isOpen ||
    !category.subcategories ||
    category.subcategories.length === 0
  ) {
    return null;
  }

  return (
    <div className="absolute z-10" style={{ top: "100%", left: 0 }}>
      {/* invisible bridge to maintain hover */}
      <div className="h-3 w-60"></div>
      <div className="w-60  rounded-md overflow-hidden border border-border bg-background">
        <div className="">
          {category.subcategories.map((subcategory: Category) => (
            <Link
              key={subcategory.slug}
              href={`/${category.slug}/${subcategory.slug}`}
              className="w-full text-left p-4  flex justify-between items-center underline font-medium"
            >
              {subcategory.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubcategoryMenu;
