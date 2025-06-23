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
  // Only keep department and jobType in local state
  const [localFilters, setLocalFilters] = React.useState<Pick<JobFilters, 'department' | 'jobType'>>({
    department: filters.department,
    jobType: filters.jobType,
  });

  React.useEffect(() => {
    setLocalFilters({ department: filters.department, jobType: filters.jobType });
  }, [filters.department, filters.jobType]);

  // Debounce filter changes
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (
        localFilters.department !== filters.department ||
        localFilters.jobType !== filters.jobType
      ) {
        onFiltersChange({
          ...filters,
          department: localFilters.department,
          jobType: localFilters.jobType,
          minRemuneration: "",
          maxRemuneration: ""
        });
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [localFilters, filters, onFiltersChange]);

  const handleInputChange = (field: keyof typeof localFilters, value: string) => {
    setLocalFilters({ ...localFilters, [field]: value });
  };

  const clearAllFilters = () => {
    const clearedFilters = { department: "", jobType: "" };
    setLocalFilters(clearedFilters);
    onFiltersChange({
      ...filters,
      department: "",
      jobType: "",
      minRemuneration: "",
      maxRemuneration: ""
    });
  };

  const hasActiveFilters = localFilters.department || localFilters.jobType;

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
      </div>
    </div>
  );
} 