import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  MapPin,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Job } from "../../types";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const router = useRouter();
  const salary = job.salary_per_hour
    ? parseFloat(job.salary_per_hour.toString())
    : "Negotiable";

  return (
    <Card
      className="group bg-white dark:bg-accent dard:text-white rounded-xl py-0 shadow-sm border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col"
      onClick={() => router.push(`/jobDetail/${job.job_id}`)}
    >
      <CardContent className="p-6 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors min-h-[3.5rem] leading-tight dark:text-white">
              {job.title}
            </h3>
            {job.location && (
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-700 border-gray-200 font-medium dark:bg-accent dark:text-white"
              >
                <MapPin size={12} className="mr-1" />
                {job.location}
              </Badge>
            )}
          </div>
        </div>

        {/* Description - Fixed height */}
        <div className="mb-4 flex-grow">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 h-[2.5rem] overflow-hidden dark:text-white/90">
            {job.description}
          </p>
        </div>

        {/* Contact Info - Fixed height section */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg min-h-[3.5rem] dark:bg-accent dark:border dark:border-gray-100">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm truncate dark:text-white">
                {job.user.name}
              </p>
              <p className="text-xs text-gray-500 truncate dark:text-white">
                {job.contact_email}
              </p>
            </div>
          </div>

          {/* Salary Info */}
          {salary && (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 dark:bg-accent dark:border dark:border-gray-100">
              <span className="flex-shrink-0">Salary:</span>
              <span className="text-sm text-gray-800 font-medium dark:text-white">
                €{salary}/hr
              </span>
            </div>
          )}
        </div>

        {/* Date Section - Fixed at bottom */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays
              size={16}
              className="text-gray-400 dark:text-white/90"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-white/90">
              Posted Date
            </span>
          </div>

          <div className="p-2 bg-gray-50 rounded-lg border border-gray-200 mb-4 dark:bg-accent dark:border dark:border-gray-100">
            <span className="text-sm text-gray-800 dark:text-white">
              {new Date(job.created_at).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Action Button */}
          <Button
            size="lg"
            className="w-full font-medium bg-primary hover:bg-gray-900 text-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            View Job Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
