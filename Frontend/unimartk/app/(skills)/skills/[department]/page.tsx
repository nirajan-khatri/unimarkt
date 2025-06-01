import { loadProductFilters } from "@/modules/products/search-params";
import { SearchParams } from "nuqs";
import React from "react";

interface Props {
  params: Promise<{
    department: string;
  }>;
  searchParams: Promise<SearchParams>;
}

export const dynamic = "force-dynamic";

const Page = async ({ params, searchParams }: Props) => {
  const { department } = await params;
  const filters = await loadProductFilters(searchParams);
  // const queryClient = getQueryClient();
  // void queryClient.prefetchInfiniteQuery(
  //   trpc.products.getMany.infiniteQueryOptions({
  //     ...filters,
  //     category,
  //     limit: DEFAULT_LIMIT,
  //   })
  // );

  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
    //   <ProductListView category={category} />
    // </HydrationBoundary>
    <p className="">{department}</p>
  );
};

export default Page;
