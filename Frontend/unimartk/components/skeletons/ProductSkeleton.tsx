import { Skeleton } from "@/components/ui/skeleton"

export function ProductSkeleton() {
  return (
    <div className="border rounded-lg">
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
  )
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  )
} 