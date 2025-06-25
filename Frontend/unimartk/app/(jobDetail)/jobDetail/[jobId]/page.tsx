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
import { JobDetailView } from "@/modules/jobs/ui/views/job-view";
import { fetchJobById } from "@/modules/jobs/api";

interface Props {
  params: Promise<{ jobId: string }>;
}

export const dynamic = "force-dynamic";

const Page = async ({ params }: Props) => {
  const { jobId } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["job", jobId],
    queryFn: () => fetchJobById(jobId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductViewSkeleton />}>
        <JobDetailView jobId={jobId} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
