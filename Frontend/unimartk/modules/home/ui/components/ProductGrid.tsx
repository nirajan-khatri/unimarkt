import { ProductCard } from "@/modules/home/ui/components/ProductCard";
import { Loader2 } from "lucide-react";

interface ProductGridProps {
  products: any[];
  isLoading: boolean;
  error: Error | null;
}

export function ProductGrid({ products, isLoading, error }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white/50 flex items-center justify-center z-50">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error.message}</div>;
  }

  if (!products.length) {
    return <div className="text-center py-12 text-gray-500">No results found</div>;
  }

  return (
    <div className="lg:col-span-4 xl:col-span-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
    </div>
  );
}