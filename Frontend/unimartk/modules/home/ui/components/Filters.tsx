'use client';

import * as React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface PriceFilters {
  minPrice: string;
  maxPrice: string;
  selectedCities: string[];
}

interface FiltersProps {
  filters: PriceFilters;
  onFiltersChange: (filters: PriceFilters) => void;
}

export function Filters({ filters, onFiltersChange }: FiltersProps) {
  const [localFilters, setLocalFilters] = React.useState<PriceFilters>(filters);
  const [searchCity, setSearchCity] = React.useState('');

  const cities = ['Fulda', 'Frankfurt', 'Kassel', 'Kornberg']; // Example cities

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Debounce price filter changes
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (localFilters.minPrice !== filters.minPrice || localFilters.maxPrice !== filters.maxPrice) {
        onFiltersChange(localFilters);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(handler);
  }, [localFilters.minPrice, localFilters.maxPrice, filters.minPrice, filters.maxPrice, localFilters, onFiltersChange]);

  const handleCityChange = (cityName: string, checked: boolean) => {
    const updatedCities = checked
      ? [...localFilters.selectedCities, cityName]
      : localFilters.selectedCities.filter((city) => city !== cityName);
    
    const updatedFilters = {
      ...localFilters,
      selectedCities: updatedCities
    };
    
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    const updatedFilters = {
      ...localFilters,
      [field]: value
    };
    
    setLocalFilters(updatedFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      minPrice: '',
      maxPrice: '',
      selectedCities: []
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    setSearchCity('');
  };

  const hasActiveFilters = localFilters.minPrice || localFilters.maxPrice || localFilters.selectedCities.length > 0;

  return (
    <div className="lg:col-span-2 rounded-lg border bg-card text-card-foreground shadow-sm">
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

      <Accordion type="multiple" defaultValue={['price', 'cities']} className="w-full">
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
                  onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                />
              </div>
              <Label htmlFor="max-price" className="mt-2">Max Price</Label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-muted-foreground">€</span>
                <Input
                  id="max-price"
                  type="number"
                  placeholder="1000"
                  className="pl-8"
                  value={localFilters.maxPrice}
                  onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cities">
          <AccordionTrigger className="p-4">Cities</AccordionTrigger>
          <AccordionContent className="p-4 pt-0">
            <div className="mb-4">
              <Input
                placeholder="Search city"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              {cities
                .filter((city) =>
                  city.toLowerCase().includes(searchCity.toLowerCase())
                )
                .map((city) => (
                  <div key={city} className="flex items-center space-x-2">
                    <Checkbox
                      id={city}
                      checked={localFilters.selectedCities.includes(city)}
                      onCheckedChange={(checked) =>
                        handleCityChange(city, checked as boolean)
                      }
                    />
                    <Label htmlFor={city}>{city}</Label>
                  </div>
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}