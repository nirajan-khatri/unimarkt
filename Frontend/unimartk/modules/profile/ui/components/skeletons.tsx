import { Skeleton } from "@/components/ui/skeleton";

// Product Skeleton Component
export function ProductSkeleton() {
  return (
    <div className="rounded-lg border bg-card">
      {/* Image container with exact height */}
      <div className="relative h-48 mb-4">
        <Skeleton className="absolute inset-0 rounded-t-lg" />
      </div>
      
      <div className="p-4">
        {/* Title */}
        <Skeleton className="h-7 w-3/4 mb-2" />
        
        {/* Description - two lines */}
        <div className="space-y-2 mb-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        {/* Price and category row */}
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-6 w-16" /> {/* Price */}
          <Skeleton className="h-6 w-24 rounded" /> {/* Category tag */}
        </div>
        
        {/* Posted date */}
        <div className="mt-2">
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  );
}

// Product Grid Skeleton Component
export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
}

// Skills/Service Skeleton Component
export function SkillSkeleton() {
  return (
    <div className="rounded-lg border bg-card">
      {/* Service icon/image container */}
      <div className="relative h-32 mb-4">
        <Skeleton className="absolute inset-0 rounded-t-lg" />
      </div>
      
      <div className="p-4">
        {/* Service title */}
        <Skeleton className="h-6 w-4/5 mb-2" />
        
        {/* Description - two lines */}
        <div className="space-y-2 mb-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        {/* Price per hour and category */}
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-5 w-20" /> {/* Price per hour */}
          <Skeleton className="h-5 w-20 rounded" /> {/* Category tag */}
        </div>
        
        {/* Availability status */}
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-3 w-3 rounded-full" /> {/* Status dot */}
          <Skeleton className="h-4 w-16" /> {/* Available text */}
        </div>
        
        {/* Posted date */}
        <div className="mt-2">
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </div>
  );
}

// Skills Grid Skeleton Component
export function SkillGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <SkillSkeleton key={index} />
      ))}
    </div>
  );
}

// Alternative compact skill skeleton for list view
export function SkillListSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-start gap-4">
        {/* Icon/Avatar */}
        <Skeleton className="h-12 w-12 rounded-lg flex-shrink-0" />
        
        <div className="flex-1 min-w-0">
          {/* Title and category */}
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-16 rounded" />
          </div>
          
          {/* Description */}
          <div className="space-y-1 mb-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          
          {/* Price and availability */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-4 w-14" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skills List Grid Skeleton (for list view)
export function SkillListGridSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <SkillListSkeleton key={index} />
      ))}
    </div>
  );
}