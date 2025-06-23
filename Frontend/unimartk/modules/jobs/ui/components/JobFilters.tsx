"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { JobFilters } from '@/modules/jobs/hooks/useJobs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
      <Accordion
        type="multiple"
        defaultValue={["price", "module"]}
        className="w-full"
      >
        <AccordionItem value="department">
          <AccordionTrigger className="p-4">Department</AccordionTrigger>
          <AccordionContent className="p-4 pt-0">
            <div className="grid gap-2">
              <Input
                id="department"
                placeholder="Enter department"
                value={localFilters.department}
                onChange={e => handleInputChange("department", e.target.value)}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="jobType">
          <AccordionTrigger className="p-4">Job Type</AccordionTrigger>
          <AccordionContent className="p-4 pt-0">
            <div className="grid gap-4">
              <Input
                id="jobType"
                placeholder="Enter job type (e.g. hiwi, tutoring)"
                value={localFilters.jobType}
                onChange={e => handleInputChange("jobType", e.target.value)}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
} 