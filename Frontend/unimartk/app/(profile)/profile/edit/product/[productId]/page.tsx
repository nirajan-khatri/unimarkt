import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateProductForm from "@/modules/profile/ui/forms/create-product-form";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { fetchProductById } from "@/services/products";
import LoadingPage from "@/app/(admin)/admin/loader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ productId: string }>;
}

const Page = async ({ params }: Props) => {
  const { productId } = await params;
  const queryClient = new QueryClient();

  // Prefetch on server
  await queryClient.prefetchQuery({
    queryKey: ["product"],
    queryFn: () => fetchProductById(productId),
  });

  return (
    <div className="max-w-7xl w-full mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row gap-3 items-center">
          <Link href="/profile" passHref>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateProductForm productId={productId} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
