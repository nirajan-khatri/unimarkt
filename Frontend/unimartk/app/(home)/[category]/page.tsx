"use client";

import React from 'react';
import { useParams } from "next/navigation";
import { ProductListView } from '@/modules/products/ui/views/ProductListView';

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <main>
        <ProductListView 
          category={category}
          showSort={true}
        />
      </main>
    </div>
  );
}