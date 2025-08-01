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
import {
  ArrowLeft,
  Loader2,
  UploadCloud,
  Sparkles,
  AlertTriangle,
  Shield,
  X,
  RotateCcw,
} from "lucide-react";
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
import { useContentModeration } from "@/hooks/useContentModeration";

interface Props {
  productId?: string;
  isEdit?: boolean;
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
      const prompt = `Start the description with "I am selling". Then, write a product description in simple, clear English, easy for anyone to understand. Maintain a helpful and personal tone. Do not use overly casual or overly friendly language, and avoid any introductory or concluding remarks (except for "I am selling"). Just provide the description.
        Product Name: ${productName || "A fantastic product"}
        Category: ${categoryName}
        Subcategory: ${subCategoryName}
        Key Features: ${keyFeatures || "No specific features provided. Highlight general benefits."}
        Focus on the practical benefits and unique aspects for the user. Keep it around 150-250 words.`;

      const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = { contents: chatHistory };

      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API error: ${response.status} - ${errorData.error?.message || "Unknown error"}`
        );
      }

      const result = await response.json();
      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        return result.candidates[0].content.parts[0].text;
      } else {
        throw new Error(
          "No description generated. The AI might have encountered an issue."
        );
      }
    },
    onError: (error) => {
      console.error("Error generating description:", error);
      toast.error(`Failed to generate description: ${error.message}`);
    },
    onSuccess: () => {
      toast.success("AI description generated successfully!");
    },
  });
};

const CreateProductForm = ({ productId, isEdit }: Props) => {
  const router = useRouter();
  const { isAuthenticated, user, isInitialized } = useAuth();
  const [uploadingImages, setUploadingImages] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [keyFeatures, setKeyFeatures] = useState("");

  // Content Moderation States
  const {
    isModeratingText,
    isModeratingImages,
    warnings: moderationWarnings,
    moderateImages,
    moderateTextContent,
    clearWarnings,
    removeImageWarnings,
    isModeratingAny,
  } = useContentModeration();

  if (isInitialized && !isAuthenticated) {
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
      discountPercent: "",
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

  // Update form and preview images when product data is loaded
  useEffect(() => {
    if (product) {
      form.reset({
        name: product?.name || "",
        description: product?.description || "",
        images: product?.images || [],
        price: product?.price.toString() || "",
        pickup_location: product?.pickup_location || "",
        category_id: product?.category?.id.toString() || "",
        sub_category_id: product?.sub_category?.id?.toString() || "",
        discountPercent: product?.discount?.toString() || "",
      });

      setPreviewImages(product?.images || []);
    }
  }, [isEdit, product, categoryData, subCategoryData, form]);

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
      window.location.href = "/profile";
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
      toast.error(
        "Please fill in Product Name, Category, and Key Features before generating description."
      );
      return;
    }

    const categoryName =
      categoryData?.find((cat: Category) => cat.id.toString() === categoryId)
        ?.name || "General Category";
    const subCategoryName =
      subCategoryData?.find(
        (sub: Category) => sub.id.toString() === subCategoryId
      )?.name || "N/A Subcategory";

    try {
      const generatedDescription = await aiDescriptionMutation.mutateAsync({
        productName,
        categoryName,
        subCategoryName,
        keyFeatures,
      });

      form.setValue("description", generatedDescription, {
        shouldValidate: true,
      });
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  // Reset Form Handler
  const handleResetForm = () => {
    // Clear form data
    form.reset({
      name: "",
      category_id: "",
      sub_category_id: "",
      description: "",
      pickup_location: "",
      price: "",
      images: [],
    });

    // Clear preview images and revoke blob URLs
    previewImages.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });
    setPreviewImages([]);

    // Clear key features
    setKeyFeatures("");

    // Clear moderation warnings
    clearWarnings();

    // Show success message
    toast.success("Form has been reset");
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

    // CHANGED: Use the new hook method
    removeImageWarnings();

    // CHANGED: Use the hook's moderateImages function
    const validFiles = await moderateImages(filesArray);

    if (validFiles.length === 0) {
      toast.error("No images were approved for upload.");
      return;
    }

    if (validFiles.length < filesArray.length) {
      toast.warning(
        `${filesArray.length - validFiles.length} image(s) were rejected due to inappropriate content.`
      );
    }

    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages([...currentPreviews, ...newPreviewUrls]);

    try {
      setUploadingImages(true);
      toast.message("Uploading approved images...");

      const uploadedUrls = await uploadMultipleImages(validFiles);
      const updatedImages = [...currentImages, ...uploadedUrls];
      form.setValue("images", updatedImages, { shouldValidate: true });

      toast.success(`Successfully uploaded ${validFiles.length} image(s)`);
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
      // CHANGED: Use the new hook method
      clearWarnings();

      // CHANGED: Use the hook's moderateTextContent function
      const isContentSafe = await moderateTextContent({
        name: data.name,
        description: data.description,
        keyFeatures: keyFeatures,
      });

      if (!isContentSafe) {
        toast.error(
          "Your content contains inappropriate material. Please review and modify before submitting."
        );
        return;
      }

      // Rest remains the same
      const payload = {
        ...data,
        discount: data.discountPercent,
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
        clearWarnings(); // CHANGED: Use the new hook method
        form.reset();
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to submit product");
    }
  };

  if (isEdit && (!product || !categoryData || !subCategoryData)) {
    return <LoadingPage />;
  }

  console.log(form.formState.defaultValues);

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
                  <FormLabel>
                    Product Name<span className="text-red-500 -ml-1.5">*</span>
                  </FormLabel>
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
                    <FormLabel>
                      Category<span className="text-red-500 -ml-1.5">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("sub_category_id", ""); // Clear subcategory when category changes
                      }}
                      value={field.value || ""}
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
                    <FormLabel>
                      Sub Category
                      <span className="text-red-500 -ml-1.5">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
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
                Separate features with commas. This helps AI generate better
                descriptions.
              </p>
            </div>

            {/* Description with AI Generation */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description<span className="text-red-500 -ml-1.5">*</span>
                  </FormLabel>
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
                        Fill in Product Name, Category, and Key Features, then
                        click "Generate with AI" to create a description.
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price */}
            <div className="flex gap-3">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      Price<span className="text-red-500 -ml-1.5">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                          €
                        </span>
                        <Input
                          type="number"
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
              {isEdit && (
                <FormField
                  control={form.control}
                  name="discountPercent"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Discount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                            %
                          </span>
                          <Input
                            type="number"
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
              )}
            </div>

            <FormField
              control={form.control}
              name="pickup_location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Location (City)
                    <span className="text-red-500 -ml-1.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload Section */}
            <FormField
              control={form.control}
              name="images"
              render={() => {
                const inputRef = useRef<HTMLInputElement>(null);
                const [isDragging, setIsDragging] = useState(false);

                const handleDragOver = (e: React.DragEvent) => {
                  e.preventDefault();
                  setIsDragging(true);
                };

                const handleDragLeave = (e: React.DragEvent) => {
                  e.preventDefault();
                  setIsDragging(false);
                };

                const handleDrop = (e: React.DragEvent) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const files = e.dataTransfer.files;
                  handleFiles(files);
                };

                return (
                  <FormItem>
                    <FormLabel>
                      Upload Images (up to 6)
                      <span className="text-red-500 -ml-1.5">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {/* Upload Area */}
                        <div
                          className={cn(
                            "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
                            isDragging
                              ? "border-blue-500 bg-blue-50"
                              : "border-border hover:border-gray-400"
                          )}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => inputRef.current?.click()}
                        >
                          <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFiles(e.target.files)}
                            disabled={uploadingImages || isModeratingImages}
                          />

                          {uploadingImages || isModeratingImages ? (
                            <div className="flex flex-col items-center space-y-2">
                              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                              <p className="text-sm text-gray-600">
                                {isModeratingImages
                                  ? "Checking images for safety..."
                                  : "Uploading images..."}
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center space-y-2">
                              <UploadCloud className="h-8 w-8 text-gray-400" />
                              <div className="text-sm text-gray-600">
                                <p>Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, GIF up to 10MB each
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Image Previews */}
                        {previewImages.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {previewImages.map((imageUrl, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={imageUrl}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg border"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Moderation Warnings */}
            {moderationWarnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-yellow-800 mb-2">
                      Content Moderation Warnings
                    </h4>
                    <ul className="space-y-1">
                      {moderationWarnings.map((warning, index) => (
                        <li key={index} className="text-sm text-yellow-700">
                          • {warning}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={clearWarnings}
                      className="mt-3 text-xs text-yellow-600 hover:text-yellow-800 underline"
                    >
                      Dismiss warnings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>

            <div className="flex items-center space-x-4">
              {/* Content Safety Indicator */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4 text-green-500" />
                <span>AI-powered content safety</span>
              </div>

              {/* Reset Button - Only show for new products, not editing */}
              {!productId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetForm}
                  disabled={
                    mutation.isPending ||
                    uploadingImages ||
                    isModeratingAny ||
                    aiDescriptionMutation.isPending
                  }
                  className="flex items-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </Button>
              )}

              <Button
                type="submit"
                disabled={
                  mutation.isPending ||
                  uploadingImages ||
                  isModeratingAny ||
                  aiDescriptionMutation.isPending
                }
                className="flex items-center space-x-2"
              >
                {mutation.isPending || isModeratingText ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>
                      {isModeratingText
                        ? "Checking content..."
                        : productId
                          ? "Updating..."
                          : "Creating..."}
                    </span>
                  </>
                ) : (
                  <span>{productId ? "Update Product" : "Create Product"}</span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateProductForm;
