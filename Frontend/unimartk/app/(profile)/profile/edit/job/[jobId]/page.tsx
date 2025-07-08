import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CreateJobForm from "@/modules/profile/ui/forms/create-job-form";
import { fetchJobById } from "@/modules/jobs/api";

interface Props {
  params: Promise<{ jobId: string }>;
}

const Page = async ({ params }: Props) => {
  const { jobId } = await params;
  const queryClient = new QueryClient();

  // Prefetch on server
  await queryClient.prefetchQuery({
    queryKey: ["job"],
    queryFn: () => fetchJobById(jobId),
  });

  return (
    <div className="max-w-7xl w-full mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row gap-3 items-center">
          <Link href="/profile" passHref>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <CardTitle>Edit Job</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateJobForm jobId={jobId} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
