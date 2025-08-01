import React from "react";
import { ProductListView } from "@/modules/products/ui/views/ProductListView";
import { DiscountCarousel } from "@/components/discount-carausel";

export default function Home() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <main>
        <DiscountCarousel />
        <ProductListView title="Curated for you" showSort={true} />
      </main>
    </div>
  );
}
