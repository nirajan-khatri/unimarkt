import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/modules/products/types";
import { Calendar, MapPin, ShoppingBag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/products/${product.product_id}`);
  };

  const price = product.price ? parseFloat(product.price) : 299.99;

  return (
    <Card
      className="group bg-white gap-0 rounded-xl py-0 shadow-sm border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col"
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-white/90 text-gray-700 border-0 font-medium backdrop-blur-sm shadow-sm">
            {product.category?.name || 'Electronics'}
          </Badge>
        </div>

        {/* Price Badge - Floating */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/95 px-3 py-1.5 rounded-lg shadow-md backdrop-blur-sm border border-white/20">
            <span className="text-lg font-bold text-gray-900">
              €{price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <CardContent className="p-5 flex flex-col flex-grow">
        {/* Header Section */}
        <div className="">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 leading-tight min-h-[1.5rem]">
            {product.name || 'Sample Product'}
          </h3>
        </div>

        {/* Description - Fixed height */}
        <div className="mb-4 flex-grow">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 h-[2.5rem] overflow-hidden">
            {product.description || 'High-quality product with excellent features and modern design. Perfect for everyday use with premium materials.'}
          </p>
        </div>

        {/* Details Section */}
        <div className="space-y-3 mb-4">
          {/* Location Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin size={14} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm">Pickup Location</p>
              <p className="text-xs text-gray-600 truncate">{product.pickup_location || 'Amsterdam, Netherlands'}</p>
            </div>
          </div>

          {/* Date Section */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Calendar size={14} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm">Listed</p>
              <p className="text-xs text-gray-600">
                {product.created_at
                  ? new Date(product.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                  : 'Dec 24, 2024'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Action Button - Fixed at bottom */}
        <div className="mt-auto">
          <Button
            size="lg"
            className="w-full font-medium bg-gray-800 hover:bg-gray-900 text-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ShoppingBag size={16} className="mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};