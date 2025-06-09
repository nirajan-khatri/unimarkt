import { ProductCard } from "@/modules/home/ui/components/ProductCard";
import { ProductGridSkeleton } from "@/components/skeletons/ProductSkeleton";

interface ProductGridProps {
  products: any[];
  isLoading: boolean;
  error: unknown | null;
}

export function ProductGrid({ products, isLoading, error }: ProductGridProps) {
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading products: {String(error)}</p>
      </div>
    );
  }

  if (isLoading) {
    return <ProductGridSkeleton />;
  }

  if (products.length === 0) {
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