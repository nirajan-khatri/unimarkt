// components/homepage-filters.tsx (or features/product-listing/components/product-filters.tsx)
'use client'; // If this component uses client-side interactivity (which it will)

import * as React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox'; // Assuming you named it checkbox
import { Label } from '@/components/ui/label'; // You might need a Label for checkboxes and inputs

// Optional: If you want to use shadcn's button for the main "Filters" header
// import { Button } from '@/components/ui/button';
// import { SlidersHorizontal } from 'lucide-react'; // Or any other icon for the sort/filter icon

export function Filters() {
  // State for filter values (e.g., minPrice, maxPrice, selectedCities, etc.)
  const [minPrice, setMinPrice] = React.useState('');
  const [maxPrice, setMaxPrice] = React.useState('');
  const [searchCity, setSearchCity] = React.useState('');
  const [selectedCities, setSelectedCities] = React.useState<string[]>([]);

  const cities = ['Fulda', 'Frankfurt', 'Kassel', 'Kornberg']; // Example cities

  const handleCityChange = (cityName: string, checked: boolean) => {
    if (checked) {
      setSelectedCities((prev) => [...prev, cityName]);
    } else {
      setSelectedCities((prev) => prev.filter((city) => city !== cityName));
    }
  };

  // You would likely have a function here to apply/dispatch the filters
  // const applyFilters = () => {
  //   // e.g., dispatch an action, update URL params, refetch data
  //   console.log({ minPrice, maxPrice, selectedCities, searchCity });
  // };

  return (
    <div className="lg:col-span-2 rounded-lg border bg-card text-card-foreground shadow-sm">
      {/* Filters Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-lg">Filters</h3>
      </div>

      {/* Accordion for Filter Sections */}
      <Accordion type="multiple" defaultValue={['price', 'cities']} className="w-full">
        {/* Price Filter */}
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
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
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
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Cities Filter */}
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
                      checked={selectedCities.includes(city)}
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

      {/* Optional: Apply Filters Button */}
      {/* <div className="p-4 border-t">
        <Button className="w-full" onClick={applyFilters}>
          Apply Filters
        </Button>
      </div> */}
    </div>
  );
}