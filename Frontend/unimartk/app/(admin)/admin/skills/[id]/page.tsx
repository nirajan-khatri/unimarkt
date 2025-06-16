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
import { fetchSkillById } from "@/modules/skills/api";
import { AdminSkillDetailsView } from "@/modules/admin/ui/views/admin-skills-details-view";

interface Props {
    params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

const Page = async ({ params }: Props) => {
    const { id } = await params;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["skill", id],
        queryFn: () => fetchSkillById(id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<ProductViewSkeleton />}>
                <AdminSkillDetailsView skillId={id} />
            </Suspense>
        </HydrationBoundary>
    );
};

export default Page;
