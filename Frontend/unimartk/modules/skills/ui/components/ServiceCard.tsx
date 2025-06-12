import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, User, DollarSign, Calendar, CheckCircle } from "lucide-react";

interface ServiceCardProps {
  service: {
    skill_id: number;
    status: string;
    module: string;
    description: string;
    charge_per_hour: string;
    department: {
      id: number;
      name: string;
    };
    degree: {
      id: number;
      department: {
        id: number;
        name: string;
      };
      name: string;
    };
    user: {
      id: number;
      name: string;
      email: string;
      contact_number: string;
      role: {
        id: number;
        name: string;
      };
    };
    available_time_week: Array<{
      day: string;
      start_time: string;
      end_time: string;
      status: string;
    }>;
    skill_category: {
      id: number;
      name: string;
    };
    created_at: string;
  };
}

export function ServiceCard({ service }: ServiceCardProps) {
  const hourlyRate = parseFloat(service.charge_per_hour);
  const availableSlots = service.available_time_week.filter(slot => slot.status === 'open');
  
  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
              {service.module.charAt(0).toUpperCase() + service.module.slice(1)} Programming
            </CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {service.skill_category.name}
              </Badge>
              <Badge className={`text-xs ${getStatusColor(service.status)}`}>
                {service.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-sm text-gray-600 line-clamp-2">
            {service.description}
          </p>
          
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <User className="w-4 h-4" />
            <span>{service.user.name}</span>
            <span className="text-gray-400">•</span>
            <span>{service.degree.name}</span>
          </div>

          <div className="text-sm text-gray-500">
            <div className="flex items-center gap-1 mb-1">
              <Calendar className="w-4 h-4" />
              <span>Available Times:</span>
            </div>
            {availableSlots.length > 0 ? (
              <div className="ml-5 space-y-1">
                {availableSlots.slice(0, 2).map((slot, index) => (
                  <div key={index} className="text-xs">
                    <span className="font-medium">{slot.day}</span>: {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                  </div>
                ))}
                {availableSlots.length > 2 && (
                  <div className="text-xs text-gray-400">
                    +{availableSlots.length - 2} more slots
                  </div>
                )}
              </div>
            ) : (
              <div className="ml-5 text-xs text-gray-400">No available slots</div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-lg text-green-600">
                €{hourlyRate}/hr
              </span>
            </div>
            
            <Button size="sm" className="text-xs" disabled={service.status !== 'approved'}>
              {service.status === 'approved' ? 'Book Session' : 'Not Available'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}