import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { JobPosting } from '@/modules/jobs/hooks/useJobs';
import { format } from 'date-fns';
import { CalendarDays, MapPin, DollarSign, Mail, Phone, User } from "lucide-react";


interface JobCardProps {
  job: JobPosting;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Card
      className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-0 shadow-md bg-white/80 backdrop-blur-sm overflow-hidden relative"
      onClick={()=>console.log("Card Clicked")}
    >
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

      <CardHeader className="pt-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
              {job.title}
            </CardTitle>
            <Badge
              variant="secondary"
              className="shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 font-medium"
            >
              {job.job_type}
            </Badge>
          </div>

          <div className="flex flex-wrap">
            {job.department?.name && (
              <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                {job.department.name}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Description */}
        <p className="text-gray-600 line-clamp-3 leading-relaxed text-sm">
          {job.description}
        </p>

        {/* Key details with icons */}
        <div className="space-y-3">
          {job.remuneration && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-green-500 shrink-0" />
              <span className="font-medium text-gray-700">Salary:</span>
              <span className="text-gray-600">{job.remuneration}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-blue-500 shrink-0" />
            <span className="font-medium text-gray-700">Contact:</span>
            <span className="text-gray-600 truncate">{job.contact_name}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-purple-500 shrink-0" />
            <span className="text-gray-600 truncate">{job.contact_email}</span>
          </div>

          {job.contact_phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-orange-500 shrink-0" />
              <span className="text-gray-600">{job.contact_phone}</span>
            </div>
          )}
        </div>

        {/* Footer with date */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <CalendarDays className="h-3 w-3" />
            <span>Posted {format(new Date(job.created_at), 'MMM dd, yyyy')}</span>
          </div>
          <div className="text-xs text-blue-600 group-hover:text-blue-700 font-medium">
            View Details →
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 