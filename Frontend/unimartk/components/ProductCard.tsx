import Image from "next/image";

export const ProductCard = ({ product }: { product: any }) => (
  <div className="border rounded-lg p-4 bg-white dark:bg-slate-800">
    {product.images?.length > 0 && (
      <div className="relative h-48 mb-4">
        <Image
          src={`/${product.images[0]}`}
          alt={product.name}
          fill
          className="rounded-lg object-cover"
        />
      </div>
    )}
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
      <p>Seller: {product.user.name}</p>
      <p>Posted: {new Date(product.created_at).toLocaleDateString()}</p>
    </div>
  </div>
);