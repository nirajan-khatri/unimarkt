"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import {
  MapPinIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

import { fetchProductById } from "@/services/products";

const images = [
  "https://images.pexels.com/photos/31173368/pexels-photo-31173368/free-photo-of-colorful-facades-along-amsterdam-canal.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
  "https://images.pexels.com/photos/30675194/pexels-photo-30675194/free-photo-of-creative-watercolor-art-workspace-with-supplies.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
  "https://images.pexels.com/photos/29213973/pexels-photo-29213973/free-photo-of-picturesque-village-with-foggy-morning-landscape.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
  "https://images.pexels.com/photos/30973670/pexels-photo-30973670/free-photo-of-curious-ginger-kitten-in-wicker-basket.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
  "https://images.pexels.com/photos/32268896/pexels-photo-32268896/free-photo-of-charming-bookshop-exterior-in-clisson-france.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
  "https://images.pexels.com/photos/30563259/pexels-photo-30563259/free-photo-of-footprints-in-sand-beach-serenity.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
];
import ProductMessageWindow from "../components/messaging-window";
import { useAuth } from "@/modules/auth/contexts/authContext"; // Updated import

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
  const { isAuthenticated, user, isInitialized } = useAuth();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data, error, isLoading } = useSuspenseQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId),
  });

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
                      src={images[selectedImage]}
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
              <div className="p-4 border-t flex flex-row justify-between items-center">
                <div className="">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                    {data.name}
                  </h2>
                  <div className="flex items-center gap-1 text-gray-600 mb-4">
                    <MapPinIcon className="w-4 h-4" />
                    <span className="text-sm">{data.pickup_location}</span>
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
            <div className="flex w-full lg:w-80 justify-center items-center bg-gray-50 p-2 sm:p-4 border-t lg:border-l">
              {!isInitialized ? (
                // Loading state while auth is initializing
                <div className="text-center w-full">
                  <div className="animate-pulse">
                    <div className="bg-gray-300 rounded-lg h-48 w-full mb-4"></div>
                    <div className="bg-gray-300 rounded h-4 w-3/4 mx-auto mb-2"></div>
                    <div className="bg-gray-300 rounded h-4 w-1/2 mx-auto"></div>
                  </div>
                </div>
              ) : isAuthenticated && user ? (
                // Authenticated User View
                <ProductMessageWindow
                  senderId={user.id.toString()}
                  receiverId={data.user.id.toString()}
                  productName={data.name}
                  sellerName={data.user.name}
                />
              ) : (
                // Non-authenticated User View
                <div className="text-center">
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Contact the Seller
                    </h3>
                    <p className="text-sm text-gray-600">
                      Sign in to send messages and get contact details
                    </p>
                  </div>

                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors mb-4">
                    Log in to Contact Seller
                  </button>

                  <p className="text-xs text-gray-500">
                    By signing in, you can message sellers directly and access
                    their contact information
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        images={images}
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
