import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React, { Suspense } from "react";

import {
  ProductView,
  ProductViewSkeleton,
} from "@/modules/products/ui/views/product-view";
import { fetchProductById } from "@/services/products";

interface Props {
  params: Promise<{ productId: string; slug: string }>;
}

export const dynamic = "force-dynamic";

const Page = async ({ params }: Props) => {
  const { productId } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductViewSkeleton />}>
        <ProductView productId={productId} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
