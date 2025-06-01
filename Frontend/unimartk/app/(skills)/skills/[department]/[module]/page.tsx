import { loadProductFilters } from "@/modules/products/search-params";
import { SearchParams } from "nuqs";
import React from "react";

interface Props {
  params: Promise<{
    department: string;
    module: string;
  }>;
  searchParams: Promise<SearchParams>;
}
export const dynamic = "force-dynamic";

const Page = async ({ params, searchParams }: Props) => {
  const { module } = await params;
  const filters = await loadProductFilters(searchParams);
  // const queryClient = getQueryClient();
  // void queryClient.prefetchInfiniteQuery(
  //   trpc.products.getMany.infiniteQueryOptions({
  //     ...filters,
  //     category: subcategory,
  //     limit: DEFAULT_LIMIT,
  //   })
  // );

  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
    //   <ProductListView category={subcategory} />
    // </HydrationBoundary>
    <p className="">{module}</p>
  );
};

export default Page;
