import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React, { Suspense } from "react";

import { fetchSkillById } from "@/modules/skills/api";
import { ProfileSkillView } from "@/modules/profile/ui/views/profile-skill-view";
import { SkillViewSkeleton } from "@/modules/skills/views/skill-view";
import { fetchJobById } from "@/modules/jobs/api";
import { ProfileJobView } from "@/modules/profile/ui/views/profile-job-view";

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
      <Suspense fallback={<SkillViewSkeleton />}>
        <ProfileJobView jobId={jobId} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
