import { ServiceCard } from "@/modules/skills/ui/components/ServiceCard";
import { SkillGridSkeleton } from "@/modules/profile/ui/components/skeletons";

interface ServiceGridProps {
  services: any[];
  isLoading: boolean;
  error: Error | null;
}

export function ServiceGrid({ services, isLoading, error }: ServiceGridProps) {
  if (isLoading) {
    return <SkillGridSkeleton />;
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