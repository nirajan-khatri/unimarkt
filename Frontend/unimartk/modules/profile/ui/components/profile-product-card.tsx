import { Badge } from "@/components/ui/badge";
import { Product } from "@/modules/products/types";
import { CheckCircle } from "lucide-react";
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
  return (
    <div
      className="border rounded-lg cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-lg"
      onClick={handleClick}
    >
      <div className="relative h-48 mb-4">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="rounded-t-lg object-cover"
        />
        <Badge
          className={`text-xs z-10 absolute right-2 top-2 ${getStatusColor(product.status.toLowerCase())}`}
        >
          {product.status === "approved" && (
            <CheckCircle className="w-3 h-3 mr-1" />
          )}
          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
        </Badge>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-blue-600 dark:text-blue-400 font-bold">
            €{product.price}
          </span>
          <span className="text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
            {product.category.name}
          </span>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          <p>Posted: {new Date(product.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};
