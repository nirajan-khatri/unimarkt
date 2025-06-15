"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import ProfileDetailsCard from "../components/profile-details-card";
import { useUser } from "../../hooks/useUser";
import { redirect } from "next/navigation";
import { useAuth } from "@/modules/auth/contexts/authContext";

const ProfileView = () => {
  const { isAuthenticated, user, isInitialized } = useAuth();

  if ((!isAuthenticated || !user) && isInitialized) {
    redirect("/sign-in");
  }
  const { deleteUser, updateUser, isLoading } = useUser("1");

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
          loading={isLoading}
        />
      )}
      <div className="">
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
      </div>
    </div>
  );
};

export default ProfileView;
