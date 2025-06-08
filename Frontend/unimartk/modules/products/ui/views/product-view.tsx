"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import {
  CheckIcon,
  LinkIcon,
  StarIcon,
  MapPinIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const data = {
  product_id: 12,
  name: "Macbook M3 Pro",
  category: {
    id: 1,
    name: "All",
    color: "#CCCCCC",
    slug: "all",
    category_id: null,
    subcategories: [],
  },
  sub_category: {
    id: 1,
    name: "Mobile Phones",
    color: null,
    slug: "mobile-phones",
    category_id: 2,
    subcategories: [],
  },
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec condimentum molestie posuere. Donec non odio id dui blandit tempor. Maecenas quam nibh, tempor quis sodales quis, maximus vitae est. Praesent dapibus vulputate tellus sit amet vehicula. Nunc posuere finibus turpis, sed congue erat dignissim a. Nulla suscipit, nibh ullamcorper hendrerit pellentesque, quam ipsum dictum ipsum, ut condimentum quam nunc id lacus. Nullam pulvinar eu nisl at sagittis. Morbi convallis mollis nulla, a gravida orci egestas in.",
  price: "1300",
  location: "Frankfurt",
  images: [
    "https://images.pexels.com/photos/31173368/pexels-photo-31173368/free-photo-of-colorful-facades-along-amsterdam-canal.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
    "https://images.pexels.com/photos/30675194/pexels-photo-30675194/free-photo-of-creative-watercolor-art-workspace-with-supplies.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
    "https://images.pexels.com/photos/29213973/pexels-photo-29213973/free-photo-of-picturesque-village-with-foggy-morning-landscape.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
    "https://images.pexels.com/photos/30973670/pexels-photo-30973670/free-photo-of-curious-ginger-kitten-in-wicker-basket.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
    "https://images.pexels.com/photos/32268896/pexels-photo-32268896/free-photo-of-charming-bookshop-exterior-in-clisson-france.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
    "https://images.pexels.com/photos/30563259/pexels-photo-30563259/free-photo-of-footprints-in-sand-beach-serenity.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
  ],
  user: {
    id: 1,
    name: "Alice Chan",
    email: "alice@example.com",
    contact_number: "1234567890",
    role: {
      id: 1,
      name: "admin",
    },
  },
  status: "Pending",
  created_at: "2025-06-06T14:22:54.484251Z",
  pickup_location: "Praesentium dolor eu",
};

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
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
        >
          <XIcon className="w-6 h-6" />
        </button>

        {/* Navigation buttons */}
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

        {/* Main image */}
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

        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Thumbnail strip */}
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

export const ProductView = ({ productId }: Props) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="px-4 lg:px-12 py-10">
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          <div className="">
            {/* Image Gallery */}
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row">
                {/* Main Image */}
                <div className="flex-1 order-2 sm:order-1">
                  <div
                    className="aspect-[4/3] sm:aspect-auto w-full h-full sm:max-h-[500px] bg-gray-200 relative cursor-pointer hover:scale-[1.02] transition-transform group"
                    onClick={openModal}
                  >
                    <Image
                      src={data.images[selectedImage]}
                      alt={data.name}
                      fill
                      className="object-cover "
                    />
                    {/* Click to view indicator */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                      Click to enlarge
                    </div>
                  </div>
                </div>

                {/* Thumbnail Strip */}
                <div className="w-full sm:w-20 bg-gray-100 order-1 sm:order-2">
                  <div className="flex sm:flex-col gap-2 p-2 overflow-x-none sm:overflow-none justify-between sm:justify-start">
                    {data.images.map((imageUrl, index) => (
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
              <div className="p-4 border-t flex flex-row justify-between items-center">
                <div className="">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                    {data.name}
                  </h2>
                  <div className="flex items-center gap-1 text-gray-600 mb-4">
                    <MapPinIcon className="w-4 h-4" />
                    <span className="text-sm">{data.location}</span>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
                    {data.price}€
                  </span>
                </div>
              </div>
              {/* Description */}
              <div className="p-4 sm:p-6 border-t">
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {data.description}
                </p>
              </div>
            </div>
            {/* Right Sidebar */}
            <div className="lg:w-80 flex justify-center items-center bg-gray-50 p-4 sm:p-6 border-t lg:border-l">
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white mb-6 py-3"
                onClick={() => {
                  const currentUrl = encodeURIComponent(
                    window.location.pathname + window.location.search
                  );
                  window.location.href = `/sign-in?redirect=${currentUrl}`;
                }}
              >
                Log in to contact Seller
              </Button>
              {/* Additional content can go here */}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        images={data.images}
        currentIndex={selectedImage}
        onIndexChange={setSelectedImage}
      />
    </>
  );
};
export const ProductViewSkeleton = () => {
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
