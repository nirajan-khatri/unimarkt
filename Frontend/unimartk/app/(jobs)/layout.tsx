import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { SearchFilters as JobsSearchFilters } from "@/modules/jobs/ui/components/search-filters";
import { SearchFilterSkeleton } from "@/modules/home/ui/components/search-filters";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React, { Suspense } from "react";
// If you have a jobs-specific category service, import and use it here
// import { JobCategoryService } from "@/services/job-categories";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const queryClient = new QueryClient();

  // If you want to prefetch job categories, do it here
  // await queryClient.prefetchQuery({
  //   queryKey: ["job-categories"],
  //   queryFn: JobCategoryService.getCategories,
  // });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<SearchFilterSkeleton />}>
          <JobsSearchFilters />
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
