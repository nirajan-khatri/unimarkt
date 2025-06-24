"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import ProfileDetailsCard from "../components/profile-details-card";
import { useUser } from "../../hooks/useUser";
import { redirect } from "next/navigation";
import { useAuth } from "@/modules/auth/contexts/authContext";
import { skills } from "@/constants/skills";
import { ProfileServiceGrid } from "../components/profile-skill-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileProductGrid } from "../components/profile-product-grid";
import { products } from "@/constants/products";
import { Briefcase, Code, Package } from "lucide-react";

const ProfileView = () => {
  const { isAuthenticated, user, isInitialized } = useAuth();

  if ((!isAuthenticated || !user) && isInitialized) {
    redirect("/sign-in");
  }
  const { deleteUser, updateUser, isLoading } = useUser("1");

  const [isEditing, setIsEditing] = React.useState(false);
  const [tab, setTab] = React.useState("active");
  const [filter, setFilter] = React.useState<"products" | "services" | "jobs">(
    "products"
  );

  // const { data, isLoading, error } = useQuery({
  //   queryKey: ["profileProducts"],
  //   queryFn: fetchUserProducts(user?.id),
  //   enabled:user!==null
  // });

  // const { data, isLoading, error } = useQuery({
  //   queryKey: ["profileSkills"],
  //   queryFn: fetchUserSkills(user?.id),
  //   enabled:user!==null
  // });

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
          loading={isLoading}
        />
      )}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3">
          <p className="text-2xl">Your Listings</p>
          <div className="flex flex-row gap-3">
            <Button asChild>
              <Link href={"profile/create"}>Create a new Listing</Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="w-fit">
              <TabsTrigger value="active">Active Listings</TabsTrigger>
              <TabsTrigger value="archived">
                Sold / Archived Listings
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <Button
              variant={filter === "products" ? "default" : "outline"}
              onClick={() => setFilter("products")}
              size="sm"
              className="gap-2"
            >
              <Package className="h-4 w-4" />
              Products
            </Button>
            <Button
              variant={filter === "services" ? "default" : "outline"}
              onClick={() => setFilter("services")}
              size="sm"
              className="gap-2"
            >
              <Code className="h-4 w-4" />
              Services
            </Button>
            <Button
              variant={filter === "jobs" ? "default" : "outline"}
              onClick={() => setFilter("jobs")}
              size="sm"
              className="gap-2"
            >
              <Briefcase className="h-4 w-4" />
              Jobs
            </Button>
          </div>

          {/* Content */}
          <div className="mt-4">
            {tab === "active" && filter === "products" && (
              <ProfileProductGrid
                products={products}
                error={""}
                isLoading={false}
              />
            )}
            {tab === "active" && filter === "services" && (
              <ProfileServiceGrid
                services={skills}
                error={null}
                isLoading={false}
              />
            )}
            {tab === "active" && filter === "jobs" && (
              // <JobsGrid jobs={activeJobs} />
              <p className="">JOBS</p>
            )}

            {tab === "archived" && filter === "products" && (
              <ProfileProductGrid
                products={products}
                error={""}
                isLoading={false}
              />
            )}
            {tab === "archived" && filter === "services" && (
              <ProfileServiceGrid
                services={skills}
                error={null}
                isLoading={false}
              />
            )}
            {tab === "archived" && filter === "jobs" && (
              // <JobsGrid jobs={archivedJobs} />
              <p className="">JOBS</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
