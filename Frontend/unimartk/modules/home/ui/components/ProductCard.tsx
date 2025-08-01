"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/modules/products/types";
import { Calendar, MapPin, ShoppingBag, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/modules/auth/contexts/authContext";
import { useEffect, useState } from "react";
import {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
} from "@/services/products";
import { Wishlist } from "@/modules/products/types";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [wishlistId, setWishlistId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
      try {
        const data: Wishlist[] = await getUserWishlist(String(user.id));
        const found = data.find(
          (w) => w.product.product_id === product.product_id
        );
        setWishlistId(found ? String(found.id) : null);
      } catch (e) {
        setWishlistId(null);
      }
    };
    fetchWishlist();
    // eslint-disable-next-line
  }, [user, product.product_id]);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    setLoading(true);
    try {
      if (wishlistId) {
        await removeFromWishlist(String(wishlistId));
        setWishlistId(null);
      } else {
        const res = await addToWishlist(
          String(user.id),
          String(product.product_id)
        );
        setWishlistId(String(res.id));
      }
    } catch (e) {}
    setLoading(false);
  };

  const handleClick = () => {
    router.push(`/products/${product.product_id}`);
  };

  const price = product.price ? parseFloat(product.price.toString()) : 299.99;

  return (
    <Card
      className="group bg-white dark:bg-accent dard:text-white gap-0 rounded-xl py-0 shadow-sm border border-border overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col"
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden group">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Badge */}
        <div className="absolute top-3 right-3 flex gap-2 items-center z-10">
          <Badge className="bg-white/90 text-gray-700 dark:bg-accent dark:text-white border-0 font-medium backdrop-blur-sm shadow-sm">
            {product.category?.name || "Electronics"}
          </Badge>
          {user && (
            <button
              className="ml-2 p-1 rounded-full bg-white/80 hover:bg-white shadow"
              onClick={handleWishlist}
              disabled={loading}
              aria-label={
                wishlistId ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              <Heart
                size={22}
                className={
                  wishlistId ? "text-red-500 fill-red-500" : "text-gray-400"
                }
                fill={wishlistId ? "#ef4444" : "none"}
              />
            </button>
          )}
        </div>

        {/* Price Section */}
        <div className="absolute bottom-3 left-3 z-10 flex items-end gap-2">
          <div className="bg-white/95 dark:bg-accent px-3 py-1.5 rounded-lg shadow-md backdrop-blur-sm border border-border">
            {product.discount ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="text-sm line-through text-gray-500">
                  €{price.toFixed(2)}
                </span>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                  €{(price * (1 - product.discount / 100)).toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                €{price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Discount badge */}
          {product.discount && (
            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded shadow-md font-medium">
              -{product.discount}%
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-5 flex flex-col flex-grow">
        {/* Header Section */}
        <div className="">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 leading-tight min-h-[1.5rem]">
            {product.name || "Sample Product"}
          </h3>
        </div>

        {/* Description - Fixed height */}
        <div className="mb-4 flex-grow">
          <p className="text-gray-600 dark:text-white/80 text-sm leading-relaxed line-clamp-2 h-[2.5rem] overflow-hidden">
            {product.description ||
              "High-quality product with excellent features and modern design. Perfect for everyday use with premium materials."}
          </p>
        </div>

        {/* Details Section */}
        <div className="space-y-3 mb-4">
          {/* Location Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-accent border border-border rounded-lg">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin size={14} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white text-sm">
                Pickup Location
              </p>
              <p className="text-xs text-gray-600 dark:text-white/90 truncate">
                {product.pickup_location || "Amsterdam, Netherlands"}
              </p>
            </div>
          </div>

          {/* Date Section */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-border dark:bg-accent">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Calendar size={14} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white text-sm">
                Listed
              </p>
              <p className="text-xs text-gray-600 dark:text-white/90">
                {product.created_at
                  ? new Date(product.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Dec 24, 2024"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button - Fixed at bottom */}
        <div className="mt-auto">
          <Button
            size="lg"
            className="w-full font-medium bg-primary text-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ShoppingBag size={16} className="mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
