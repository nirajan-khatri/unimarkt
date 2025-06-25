import { JobCard } from "./JobCard";
import type { JobPosting } from '@/modules/jobs/hooks/useJobs';
import { JobGridSkeleton } from "@/modules/profile/ui/components/skeletons";

interface JobGridProps {
  jobs: JobPosting[];
  isLoading: boolean;
  error: Error | null;
}

export function JobGrid({ jobs, isLoading, error }: JobGridProps) {
  if (isLoading) {
    return <JobGridSkeleton />;
  }

  if (error) {
    return (
      <div className="lg:col-span-4 xl:col-span-6">
        <div className="text-center text-red-500 py-8">
          <p className="text-lg font-semibold mb-2">Error loading jobs</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="lg:col-span-4 xl:col-span-6">
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg font-semibold mb-2">No jobs found</p>
          <p className="text-sm">Try adjusting your search criteria or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-4 xl:col-span-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {jobs.map((job) => (
          <JobCard key={job.job_id} job={job} />
        ))}
      </div>
    </div>
  );
} 