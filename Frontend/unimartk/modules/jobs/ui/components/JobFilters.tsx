"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { JobFilters } from '@/modules/jobs/hooks/useJobs';

interface JobFiltersProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
}

export function JobFilters({ filters, onFiltersChange }: JobFiltersProps) {
  const [localFilters, setLocalFilters] = React.useState<JobFilters>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Debounce filter changes
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (
        localFilters.department !== filters.department ||
        localFilters.jobType !== filters.jobType ||
        localFilters.minRemuneration !== filters.minRemuneration ||
        localFilters.maxRemuneration !== filters.maxRemuneration
      ) {
        onFiltersChange(localFilters);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [localFilters, filters, onFiltersChange]);

  const handleInputChange = (field: keyof JobFilters, value: string) => {
    setLocalFilters({ ...localFilters, [field]: value });
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      department: "",
      jobType: "",
      minRemuneration: "",
      maxRemuneration: "",
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters =
    localFilters.department ||
    localFilters.jobType ||
    localFilters.minRemuneration ||
    localFilters.maxRemuneration;

  return (
    <div className="lg:col-span-2 rounded-lg border bg-card text-card-foreground shadow-sm h-fit">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-lg">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>
      <div className="p-4 space-y-4">
        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            placeholder="Enter department"
            value={localFilters.department}
            onChange={e => handleInputChange("department", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="jobType">Job Type</Label>
          <Input
            id="jobType"
            placeholder="Enter job type (e.g. hiwi, tutoring)"
            value={localFilters.jobType}
            onChange={e => handleInputChange("jobType", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="minRemuneration">Min Remuneration (€)</Label>
          <Input
            id="minRemuneration"
            type="number"
            placeholder="0"
            value={localFilters.minRemuneration}
            onChange={e => handleInputChange("minRemuneration", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="maxRemuneration">Max Remuneration (€)</Label>
          <Input
            id="maxRemuneration"
            type="number"
            placeholder="1000"
            value={localFilters.maxRemuneration}
            onChange={e => handleInputChange("maxRemuneration", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
} 