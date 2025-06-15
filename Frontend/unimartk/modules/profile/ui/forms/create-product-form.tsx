import React, { useMemo, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { productSchema } from "../../schemas";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { Button } from "../../../../components/ui/button";
import { Loader2, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

import { Category } from "@/modules/home/types";
import LoadingPage from "@/app/(admin)/admin/loader";
import ErrorPage from "@/app/(admin)/admin/error";
import {
  fetchproductCategories,
  fetchProductSubcategories,
} from "@/modules/home/api";

const uploadImageToAWS = async (file: File): Promise<string> => {
  // Simulate upload delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 2000)
  );

  // In a real implementation, you would:
  // 1. Get pre-signed URL from your backend
  // 2. Upload file to S3 using the pre-signed URL
  // 3. Return the public URL of the uploaded image

  // For now, return a dummy URL based on the file name
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(7);
  return `https://your-bucket.s3.amazonaws.com/products/${timestamp}-${randomId}-${file.name}`;
};

const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file) => uploadImageToAWS(file));
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw new Error("Failed to upload one or more images");
  }
};

type ProductFormData = z.infer<typeof productSchema>;

const CreateProductForm = () => {
  const [uploadingImages, setUploadingImages] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category_id: "",
      sub_category_id: "",
      description: "",
      pickup_location: "",
      price: "",
      images: [],
    },
  });

  const {
    data: categoryData,
    isLoading: categoryIsLoading,
    error: categoryError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchproductCategories,
  });

  const {
    data: subCategoryData,
    isLoading: subCategoryIsLoading,
    error: subCategoryError,
  } = useQuery({
    queryKey: ["subCategories"],
    queryFn: fetchProductSubcategories,
  });

  const mutation = useMutation({
    mutationFn: (newProduct: ProductFormData) => {
      return axios.post("/products/", newProduct);
    },
    onError: () => {
      // An error happened!
      toast.error("Something went wrong!");
    },
    onSuccess: () => {
      toast.success("Product created successfully!");
      window.location.href = "/";
    },
  });

  const filteredSubcategories = useMemo(() => {
    return (subCategoryData || []).filter(
      (subCategory: Category) =>
        subCategory.category_id?.toString() === form.getValues("category_id")
    );
  }, [form.watch("category_id")]);

  if (categoryIsLoading || subCategoryIsLoading) {
    return <LoadingPage />;
  }

  if (categoryError || subCategoryError) {
    return <ErrorPage />;
  }

  const handleFiles = async (newFiles: FileList | null) => {
    if (!newFiles) return;

    const filesArray = Array.from(newFiles);
    const currentImages = form.getValues("images") || [];
    const currentPreviews = previewImages;

    // Check if total would exceed 6
    if (currentImages.length + filesArray.length > 6) {
      toast.error("You can upload a maximum of 6 images.");
      return;
    }

    // Create preview URLs for immediate display
    const newPreviewUrls = filesArray.map((file) => URL.createObjectURL(file));
    setPreviewImages([...currentPreviews, ...newPreviewUrls]);

    try {
      setUploadingImages(true);
      toast.message("Uploading images...");

      // Upload files to AWS
      const uploadedUrls = await uploadMultipleImages(filesArray);

      // Update form with the uploaded URLs
      const updatedImages = [...currentImages, ...uploadedUrls];
      form.setValue("images", updatedImages, { shouldValidate: true });

      toast.success(`Successfully uploaded ${filesArray.length} image(s)`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload images. Please try again.");

      // Remove preview URLs on error
      setPreviewImages(currentPreviews);
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images") || [];
    const updatedImages = [...currentImages];
    updatedImages.splice(index, 1);
    form.setValue("images", updatedImages, { shouldValidate: true });

    // Also remove from preview
    const updatedPreviews = [...previewImages];
    if (updatedPreviews[index]) {
      URL.revokeObjectURL(updatedPreviews[index]);
      updatedPreviews.splice(index, 1);
      setPreviewImages(updatedPreviews);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const payload = {
        ...data,
        price: data.price,
        user_id: "1",
        category_id: data.category_id,
        sub_category_id: data.sub_category_id,
        images: data.images || [], // Array of AWS S3 URLs
      };

      console.log("Submitting payload:", payload);
      mutation.mutate(payload);

      // Clean up preview URLs
      previewImages.forEach((url) => URL.revokeObjectURL(url));
      setPreviewImages([]);

      form.reset();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to submit product");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          {/* Product Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <div className="flex gap-3">
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Category </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryData &&
                        categoryData.slice(1).map((category: Category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sub Category */}
            <FormField
              control={form.control}
              name="sub_category_id"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Sub Category </FormLabel>
                  <Select
                    disabled={form.watch("category_id") === ""}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sub category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredSubcategories.map((subCategory: Category) => (
                        <SelectItem
                          key={subCategory.id}
                          value={subCategory.id.toString()}
                        >
                          {subCategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price </FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      €
                    </span>
                    <Input
                      type="text"
                      placeholder="0.00"
                      {...field}
                      className="pl-7"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pickup_location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location (City)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="images"
            render={() => {
              const inputRef = useRef<HTMLInputElement>(null);
              const [isDragging, setIsDragging] = useState(false);

              return (
                <FormItem>
                  <FormLabel>Upload Images (up to 6)</FormLabel>
                  <FormControl>
                    <div>
                      {/* Hidden file input */}
                      <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFiles(e.target.files)}
                        disabled={uploadingImages}
                      />

                      {/* Dropzone Box */}
                      <div
                        className={cn(
                          "flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer text-center transition",
                          isDragging
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:bg-gray-50",
                          uploadingImages && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() =>
                          !uploadingImages && inputRef.current?.click()
                        }
                        onDragOver={(e) => {
                          e.preventDefault();
                          if (!uploadingImages) setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          if (!uploadingImages) {
                            handleFiles(e.dataTransfer.files);
                          }
                        }}
                      >
                        {uploadingImages ? (
                          <>
                            <Loader2 className="w-8 h-8 text-blue-500 mb-2 animate-spin" />
                            <p className="text-sm text-gray-600">
                              Uploading images...
                            </p>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-8 h-8 text-gray-500 mb-2" />
                            <p className="text-sm text-gray-600">
                              Drag and drop files here or{" "}
                              <span className="text-blue-600 underline">
                                choose files
                              </span>
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Max 6 images
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />

                  {/* Image Preview */}
                  {previewImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {previewImages.map((previewUrl, index) => {
                        const isUploaded = form.getValues("images")?.[index];

                        return (
                          <div
                            className="relative border rounded-md overflow-hidden group"
                            key={index}
                          >
                            <img
                              src={previewUrl}
                              alt={`preview-${index}`}
                              className={cn(
                                "w-full h-32 object-cover transition-opacity",
                                !isUploaded && uploadingImages && "opacity-50"
                              )}
                            />

                            {/* Upload status indicator */}
                            {!isUploaded && uploadingImages && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                              </div>
                            )}

                            {/* Success indicator */}
                            {isUploaded && (
                              <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                ✓
                              </div>
                            )}

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              disabled={uploadingImages}
                              className={cn(
                                "absolute top-1 right-1 bg-white/80 text-black text-xs px-2 py-1 rounded hover:bg-red-600 hover:text-white transition",
                                uploadingImages &&
                                  "opacity-50 cursor-not-allowed"
                              )}
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </FormItem>
              );
            }}
          />

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || uploadingImages}
              className="flex-1"
            >
              {form.formState.isSubmitting
                ? "Creating Product..."
                : "Create Product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              className="flex-1"
            >
              Reset Form
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CreateProductForm;
