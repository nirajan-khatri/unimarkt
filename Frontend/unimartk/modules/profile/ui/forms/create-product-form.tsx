"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { Button } from "../../../../components/ui/button";
import { ArrowLeft, Loader2, UploadCloud, Sparkles } from "lucide-react";
import { cn, uploadToS3 } from "@/lib/utils";

import { Category } from "@/modules/home/types";
import LoadingPage from "@/app/(admin)/admin/loader";
import ErrorPage from "@/app/(admin)/admin/error";
import {
  fetchproductCategories,
  fetchProductSubcategories,
} from "@/modules/home/api";
import { useAuth } from "@/modules/auth/contexts/authContext";
import { redirect, useRouter } from "next/navigation";
import { Product } from "@/modules/products/types";
import { fetchProductById } from "@/services/products";

interface Props {
  productId?: string;
}

const uploadImageToAWS = async (file: File): Promise<string> => {
  const url = await uploadToS3(file);
  return url;
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

// AI Description Generation Hook
const useAIDescriptionGeneration = () => {
  return useMutation({
    mutationFn: async ({
      productName,
      categoryName,
      subCategoryName,
      keyFeatures,
    }: {
      productName: string;
      categoryName: string;
      subCategoryName: string;
      keyFeatures: string;
    }) => {
      const prompt = `Start the description with "I am selling". Then, write a product description in simple, clear English, easy for anyone to understand. Maintain a helpful and personal tone. Do not use overly casual or overly friendly language, and avoid any introductory or concluding remarks (except for "I am selling..."). Just provide the description.
        Product Name: ${productName || 'A fantastic product'}
        Category: ${categoryName}
        Subcategory: ${subCategoryName}
        Key Features: ${keyFeatures || 'No specific features provided. Highlight general benefits.'}
        Focus on the practical benefits and unique aspects for the user. Keep it around 150-250 words.`;

      const chatHistory = [{ role: 'user', parts: [{ text: prompt }] }];
      const payload = { contents: chatHistory };
      
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyAkWbT_GM0CdAb13rMdfU_UcSmFharCOCs";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        return result.candidates[0].content.parts[0].text;
      } else {
        throw new Error('No description generated. The AI might have encountered an issue.');
      }
    },
    onError: (error) => {
      console.error('Error generating description:', error);
      toast.error(`Failed to generate description: ${error.message}`);
    },
    onSuccess: () => {
      toast.success('AI description generated successfully!');
    },
  });
};

const CreateProductForm = ({ productId }: Props) => {
  const router = useRouter();
  const { isAuthenticated, user, isInitialized } = useAuth();
  const [uploadingImages, setUploadingImages] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [keyFeatures, setKeyFeatures] = useState("");

  if (!isAuthenticated) {
    redirect("/sign-in");
  }

  const queryClient = useQueryClient();

  // AI Description Generation
  const aiDescriptionMutation = useAIDescriptionGeneration();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId!),
    enabled: !!productId,
  });

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

  // Update form and preview images when product data is loaded
  useEffect(() => {
    if (product) {
      form.reset({
        name: product?.name || "",
        description: product?.description || "",
        images: product?.images || [],
        price: product?.price || "",
        pickup_location: product?.pickup_location || "",
        category_id: product?.category?.id?.toString() || "",
        sub_category_id: product?.sub_category?.id?.toString() || "",
      });

      setPreviewImages(product?.images || []);
    }
  }, [product, form]);

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
      if (productId) {
        return axios.put(`/products/${productId}/`, newProduct);
      }
      return axios.post("/products/", newProduct);
    },
    onError: () => {
      toast.error("Something went wrong!");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product", "profileProducts"],
      });

      toast.success(
        productId
          ? "Product updated successfully!"
          : "Product created successfully!"
      );
      window.location.href = "/";
    },
  });

  const filteredSubcategories = useMemo(() => {
    return (subCategoryData || []).filter(
      (subCategory: Category) =>
        subCategory.category_id?.toString() === form.watch("category_id")
    );
  }, [subCategoryData, form.watch("category_id")]);

  // AI Description Generation Handler
  const handleGenerateDescription = async () => {
    const productName = form.getValues("name");
    const categoryId = form.getValues("category_id");
    const subCategoryId = form.getValues("sub_category_id");

    if (!productName || !categoryId || !keyFeatures.trim()) {
      toast.error("Please fill in Product Name, Category, and Key Features before generating description.");
      return;
    }

    const categoryName = categoryData?.find((cat: Category) => cat.id.toString() === categoryId)?.name || 'General Category';
    const subCategoryName = subCategoryData?.find((sub: Category) => sub.id.toString() === subCategoryId)?.name || 'N/A Subcategory';

    try {
      const generatedDescription = await aiDescriptionMutation.mutateAsync({
        productName,
        categoryName,
        subCategoryName,
        keyFeatures,
      });

      form.setValue("description", generatedDescription, { shouldValidate: true });
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  // Loading state for edit mode
  if (productId && isLoading) {
    return <LoadingPage />;
  }

  if (categoryIsLoading || subCategoryIsLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage />;
  }

  if (categoryError || subCategoryError) {
    return <ErrorPage />;
  }

  const handleFiles = async (newFiles: FileList | null) => {
    if (!newFiles) return;

    const filesArray = Array.from(newFiles);
    const currentImages = form.getValues("images") || [];
    const currentPreviews = previewImages;

    if (currentImages.length + filesArray.length > 6) {
      toast.error("You can upload a maximum of 6 images.");
      return;
    }

    const newPreviewUrls = filesArray.map((file) => URL.createObjectURL(file));
    setPreviewImages([...currentPreviews, ...newPreviewUrls]);

    try {
      setUploadingImages(true);
      toast.message("Uploading images...");

      const uploadedUrls = await uploadMultipleImages(filesArray);
      const updatedImages = [...currentImages, ...uploadedUrls];
      form.setValue("images", updatedImages, { shouldValidate: true });

      toast.success(`Successfully uploaded ${filesArray.length} image(s)`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload images. Please try again.");
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

    const updatedPreviews = [...previewImages];
    if (updatedPreviews[index]) {
      if (updatedPreviews[index].startsWith("blob:")) {
        URL.revokeObjectURL(updatedPreviews[index]);
      }
      updatedPreviews.splice(index, 1);
      setPreviewImages(updatedPreviews);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const payload = {
        ...data,
        price: data.price,
        user_id: user!.id,
        category_id: data.category_id,
        sub_category_id: data.sub_category_id,
        images: data.images || [],
      };

      console.log("Submitting payload:", payload);
      mutation.mutate(payload);

      previewImages.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });

      if (!productId) {
        setPreviewImages([]);
        setKeyFeatures("");
        form.reset();
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to submit product");
    }
  };

  return (
    <div className="">
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
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("sub_category_id", "");
                      }}
                      value={field.value}
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
                    <FormLabel>Sub Category</FormLabel>
                    <Select
                      disabled={form.watch("category_id") === ""}
                      onValueChange={field.onChange}
                      value={field.value}
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

            {/* Key Features Input for AI Generation */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Key Features (for AI description generation)
              </label>
              <Input
                type="text"
                value={keyFeatures}
                onChange={(e) => setKeyFeatures(e.target.value)}
                placeholder="e.g., Noise-cancelling, 30-hour battery, Ergonomic fit, Waterproof"
                className="mb-2"
              />
              <p className="text-xs text-gray-500">
                Separate features with commas. This helps AI generate better descriptions.
              </p>
            </div>

            {/* Description with AI Generation */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Enter product description or generate with AI"
                          rows={6}
                          {...field}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleGenerateDescription}
                          disabled={
                            aiDescriptionMutation.isPending ||
                            !form.watch("name") ||
                            !form.watch("category_id") ||
                            !keyFeatures.trim()
                          }
                          className="shrink-0 h-auto px-4 py-2 flex flex-col items-center justify-center min-h-[120px]"
                        >
                          {aiDescriptionMutation.isPending ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin mb-2" />
                              <span className="text-xs">Generating...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-5 w-5 mb-2" />
                              <span className="text-xs">Generate</span>
                              <span className="text-xs">with AI</span>
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Fill in Product Name, Category, and Key Features, then click "Generate with AI" to create a description.
                      </p>
                    </div>
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
                  <FormLabel>Price</FormLabel>
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
                        <input
                          ref={inputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleFiles(e.target.files)}
                          disabled={uploadingImages}
                        />

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
                          const formImages = form.getValues("images") || [];
                          const isUploaded = formImages[index];
                          const isExistingImage =
                            !previewUrl.startsWith("blob:");

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
                                  !isUploaded &&
                                    !isExistingImage &&
                                    uploadingImages &&
                                    "opacity-50"
                                )}
                              />

                              {!isExistingImage &&
                                !isUploaded &&
                                uploadingImages && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                                  </div>
                                )}

                              {(isUploaded || isExistingImage) && (
                                <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                  ✓
                                </div>
                              )}

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
                  ? productId
                    ? "Updating Product..."
                    : "Creating Product..."
                  : productId
                    ? "Update Product"
                    : "Create Product"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setPreviewImages([]);
                  setKeyFeatures("");
                }}
                className="flex-1"
              >
                Reset Form
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateProductForm;