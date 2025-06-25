import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React, { Suspense } from "react";
import { fetchJobById } from "@/services/products";
import {
  AdminJobDetailsView,
  AdminDetailsViewSkeleton,
} from "@/modules/admin/ui/views/admin-job-details-view";

interface Props {
  params: Promise<{ id: string; slug: string }>;
}

export const dynamic = "force-dynamic";

const Page = async ({ params }: Props) => {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["job", id],
    queryFn: () => fetchJobById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AdminDetailsViewSkeleton />}>
        <AdminJobDetailsView jobId={id} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
