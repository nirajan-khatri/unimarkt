import React, { Suspense } from "react";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { fetchSkillById } from "@/services/products";
import { SkillView, SkillViewSkeleton } from "@/modules/skills/views/skill-view";

interface Props {
  params: Promise<{ skillId: string; slug: string }>;
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
      <Suspense fallback={<SkillViewSkeleton />}>
        <SkillView skillId={skillId} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;