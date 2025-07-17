"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { JobFilters } from "@/modules/jobs/hooks/useJobs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface JobFiltersProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
}

export function JobFilters({ filters, onFiltersChange }: JobFiltersProps) {
  // Only keep location, minSalary, maxSalary in local state
  const [localFilters, setLocalFilters] = React.useState<
    Pick<JobFilters, "location" | "minSalary" | "maxSalary">
  >({
    location: filters.location || "",
    minSalary: filters.minSalary || "",
    maxSalary: filters.maxSalary || "",
  });

  React.useEffect(() => {
    setLocalFilters({
      location: filters.location || "",
      minSalary: filters.minSalary || "",
      maxSalary: filters.maxSalary || "",
    });
  }, [filters.location, filters.minSalary, filters.maxSalary]);

  // Debounce filter changes
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (
        localFilters.location !== filters.location ||
        localFilters.minSalary !== filters.minSalary ||
        localFilters.maxSalary !== filters.maxSalary
      ) {
        onFiltersChange({
          ...filters,
          location: localFilters.location,
          minSalary: localFilters.minSalary,
          maxSalary: localFilters.maxSalary,
        });
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [localFilters, filters, onFiltersChange]);

  const handleInputChange = (
    field: keyof typeof localFilters,
    value: string
  ) => {
    setLocalFilters({ ...localFilters, [field]: value });
  };

  const clearAllFilters = () => {
    const clearedFilters = { location: "", minSalary: "", maxSalary: "" };
    setLocalFilters(clearedFilters);
    onFiltersChange({
      ...filters,
      ...clearedFilters,
    });
  };

  const hasActiveFilters =
    localFilters.location || localFilters.minSalary || localFilters.maxSalary;

  return (
    <div className="lg:col-span-2 rounded-lg border border-border bg-card/20 text-card-foreground shadow-sm h-fit">
      <div className="flex items-center justify-between p-4 border-b border-border">
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
        defaultValue={["location", "salary"]}
        className="w-full"
      >
        <AccordionItem value="location" className="border-0">
          <AccordionTrigger className="p-4">Location</AccordionTrigger>
          <AccordionContent className="p-4 pt-0">
            <div className="grid gap-4">
              <Input
                id="location"
                placeholder="Enter location (e.g. Fulda)"
                value={localFilters.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="salary" className="border-t border-border">
          <AccordionTrigger className="p-4">Salary Range</AccordionTrigger>
          <AccordionContent className="p-4 pt-0">
            <div className="grid gap-4 grid-cols-2">
              <Input
                id="minSalary"
                type="number"
                placeholder="Min Salary"
                value={localFilters.minSalary}
                onChange={(e) => handleInputChange("minSalary", e.target.value)}
                min={0}
              />
              <Input
                id="maxSalary"
                type="number"
                placeholder="Max Salary"
                value={localFilters.maxSalary}
                onChange={(e) => handleInputChange("maxSalary", e.target.value)}
                min={0}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
