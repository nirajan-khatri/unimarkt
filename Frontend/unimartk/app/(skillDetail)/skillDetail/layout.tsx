import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

import {
  SearchFilters,
  SearchFilterSkeleton,
} from "@/modules/home/ui/components/search-filters";
import { CategoryService } from "@/services/categories";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React, { Suspense } from "react";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.getCategories,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <div className="max-w-(--breakpoint-xl) mx-auto">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
