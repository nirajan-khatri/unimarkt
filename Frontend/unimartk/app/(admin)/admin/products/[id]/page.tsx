import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import React, { Suspense } from "react";

import {
    ProductDetailsView,
    ProductDetailsViewSkeleton,
} from "@/modules/admin/ui/views/admin-product-details-view";
import { fetchProductById } from "@/services/products";

interface Props {
    params: Promise<{ id: string; slug: string }>;
}

export const dynamic = "force-dynamic";

const Page = async ({ params }: Props) => {
    const { id } = await params;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["product", id],
        queryFn: () => fetchProductById(id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<ProductDetailsViewSkeleton />}>
                <ProductDetailsView productId={id} />
            </Suspense>
        </HydrationBoundary>
    );
};

export default Page;
