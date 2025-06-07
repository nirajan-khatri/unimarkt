"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PriceFilters } from "@/hooks/useProducts";

interface FiltersProps {
  filters: PriceFilters;
  onFiltersChange: (filters: PriceFilters) => void;
}

export function Filters({ filters, onFiltersChange }: FiltersProps) {
  const [localFilters, setLocalFilters] = React.useState<PriceFilters>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Debounce price and pickup location filter changes
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (
        localFilters.minPrice !== filters.minPrice ||
        localFilters.maxPrice !== filters.maxPrice ||
        localFilters.pickupLocation !== filters.pickupLocation
      ) {
        onFiltersChange(localFilters);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(handler);
  }, [
    localFilters.minPrice,
    localFilters.maxPrice,
    localFilters.pickupLocation,
    filters.minPrice,
    filters.maxPrice,
    filters.pickupLocation,
    localFilters,
    onFiltersChange,
  ]);

  const handleInputChange = (field: keyof PriceFilters, value: string) => {
    const updatedFilters = {
      ...localFilters,
      [field]: value,
    };

    setLocalFilters(updatedFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      minPrice: "",
      maxPrice: "",
      pickupLocation: "",
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters =
    localFilters.minPrice ||
    localFilters.maxPrice ||
    localFilters.pickupLocation;

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
        defaultValue={["price", "location"]}
        className="w-full"
      >
        <AccordionItem value="price">
          <AccordionTrigger className="p-4">Price</AccordionTrigger>
          <AccordionContent className="p-4 pt-0">
            <div className="grid gap-2">
              <Label htmlFor="min-price">Min Price</Label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-muted-foreground">€</span>
                <Input
                  id="min-price"
                  type="number"
                  placeholder="0"
                  className="pl-8"
                  value={localFilters.minPrice}
                  onChange={(e) =>
                    handleInputChange("minPrice", e.target.value)
                  }
                />
              </div>
              <Label htmlFor="max-price" className="mt-2">
                Max Price
              </Label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-muted-foreground">€</span>
                <Input
                  id="max-price"
                  type="number"
                  placeholder="1000"
                  className="pl-8"
                  value={localFilters.maxPrice}
                  onChange={(e) =>
                    handleInputChange("maxPrice", e.target.value)
                  }
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location">
          <AccordionTrigger className="p-4">Pickup Location</AccordionTrigger>
          <AccordionContent className="p-4 pt-0">
            <div className="grid gap-4">
              <div>
                <Input
                  id="pickup-location"
                  placeholder="Enter pickup location"
                  value={localFilters.pickupLocation}
                  onChange={(e) =>
                    handleInputChange("pickupLocation", e.target.value)
                  }
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}