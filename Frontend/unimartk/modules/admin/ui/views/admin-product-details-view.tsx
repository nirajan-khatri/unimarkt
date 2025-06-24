"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Trash2Icon,
  CheckIcon,
  User,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";

import { approveProduct, deleteProduct, fetchProductById } from "../../api";
import { cn, sendAdminMessage } from "@/lib/utils";
import CommentDialog from "../components/comment-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const images = [
  "https://images.pexels.com/photos/31173368/pexels-photo-31173368/free-photo-of-colorful-facades-along-amsterdam-canal.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
  "https://images.pexels.com/photos/30675194/pexels-photo-30675194/free-photo-of-creative-watercolor-art-workspace-with-supplies.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
  "https://images.pexels.com/photos/29213973/pexels-photo-29213973/free-photo-of-picturesque-village-with-foggy-morning-landscape.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
  "https://images.pexels.com/photos/30973670/pexels-photo-30973670/free-photo-of-curious-ginger-kitten-in-wicker-basket.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
  "https://images.pexels.com/photos/32268896/pexels-photo-32268896/free-photo-of-charming-bookshop-exterior-in-clisson-france.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
  "https://images.pexels.com/photos/30563259/pexels-photo-30563259/free-photo-of-footprints-in-sand-beach-serenity.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
];

interface Props {
  productId: string;
}

const ImageModal = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}) => {
  if (!isOpen) return null;

  const nextImage = () => {
    onIndexChange((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    onIndexChange(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="relative w-full h-full max-w-4xl max-h-4xl mx-4 my-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
        >
          <XIcon className="w-6 h-6" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            prevImage();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            nextImage();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>

        <div
          className="relative w-full h-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative max-w-full max-h-full">
            <Image
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              width={800}
              height={600}
              className="object-contain max-w-full max-h-full"
            />
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>

        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                onIndexChange(index);
              }}
              className={`flex-shrink-0 w-16 h-12 relative rounded overflow-hidden border-2 transition-colors ${
                index === currentIndex
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ProductDetailsView = ({ productId }: Props) => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dialogType, setDialogType] = React.useState<
    "reject" | "delete" | null
  >(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [comment, setComment] = React.useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data, error, isLoading } = useSuspenseQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId),
  });

  const queryClient = useQueryClient();

  const approveProductMutation = useMutation({
    mutationFn: approveProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      toast.success("Product approved successfully!");
    },
    onError: (error) => {
      toast.error("Failed to approve product. Please try again.");
      console.error("Approval error:", error);
    },
  });

  const rejectProductMutation = useMutation({
    mutationFn: async ({
      productId,
      comment,
    }: {
      productId: string;
      comment: string;
    }) => {
      const userId = data.user.id;
      await approveProduct({ productId, data: { status: "rejected" } });
      await sendAdminMessage(userId, comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      setDialogOpen(false);
      setComment("");
      toast.success("Product rejected successfully!");
    },
    onError: (error) => {
      toast.error("Failed to reject product. Please try again.");
      console.error("Rejection error:", error);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async ({
      productId,
      comment,
    }: {
      productId: string;
      comment: string;
    }) => {
      const userId = data.user.id;
      await deleteProduct(productId);
      await sendAdminMessage(userId, comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      setDialogOpen(false);
      setComment("");
      toast.success("Product deleted successfully!");
      router.push("/admin/products");
    },
    onError: (error) => {
      toast.error("Failed to delete product. Please try again.");
      console.error("Deletion error:", error);
    },
  });

  const handleApprove = () => {
    approveProductMutation.mutate({
      productId,
      data: { status: "approved" },
    });
  };

  const handleReject = () => {
    setDialogType("reject");
    setDialogOpen(true);
  };

  const handleDelete = () => {
    setDialogType("delete");
    setDialogOpen(true);
  };

  const showApproveButton = data?.status !== "approved";
  const showRejectButton = data?.status !== "rejected";

  const getStatusBadge = (status: string) => {
    return (
      <Badge
        className={cn(
          "px-3 py-1 text-sm font-medium uppercase",
          status === "pending" &&
            "bg-orange-100 border-orange-300 text-orange-700 hover:bg-orange-200",
          status === "rejected" &&
            "bg-red-100 border-red-300 text-red-700 hover:bg-red-200",
          status === "approved" &&
            "bg-green-100 border-green-300 text-green-700 hover:bg-green-200"
        )}
      >
        {status}
      </Badge>
    );
  };

  return (
    <>
      <div className="px-4 lg:px-12 py-10">
        <div className="flex items-center gap-4 mb-6 justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          {data?.status && getStatusBadge(data.status)}
        </div>
        <div className="bg-background text-foreground rounded-lg overflow-hidden shadow-sm border">
          <div className="">
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row">
                <div className="flex-1 order-2 sm:order-1 overflow-hidden">
                  <div
                    className="aspect-[4/3] sm:aspect-auto w-full h-full sm:max-h-[500px] bg-gray-200 relative cursor-pointer hover:scale-[1.02] transition-transform group"
                    onClick={openModal}
                  >
                    <Image
                      src={images[selectedImage]}
                      alt={data.name}
                      fill
                      className="object-cover "
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                      Click to enlarge
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-20 bg-gray-100 order-1 sm:order-2">
                  <div className="flex sm:flex-col gap-2 p-2 overflow-x-none sm:overflow-none justify-between sm:justify-start">
                    {images.map((imageUrl, index) => (
                      <div
                        key={index}
                        className={`
                          flex-shrink-0 w-16 h-16 sm:w-full sm:aspect-square 
                          bg-gray-200 relative cursor-pointer hover:opacity-80 
                          transition-opacity rounded-sm overflow-hidden
                          ${selectedImage === index ? "ring-2 ring-blue-500" : "border border-gray-300"}
                        `}
                        onClick={() => setSelectedImage(index)}
                      >
                        <Image
                          src={imageUrl}
                          alt={`${data.name} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            <div className="flex-1">
              <div className="p-4 border-t border-border flex flex-row justify-between items-center">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                    {data.name}
                  </h2>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{data.pickup_location}</span>
                  </div>
                </div>
                <div className="mb-4 text-xl sm:text-2xl font-bold">
                  {data.price}€
                </div>
              </div>
              {data?.user && (
                <div className="p-4 sm:p-6 border-t border-border">
                  <h3 className="text-lg font-semibold mb-3">Product Owner</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {data.user.name?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{data.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {data.user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="p-4 sm:p-6 border-t border-border">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {data?.description || "No description provided"}
                </p>
              </div>
              <div className="flex flex-row gap-2 mt-4 justify-end items-center w-full p-4 border-t border-border bg-gray-50">
                <Button
                  variant="outline"
                  className="flex flex-row gap-2 hover:bg-red-50 hover:border-red-300"
                  onClick={handleDelete}
                  disabled={deleteProductMutation.isPending}
                >
                  <Trash2Icon className="w-4 h-4 text-red-500" />
                  {deleteProductMutation.isPending ? "Deleting..." : "Delete"}
                </Button>

                <Button
                  variant="destructive"
                  className="flex flex-row gap-2"
                  onClick={handleReject}
                  disabled={
                    !showRejectButton || rejectProductMutation.isPending
                  }
                >
                  <XIcon className="w-4 h-4" />
                  {rejectProductMutation.isPending ? "Rejecting..." : "Reject"}
                </Button>

                <Button
                  variant="default"
                  className="flex flex-row gap-2 bg-green-600 hover:bg-green-700"
                  onClick={handleApprove}
                  disabled={
                    !showApproveButton || approveProductMutation.isPending
                  }
                >
                  <CheckIcon className="w-4 h-4" />
                  {approveProductMutation.isPending
                    ? "Approving..."
                    : "Approve"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        images={images}
        currentIndex={selectedImage}
        onIndexChange={setSelectedImage}
      />

      <CommentDialog
        listingType="product"
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        dialogType={dialogType}
        selectedId={productId}
        comment={comment}
        setComment={setComment}
        rejectMutation={rejectProductMutation}
        deleteMutation={deleteProductMutation}
      />
    </>
  );
};

export const ProductDetailsViewSkeleton = () => {
  return (
    <div className="px-4 lg:px-12 py-10">
      <div className="border rounded-sm bg-white overflow-hidden">
        <div className="relative aspect-[3.9] border-b">
          <Image
            alt={"Placeholder"}
            src={"/placeholder.jpg"}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};
