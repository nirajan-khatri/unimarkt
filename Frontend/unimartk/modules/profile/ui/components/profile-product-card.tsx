import { Badge } from "@/components/ui/badge";
import { Product } from "@/modules/products/types";
import { CheckCircle, Calendar, MapPin, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const ProfileProductCard = ({ product }: { product: Product }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/profile/products/${product.product_id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const price = product.price ? parseFloat(String(product.price)) : 299.99;

  return (
    <Card
      className="group bg-card text-foreground gap-0 rounded-xl py-0 shadow-sm border border-border overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col"
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative h-48 bg-muted overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 rounded-t-xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category and Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
          {/* Status Pill */}
          <Badge className={`text-xs font-medium ${getStatusColor(product.status.toLowerCase())}`}
            >
            {product.status === "approved" && (
              <CheckCircle className="w-3 h-3 mr-1 inline" />
            )}
            {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
          </Badge>
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          <Badge className="bg-card text-foreground border-0 font-medium backdrop-blur-sm shadow-sm">
            {product.category?.name || 'Electronics'}
          </Badge>
        </div>

        {/* Price Badge - Floating */}
        <div className="bg-card px-3 py-1.5 rounded-lg shadow-md backdrop-blur-sm border border-border">
          <span className="text-lg font-bold text-foreground">
            €{price.toFixed(2)}
          </span>
        </div>
      </div>

      <CardContent className="p-5 flex flex-col flex-grow">
        {/* Header Section */}
        <div className="">
          <h3 className="text-lg font-bold text-foreground line-clamp-1 leading-tight min-h-[1.5rem]">
            {product.name || 'Sample Product'}
          </h3>
        </div>

        {/* Description - Fixed height */}
        <div className="mb-4 flex-grow">
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 h-[2.5rem] overflow-hidden">
            {product.description || 'High-quality product with excellent features and modern design. Perfect for everyday use with premium materials.'}
          </p>
        </div>

        {/* Details Section */}
        {/* Location Info */}
        <div className="flex items-center gap-3 p-3 bg-muted border border-border rounded-lg">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <MapPin size={14} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground text-sm">Pickup Location</p>
            <p className="text-xs text-muted-foreground truncate">{product.pickup_location || 'Amsterdam, Netherlands'}</p>
          </div>
        </div>

        {/* Date Section */}
        <div className="flex items-center gap-3 p-3 bg-muted border border-border rounded-lg">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <Calendar size={14} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground text-sm">Listed</p>
            <p className="text-xs text-muted-foreground">
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
      </CardContent>
    </Card>
  );
};
