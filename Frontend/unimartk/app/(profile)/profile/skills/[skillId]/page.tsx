import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React, { Suspense } from "react";

import { fetchSkillById } from "@/modules/skills/api";
import { ProfileSkillView } from "@/modules/profile/ui/views/profile-skill-view";
import { SkillViewSkeleton } from "@/modules/skills/views/skill-view";

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
      <Suspense fallback={<SkillViewSkeleton />}>
        <ProfileSkillView skillId={skillId} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
