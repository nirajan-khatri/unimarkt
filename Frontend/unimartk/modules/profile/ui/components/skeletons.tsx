import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Product Skeleton Component
export function ProductSkeleton() {
  return (
    <Card className="rounded-lg border border-border bg-card text-foreground">
      {/* Image container with exact height */}
      <div className="relative h-48 mb-4">
        <Skeleton className="absolute inset-0 rounded-t-lg bg-muted" />
      </div>
      <CardContent className="p-4">
        {/* Title */}
        <Skeleton className="h-7 w-3/4 mb-2 bg-muted" />
        {/* Description - two lines */}
        <div className="space-y-2 mb-2">
          <Skeleton className="h-4 w-full bg-muted" />
          <Skeleton className="h-4 w-2/3 bg-muted" />
        </div>
        {/* Price and category row */}
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-6 w-16 bg-muted" /> {/* Price */}
          <Skeleton className="h-6 w-24 rounded bg-muted" /> {/* Category tag */}
        </div>
        {/* Posted date */}
        <div className="mt-2">
          <Skeleton className="h-4 w-32 bg-muted" />
        </div>
      </CardContent>
    </Card>
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
    <Card className="group bg-card text-foreground py-0 rounded-xl shadow-sm border border-border overflow-hidden h-[450px] flex flex-col">
      <CardContent className="p-6 flex flex-col h-full">
        {/* ── Header ───────────────────────────────────────── */}
        <div className="flex items-start justify-between min-h-[80px] mb-4">
          {/* title + category badge */}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-4/5 bg-muted" />         {/* title */}
            <Skeleton className="h-5 w-28 rounded-md bg-muted" />{/* category */}
          </div>
          {/* price badge */}
          <Skeleton className="h-10 w-24 rounded-lg bg-muted" />
        </div>
        {/* ── Description (2 lines) ───────────────────────── */}
        <Skeleton className="h-4 w-full mb-2 bg-muted" />
        <Skeleton className="h-4 w-5/6 mb-6 bg-muted" />
        {/* ── Provider block ──────────────────────────────── */}
        <div className="mb-4 h-[56px]">
          <div className="flex items-center gap-2 p-3 bg-muted border border-border rounded-lg h-full">
            <Skeleton className="h-8 w-8 rounded-full flex-shrink-0 bg-muted" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3 w-24 bg-muted" />        {/* name */}
              <Skeleton className="h-3 w-32 bg-muted" />        {/* degree */}
            </div>
          </div>
        </div>
        {/* ── Availability section ────────────────────────── */}
        {/* header row */}
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-4 w-4 rounded bg-muted" />
          <Skeleton className="h-3 w-28 bg-muted" />
        </div>
        {/* two slot rows + “more” tag */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-full rounded-lg bg-muted" />
          <Skeleton className="h-8 w-full rounded-lg bg-muted" />
          <Skeleton className="h-4 w-32 mx-auto rounded-full bg-muted" />
        </div>
        {/* ── CTA button ──────────────────────────────────── */}
        <Skeleton className="h-10 w-full mt-auto rounded-md bg-muted" />
      </CardContent>
    </Card>
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

export function JobSkeleton() {
  return (
    <Card className="group bg-card text-foreground rounded-xl py-0 shadow-sm border border-border overflow-hidden h-full flex flex-col">
      <CardContent className="p-6 flex flex-col h-full">
        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 space-y-2">
            {/* title (2 lines max height) */}
            <Skeleton className="h-6 w-4/5 bg-muted" />
            <Skeleton className="h-6 w-3/5 bg-muted" />
            {/* location badge */}
            <Skeleton className="h-5 w-28 rounded-md bg-muted" />
          </div>
        </div>
        {/* ── Description (2 lines) ──────────────────────── */}
        <Skeleton className="h-4 w-full mb-2 bg-muted" />
        <Skeleton className="h-4 w-5/6 mb-6 bg-muted" />
        {/* ── Contact / salary block ─────────────────────── */}
        <div className="space-y-3 mb-4">
          {/* user + email row */}
          <div className="flex items-center gap-2 p-3 bg-muted border border-border rounded-lg min-h-[3.5rem]">
            <Skeleton className="h-8 w-8 rounded-full flex-shrink-0 bg-muted" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3 w-24 bg-muted" />
              <Skeleton className="h-3 w-32 bg-muted" />
            </div>
          </div>
          {/* salary row */}
          <div className="flex items-center gap-2 p-2 bg-muted border border-border rounded-lg min-h-[2.5rem]">
            <Skeleton className="h-3 w-16 bg-muted" />
            <Skeleton className="h-3 w-20 bg-muted" />
          </div>
        </div>
        {/* ── Posted date + CTA at bottom ────────────────── */}
        {/* date header */}
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-4 w-4 rounded bg-muted" />
          <Skeleton className="h-3 w-24 bg-muted" />
        </div>
        {/* date pill */}
        <Skeleton className="h-8 w-full rounded-lg mb-4 bg-muted" />
        {/* action button */}
        <Skeleton className="h-10 w-full rounded-md bg-muted" />
      </CardContent>
    </Card>
  );
}

export function JobGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <JobSkeleton key={idx} />
      ))}
    </div>
  );
}