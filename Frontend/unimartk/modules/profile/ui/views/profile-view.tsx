"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { Suspense } from "react";
import ProfileDetailsCard from "../components/profile-details-card";
import { useUser } from "../../hooks/useUser";
import { redirect } from "next/navigation";
import { useAuth } from "@/modules/auth/contexts/authContext";
import { ProfileServiceGrid } from "../components/profile-skill-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileProductGrid } from "../components/profile-product-grid";
import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchUserProducts } from "../../api";
import { fetchUserSkills } from "../../api";
import { ProductGridSkeleton, SkillGridSkeleton } from "../components/skeletons";

// Products Component wrapped in Suspense
const ProductsSection = ({ userId }: { userId: string }) => {
  const { data: userProducts } = useSuspenseQuery({
    queryKey: ['userProducts', userId],
    queryFn: () => fetchUserProducts(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return (
    <ProfileProductGrid
      products={userProducts}
      error=""
      isLoading={false}
    />
  );
};

// Skills Component wrapped in Suspense
const SkillsSection = ({ userId }: { userId: string }) => {
  const { data: userSkills } = useSuspenseQuery({
    queryKey: ['userSkills', userId],
    queryFn: () => fetchUserSkills(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return (
    <ProfileServiceGrid
      services={userSkills}
      error={null}
      isLoading={false}
    />
  );
};

const ProfileView = () => {
  const { isAuthenticated, user, isInitialized } = useAuth();

  if ((!isAuthenticated || !user) && isInitialized) {
    redirect("/sign-in");
  }

  const { deleteUser, updateUser, isLoading: userLoading } = useUser("1");
  const [isEditing, setIsEditing] = React.useState(false);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  const handleSave = async (updatedData: {
    name: string;
    email: string;
    contact_number?: string;
  }) => {
    try {
      updateUser({ id: "1", data: updatedData });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleDelete = async () => {
    try {
      deleteUser();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  if ((!isAuthenticated || !user) && isInitialized) {
    redirect("/sign-in");
  }

  return (
    <div className="px-4 lg:px-12 py-10 flex flex-col gap-y-8">
      {user && (
        <ProfileDetailsCard
          // avatarUrl={user?.}
          name={user.name}
          email={user.email}
          contact_number={user.contact_number}
          role={user.role?.name || "User"}
          isEditing={isEditing}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSave={handleSave}
          onDelete={handleDelete}
          loading={userLoading}
        />
      )}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3">
          <p className="text-2xl">Your Listings</p>
          <div className="flex flex-row gap-3">
            <Button asChild>
              <Link href={"profile/sold"}>Show Sold Listings</Link>
            </Button>
            <Button asChild>
              <Link href={"profile/create"}>Create a new Listing</Link>
            </Button>
          </div>
        </div>
        <Tabs defaultValue="services" className="">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            {user?.id && (
              <Suspense fallback={<ProductGridSkeleton />}>
                <ProductsSection userId={user.id} />
              </Suspense>
            )}
          </TabsContent>
          <TabsContent value="services">
            {user?.id && (
              <Suspense fallback={<SkillGridSkeleton />}>
                <SkillsSection userId={user.id} />
              </Suspense>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileView;