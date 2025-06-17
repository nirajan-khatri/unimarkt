import Link from "next/link";
import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Props {
  activeCategorySlug?: string | null;
  activeCategoryName?: string | null;
  activeSubcategoryName?: string | null;
}

export const BreadcrumbNavigation = ({
  activeCategorySlug,
  activeCategoryName,
  activeSubcategoryName,
}: Props) => {
  if (!activeCategoryName || activeCategorySlug === "all") return null;
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {activeSubcategoryName ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                className="text-sm font-medium underline text-primary"
              >
                <Link href={`/${activeCategorySlug}`}>
                  {activeCategoryName}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-primary font-medium text-sm">
              /
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-primary">
                {activeSubcategoryName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm font-medium  text-primary">
              {activeCategoryName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
