import { ProductCard } from "@/modules/home/ui/components/ProductCard";
import { ProductGridSkeleton } from "@/components/skeletons/ProductSkeleton";
import { Product } from "@/modules/products/types";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
}

export function ProductGrid({ products, isLoading, error }: ProductGridProps) {
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading products: {error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return <ProductGridSkeleton />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.product_id} product={product} />
      ))}
    </div>
  );
}