import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Calendar, CheckCircle, User } from "lucide-react";
import { SkillDetail } from "@/modules/skills/types";

interface ServiceCardProps {
  service: SkillDetail;
}

export function ProfileServiceCard({ service }: ServiceCardProps) {
  const router = useRouter();
  const hourlyRate = parseFloat(String(service.charge_per_hour));

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

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
    router.push(`/profile/skills/${service.skill_id}`);
  };

  const isApproved = service.status === "approved";

  return (
    <Card
      className="group bg-white dark:bg-accent dard:text-white py-0 rounded-xl shadow-sm border border-border overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-[450px] flex flex-col"
      onClick={handleClick}
    >
      <CardContent className="p-6 flex flex-col h-full">
        {/* Header Section - Fixed Height */}
        <div className="flex items-start justify-between min-h-[80px]">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
              {service.module.charAt(0).toUpperCase() + service.module.slice(1)}
            </h3>
            <div className="flex gap-2 mt-2">
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-700 dark:bg-accent dark:text-white border-border font-medium"
              >
                {service.skill_category.name}
              </Badge>
              {/* Status Pill */}
              <Badge
                className={`text-xs font-medium ${getStatusColor(service.status.toLowerCase())}`}
              >
                {service.status === "approved" && (
                  <CheckCircle className="w-3 h-3 mr-1 inline" />
                )}
                {service.status.charAt(0).toUpperCase() +
                  service.status.slice(1)}
              </Badge>
            </div>
          </div>
          {/* Price Badge */}
          <div className="bg-gray-50 px-4 py-2 rounded-lg border border-border flex-shrink-0 dark:bg-accent">
            <span className="text-2xl font-bold text-gray-800 dark:text-white">
              €{hourlyRate}
            </span>
            <span className="text-sm text-gray-600 dark:text-white font-medium">
              /hr
            </span>
          </div>
        </div>

        {/* Description - Fixed Height */}
        <div className="mb-4 h-[40px] flex items-start">
          <p className="text-gray-600 dark:text-white/90 text-sm leading-relaxed line-clamp-2">
            {service.description}
          </p>
        </div>

        {/* Provider Info - Fixed Height */}
        <div className="mb-4 h-[56px]">
          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-accent dark:text-white  border border-border rounded-lg h-full">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                {service.user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-white/90 truncate">
                {service.degree.name}
              </p>
            </div>
          </div>
        </div>

        {/* Availability Section - Flexible Height */}
        <div className="flex-1 mb-4 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-white">
              Available Times
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-start">
            {service.available_time_week.length > 0 ? (
              <div className="space-y-2">
                {service.available_time_week.slice(0, 2).map((slot, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg dark:bg-accent border border-border"
                  >
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      {slot.day}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-white/90">
                      {formatTime(slot.start_time)} -{" "}
                      {formatTime(slot.end_time)}
                    </span>
                  </div>
                ))}
                {service.available_time_week.length > 2 && (
                  <div className="text-center">
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full dark:bg-accent border border-border dark:text-white">
                      +{service.available_time_week.length - 2} more slots
                      available
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-center">
                <span className="text-sm text-red-600">No available slots</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
