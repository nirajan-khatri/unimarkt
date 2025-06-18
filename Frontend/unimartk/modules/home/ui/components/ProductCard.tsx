import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/modules/products/types";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/products/${product.product_id}`);
  };

  return (
    <div 
      className="border rounded-lg cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-lg"
      onClick={handleClick}
    >
      <div className="relative h-48 mb-4">
        <Image
          src={"/placeholder.jpg"}
          alt={product.name}
          fill
          className="rounded-t-lg object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-blue-600 dark:text-blue-400 font-bold">
            €{parseFloat(product.price).toFixed(2)}
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
