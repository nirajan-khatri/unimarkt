"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/modules/products/types";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchDiscountedProducts } from "@/services/products";

export const DiscountCarousel = () => {
  const router = useRouter();

  const {
    data: discountedProducts,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["discountedProductsCarousel"],
    queryFn: () => fetchDiscountedProducts(),
  });

  console.log('Carousel data:', discountedProducts);
  console.log('Carousel loading:', productsLoading);
  console.log('Carousel error:', productsError);
  
  if (productsLoading) {
    return (
      <div className="px-4 lg:px-12 py-8">
        <div className="h-[400px] bg-gray-200 animate-pulse rounded-lg"></div>
      </div>
    );
  }
  
  if (productsError) {
    console.error('Carousel error:', productsError);
    return (
      <div className="px-4 lg:px-12 py-8">
        <div className="h-[400px] bg-red-100 rounded-lg flex items-center justify-center">
          <p className="text-red-600">Failed to load discounted products</p>
        </div>
      </div>
    );
  }
  
  if (!discountedProducts || discountedProducts.results.length === 0) {
    console.log('No discounted products found');
    return null;
  }

  return (
    <div className="relative">
      <Carousel
        opts={{ loop: true }}
        className="w-full mx-auto overflow-hidden"
      >
        <CarouselContent>
          {discountedProducts?.results?.map((product) => {
            const discountedPrice = (
              Number(product.price) *
              (1 - Number(product.discount) / 100)
            ).toFixed(2);

            return (
              <CarouselItem
                key={product.product_id}
                className="relative h-[400px] md:h-[600px] group"
              >
                {/* Background Image */}
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10" />

                {/* Top Right Button */}
                <div className="absolute top-6 right-6 z-30">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/discounted')}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold px-4 py-2 rounded-full text-sm"
                  >
                    View All Discounted
                  </Button>
                </div>

                {/* Content */}
                <div className="relative z-20 h-full flex flex-col justify-end p-6 sm:p-10 text-white">
                  <div className="mb-4 space-y-2 max-w-xl">
                    <h2 className="text-2xl sm:text-4xl font-bold">
                      {product.name}
                    </h2>
                    <p className="text-sm sm:text-base line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl sm:text-2xl font-semibold">
                      €{discountedPrice}
                    </span>
                    <span className="line-through text-sm text-gray-300">
                      €{Number(product.price).toFixed(2)}
                    </span>
                    <Badge className="bg-red-600 text-white">
                      -{product.discount}%
                    </Badge>
                  </div>

                  <Button
                    size="lg"
                    className="w-fit"
                    onClick={() =>
                      router.push(`/products/${product.product_id}`)
                    }
                  >
                    View Product
                  </Button>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious className="left-4 z-30" />
        <CarouselNext className="right-4 z-30" />
      </Carousel>
    </div>
  );
};
