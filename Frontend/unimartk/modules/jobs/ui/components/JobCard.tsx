import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { JobPosting } from '@/modules/jobs/hooks/useJobs';
import { format } from 'date-fns';

interface JobCardProps {
  job: JobPosting;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
              {job.title}
            </CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {job.department?.name}
              </Badge>
              <Badge className="text-xs bg-blue-100 text-blue-800">
                {job.job_type}
              </Badge>
              <Badge className="text-xs bg-green-100 text-green-800">
                {job.status_display}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-sm text-gray-600 line-clamp-2">
            {job.description}
          </p>
          <div className="text-sm text-gray-500">
            <span className="font-semibold">Qualifications: </span>
            <span className="whitespace-pre-line">{job.qualifications}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span className="font-semibold">Remuneration:</span>
            <span>{job.remuneration}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span className="font-semibold">Contact:</span>
            <span>{job.contact_name}</span>
            <span>|</span>
            <span>{job.contact_email}</span>
            {job.contact_phone && <span>| {job.contact_phone}</span>}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>Posted:</span>
            <span>{format(new Date(job.created_at), 'MMM dd, yyyy')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 