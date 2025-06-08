"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "@/services/products";

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id as string;

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center text-red-500">
        Error loading product details
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        Product not found
      </div>
    );
  }

  return (
    <div>
      <h1>Product Details: {productId}</h1>
    </div>
  );
} 