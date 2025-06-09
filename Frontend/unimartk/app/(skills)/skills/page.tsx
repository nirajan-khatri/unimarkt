"use client";

import React, { useState } from 'react';
import { useSearchParams } from "next/navigation";
import { ServiceListView } from '@/modules/skills/ui/components/ServicesListView';
import { useServices } from '@/hooks/useServices';

export default function SkillsPage() {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  
  const search = searchParams.get("search") || "";
  
  const { data, isLoading, error } = useServices(
    currentPage,
    search,
    undefined,
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
          title="All Skills"
          showSort={true}
        />
      </main>
    </div>
  );
}