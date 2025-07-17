import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Job } from "@/modules/jobs/types";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  MapPin,
  User,
  CheckCircle,
} from "lucide-react";

interface ProfileJobCardProps {
  job: Job;
}

export function ProfileJobCard({ job }: ProfileJobCardProps) {
  const router = useRouter();
  const salary = job.salary_per_hour
    ? parseFloat(job.salary_per_hour.toString())
    : "Negotiable";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleClick = () => {
    router.push(`/profile/jobs/${job.job_id}`);
  };

  return (
    <Card
      className="group bg-card text-foreground rounded-xl py-0 shadow-sm border border-border overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col"
      onClick={handleClick}
    >
      <CardContent className="p-6 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-muted-foreground transition-colors min-h-[3.5rem] leading-tight">
              {job.title}
            </h3>
            <div className="flex gap-2">
              {job.location && (
                <Badge
                  variant="secondary"
                  className="bg-muted text-foreground border-border font-medium"
                >
                  <MapPin size={12} className="mr-1" />
                  {job.location}
                </Badge>
              )}
              {/* Status Pill */}
              <Badge className={`text-xs font-medium ${getStatusColor(job.status.toLowerCase())}`}>
                {job.status === "approved" && (
                  <CheckCircle className="w-3 h-3 mr-1 inline" />
                )}
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Description - Fixed height */}
        <div className="mb-4 flex-grow">
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 h-[2.5rem] overflow-hidden">
            {job.description}
          </p>
        </div>

        {/* Contact Info - Fixed height section */}
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg min-h-[3.5rem] border border-border">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <User size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground text-sm truncate">
              {job.user.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {job.contact_email}
            </p>
          </div>
        </div>

        {/* Salary Info */}
        {salary && (
          <div className="flex items-center gap-2 p-2 bg-muted rounded-lg border border-border">
            <span className="flex-shrink-0">Salary:</span>
            <span className="text-sm text-foreground font-medium">
              €{salary}/hr
            </span>
          </div>
        )}

        {/* Date Section - Fixed at bottom */}
        <div className="flex items-center gap-2 mb-2">
          <CalendarDays size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            Posted Date
          </span>
        </div>

        <div className="p-2 bg-muted rounded-lg border border-border mb-4">
          <span className="text-sm text-foreground">
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
          className="w-full font-medium bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md transition-all duration-200"
        >
          View Job Details
        </Button>
      </CardContent>
    </Card>
  );
} 