"use client";

import React, { useEffect, useState } from "react";
import { Wishlist } from "@/modules/products/types";
import { getUserWishlist, removeFromWishlist } from "@/services/products";
import { useAuth } from "@/modules/auth/contexts/authContext";
import { ProductCard } from "@/modules/home/ui/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Heart, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Trash2, 
  ShoppingBag,
  Calendar,
  Euro,
  X
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WishlistView: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState<string | number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "price" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchWishlist = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserWishlist(String(user.id));
      setWishlist(data);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
    // eslint-disable-next-line
  }, [user]);

  const handleRemove = async (wishlistId: string | number) => {
    setRemoving(wishlistId);
    try {
      await removeFromWishlist(String(wishlistId));
      setWishlist((prev) => prev.filter((item) => item.id !== wishlistId));
    } catch (e) {}
    setRemoving(null);
  };

  // Filter and sort wishlist
  const filteredAndSortedWishlist = wishlist
    .filter((item) => {
      const matchesSearch = 
        item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product.category?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || item.product.category?.name === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case "price":
          comparison = Number(a.product.price) - Number(b.product.price);
          break;
        case "name":
          comparison = a.product.name.localeCompare(b.product.name);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Calculate stats
  const totalItems = wishlist.length;
  const totalValue = wishlist.reduce((sum, item) => sum + Number(item.product.price), 0);
  const categories = [...new Set(wishlist.map(item => item.product.category?.name).filter(Boolean))];

  // Calculate filtered stats
  const filteredItems = wishlist.filter((item) => {
    const matchesSearch = 
      item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.category?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || item.product.category?.name === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const filteredTotalValue = filteredItems.reduce((sum, item) => sum + Number(item.product.price), 0);

  if (!isAuthenticated) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Sign in to view your wishlist</h2>
            <p className="text-gray-500 mb-6">Create an account or sign in to start building your wishlist</p>
            <Button>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="h-8 w-8 text-pink-500" />
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <Badge variant="secondary" className="ml-2">
            {totalItems} items
          </Badge>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Total Items</p>
                  <p className="text-2xl font-bold">{totalItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Euro className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Total Value</p>
                  <p className="text-2xl font-bold">€{filteredTotalValue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by category:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search your wishlist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(value: "date" | "price" | "name") => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your wishlist...</p>
        </div>
      ) : filteredAndSortedWishlist.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {searchTerm || selectedCategory ? "No items found" : "Your wishlist is empty"}
            </h2>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedCategory
                ? "Try adjusting your search terms or category filter" 
                : "Start browsing products and add them to your wishlist"
              }
            </p>
            {!searchTerm && !selectedCategory && (
              <Button asChild>
                <a href="/">Browse Products</a>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedWishlist.map((item) => (
            <div key={item.id} className="relative group">
              <ProductCard product={item.product} />
              
              {/* Remove Button */}
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(item.id)}
                disabled={removing === item.id}
              >
                {removing === item.id ? (
                  "Removing..."
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </>
                )}
              </Button>
              
              {/* Added Date Badge */}
              <div className="absolute top-2 left-2 z-10">
                <Badge variant="secondary" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(item.created_at).toLocaleDateString()}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistView; 