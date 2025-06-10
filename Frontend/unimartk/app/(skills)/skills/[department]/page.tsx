"use client";

import React, { useState } from 'react';
import { useParams, useSearchParams } from "next/navigation";
import { ServiceListView } from '@/modules/skills/ui/components/ServicesListView';
import { useServices } from '@/hooks/useServices';

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  
  const department = params.department as string;
  const search = searchParams.get("search") || "";
  
  const { data, isLoading, error } = useServices(
    currentPage,
    search,
    department.toLowerCase(), // Convert to lowercase to match backend
    undefined,
    {
      minPrice: "",
      maxPrice: "",
      module: ""
    }
  );

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <main>
        <ServiceListView 
          services={data?.results || []}
          isLoading={isLoading}
          error={error as Error | null}
          category={department}
          showSort={true}
        />
      </main>
    </div>
  );
}