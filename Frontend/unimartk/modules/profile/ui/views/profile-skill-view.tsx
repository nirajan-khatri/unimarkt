"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import Image from "next/image";
import React, { useState } from "react";

import {
  DollarSign,
  Book,
  Code,
  Dumbbell,
  Languages,
  Lightbulb,
  Music,
  Palette,
  GraduationCapIcon,
  SchoolIcon,
  CalendarDaysIcon,
  ArrowLeft,
  Trash2Icon,
  ArchiveIcon,
  PencilIcon,
} from "lucide-react";
import { useAuth } from "@/modules/auth/contexts/authContext"; // Updated import

import { sortedAvailability } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { fetchSkillById } from "@/modules/skills/api";
import { useRouter } from "next/navigation";
import { archiveSkill, deleteSkill } from "../../api";
import { toast } from "sonner";
import ConfirmDeleteDialog from "@/components/confirm-delete-dialog";

interface Props {
  skillId: string;
}

const skillCovers = [
  { value: "academic", label: "Academic", icon: Book },
  { value: "programming", label: "Programming", icon: Code },
  { value: "language", label: "Language", icon: Languages },
  { value: "creative", label: "Creative", icon: Palette },
  { value: "finance", label: "Finance", icon: DollarSign },
  { value: "music", label: "Music", icon: Music },
  { value: "fitness", label: "Fitness", icon: Dumbbell },
  { value: "softskills", label: "Soft Skills", icon: Lightbulb },
];

export const ProfileSkillView = ({ skillId }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const { isAuthenticated, user, isInitialized } = useAuth();

  const { data, error, isLoading } = useSuspenseQuery({
    queryKey: ["skill", skillId],
    queryFn: () => fetchSkillById(skillId),
  });

  const deleteSkillMutation = useMutation({
    mutationFn: async () => {
      return deleteSkill(skillId);
    },
    onSuccess: () => {
      toast.success("Skill deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["userSkills"],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ["skill", skillId] });
      router.push("/profile?tab=services");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error("Failed to delete skill. Please try again.");
    },
  });

  const archiveSkillMutation = useMutation({
    mutationFn: () => {
      return archiveSkill({
        skillId,
        data: { isArchived: !data.isArchived },
      });
    },
    onSuccess: () => {
      toast.success("Skill archived successfully!");
      queryClient.invalidateQueries({
        queryKey: ["userSkills"],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ["skill", skillId] });
    },
    onError: (error) => {
      console.error("Skill Archive error:", error);
      toast.error("Failed to archive skill. Please try again.");
    },
  });

  const handleArchive = () => {
    archiveSkillMutation.mutate();
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
        </div>
        <div className="bg-background text-foreground rounded-lg overflow-hidden shadow-sm">
          <div>
            {/* Image Gallery */}
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row">
                {/* Main Image */}
                <div className="flex-1 order-2 sm:order-1">
                  <div className="w-full relative aspect-[4/3] sm:max-h-[500px] cursor-pointer hover:scale-[1.02] transition-transform group bg-muted">
                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-muted text-muted-foreground group-hover:brightness-95 transition">
                      {(() => {
                        const cover = skillCovers.find(
                          (c) =>
                            c.value === data.skill_category.name.toLowerCase()
                        );
                        const Icon = cover?.icon || Lightbulb;
                        return (
                          <>
                            <Icon className="w-16 h-16 mb-2" />
                            <span className="text-lg font-semibold">
                              {cover?.label || "Skill"}
                            </span>
                          </>
                        );
                      })()}
                    </div>
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
                    {data.module}
                  </h2>
                  <div className="flex flex-col md:flex-row gap-1 md:gap-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <SchoolIcon className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">
                        {data.department.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <GraduationCapIcon className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">
                        {data.degree.name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-xl sm:text-2xl font-bold">
                    {data.charge_per_hour}€
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CalendarDaysIcon className="w-5 h-5 text-muted-foreground" />
                  Weekly Availability
                </h3>
                <ul className="space-y-2">
                  {sortedAvailability(data.available_time_week).map(
                    (slot, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center p-3 bg-muted rounded-md border border-border"
                      >
                        <span className="font-medium">{slot.day}</span>
                        <span className="text-sm text-muted-foreground">
                          {slot.start_time.slice(0, 5)} -{" "}
                          {slot.end_time.slice(0, 5)}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div className="p-4 sm:p-6 border-t border-border">
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {data.description}
                </p>
              </div>
              <div className="flex flex-row gap-2 mt-4 justify-end items-center w-full p-4 border-t border-border bg-gray-50">
                <Button
                  variant="outline"
                  className="flex flex-row gap-2 hover:bg-red-50 hover:border-red-300"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2Icon className="w-4 h-4" />
                  {false ? "Deleting..." : "Delete"}
                </Button>

                {data.status === "approved" && (
                  <Button
                    variant="outline"
                    className="flex flex-row gap-2"
                    onClick={handleArchive}
                    disabled={archiveSkillMutation.isPending}
                  >
                    <ArchiveIcon className="w-4 h-4" />
                    {data.isArchived ? "Unarchive" : "Archive Product"}
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="flex flex-row gap-2"
                  onClick={() => {
                    router.push(`/profile/edit/skill/${skillId}`);
                  }}
                  // onClick={handleApprove}
                  // disabled={approveProductMutation.isPending}
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDeleteDialog
        confirmName={confirmName}
        setConfirmName={setConfirmName}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        deleteMutation={deleteSkillMutation}
        itemName={data.module}
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
