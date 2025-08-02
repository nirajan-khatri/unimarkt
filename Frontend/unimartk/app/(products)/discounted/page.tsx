import React from "react";
import { DiscountedProductsView } from "@/modules/products/ui/views/DiscountedProductsView";

export default function DiscountedProductsPage() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <main>
        <DiscountedProductsView 
          title="Discounted Products" 
          showSort={true} 
        />
      </main>
    </div>
  );
} 