import { loadProductFilters } from "@/modules/products/search-params";
import { SearchParams } from "nuqs";
import React from "react";

interface Props {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<SearchParams>;
}

export const dynamic = "force-dynamic";

const Page = async ({ params, searchParams }: Props) => {
  const { category } = await params;
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
    <p className="">{category}</p>
  );
};

export default Page;
