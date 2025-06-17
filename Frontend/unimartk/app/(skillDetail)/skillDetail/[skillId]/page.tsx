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
import { SkillView } from "@/modules/skills/ui/views/skill-view";

interface Props {
  params: Promise<{ skillId: string }>;
}

export const dynamic = "force-dynamic";

const Page = async ({ params }: Props) => {
  const { skillId } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["skill", skillId],
    queryFn: () => fetchSkillById(skillId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductViewSkeleton />}>
        <SkillView skillId={skillId} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
