import { ServiceCard } from "@/modules/skills/ui/components/ServiceCard";
import { Loader2 } from "lucide-react";

interface ServiceGridProps {
  services: any[];
  isLoading: boolean;
  error: Error | null;
}

export function ServiceGrid({ services, isLoading, error }: ServiceGridProps) {
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white/50 flex items-center justify-center z-50">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="lg:col-span-4 xl:col-span-6">
        <div className="text-center text-red-500 py-8">
          <p className="text-lg font-semibold mb-2">Error loading services</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!services.length) {
    return (
      <div className="lg:col-span-4 xl:col-span-6">
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg font-semibold mb-2">No services found</p>
          <p className="text-sm">Try adjusting your search criteria or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-4 xl:col-span-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {services.map((service) => (
          <ServiceCard key={service.skill_id} service={service} />
        ))}
      </div>
    </div>
  );
}