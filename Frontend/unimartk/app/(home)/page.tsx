import React from 'react';
import { ProductListView } from '@/modules/products/ui/views/ProductListView';

export default function Home() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <main>
        <ProductListView 
          title="Curated for you"
          showSort={true}
        />
      </main>
    </div>
  );
}