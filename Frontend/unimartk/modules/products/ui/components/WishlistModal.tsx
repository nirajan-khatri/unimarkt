import React, { useEffect, useState } from "react";
import { Wishlist } from "@/modules/products/types";
import { getUserWishlist, removeFromWishlist } from "@/services/products";
import { useAuth } from "@/modules/auth/contexts/authContext";
import { ProductCard } from "@/modules/home/ui/components/ProductCard";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WishlistModalProps {
  open: boolean;
  onClose: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({ open, onClose }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  const fetchWishlist = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserWishlist(user.id.toString());
      setWishlist(data);
    } catch (e) {
      // handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open && user) {
      fetchWishlist();
    }
    // eslint-disable-next-line
  }, [open, user]);

  const handleRemove = async (wishlistId: string) => {
    setRemoving(wishlistId);
    try {
      await removeFromWishlist(wishlistId);
      setWishlist((prev) => prev.filter((w) => w.id !== wishlistId));
    } catch (e) {
      // handle error
    }
    setRemoving(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full">
        <DialogTitle>My Wishlist</DialogTitle>
        {loading ? (
          <div className="py-8 text-center">Loading...</div>
        ) : wishlist.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No items in wishlist.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {wishlist.map((item) => (
              <div key={item.id} className="relative">
                <ProductCard product={item.product} />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item.id);
                  }}
                  disabled={removing === item.id}
                >
                  {removing === item.id ? "Removing..." : "Remove"}
                </Button>
              </div>
            ))}
          </div>
        )}
        <DialogClose asChild>
          <Button variant="outline" className="mt-4 w-full">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}; 