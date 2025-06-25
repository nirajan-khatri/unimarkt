import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function ProductSkeleton() {
  return (
    <Card className="group bg-white gap-0 rounded-xl py-0 shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      {/* Image placeholder + floating badges */}
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* full-bleed image skeleton */}
        <Skeleton className="absolute inset-0" />

        {/* category badge */}
        <div className="absolute top-3 right-3">
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>

        {/* price badge */}
        <div className="absolute bottom-3 left-3">
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>

      <CardContent className="p-5 flex flex-col flex-grow">
        {/* title */}
        <Skeleton className="h-6 w-3/4 mb-4" />

        {/* description (2 lines) */}
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-4" />

        {/* info blocks */}
        <div className="space-y-3 mb-4">
          {/* location */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>

          {/* date */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        </div>

        {/* CTA button */}
        <Skeleton className="h-10 w-full mt-auto rounded-md" />
      </CardContent>
    </Card>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
}
