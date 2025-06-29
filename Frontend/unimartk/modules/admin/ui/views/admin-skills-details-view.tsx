"use client";

import {
  useMutation,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
  Trash2Icon,
  XIcon,
  CheckIcon,
  ArrowLeft,
} from "lucide-react";

import { sortedAvailability, sendAdminMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { approveSkill, deleteSkill, fetchSkillById } from "../../api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import CommentDialog from "../components/comment-dialog";

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

export const AdminSkillDetailsView = ({ skillId }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Dialog state management
  const [dialogType, setDialogType] = useState<"reject" | "delete" | null>(
    null
  );
  const [comment, setComment] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, error, isLoading } = useSuspenseQuery({
    queryKey: ["skill", skillId],
    queryFn: () => fetchSkillById(skillId),
  });

  const deleteSkillMutation = useMutation({
    mutationFn: async ({
      skillId,
      comment,
    }: {
      skillId: string;
      comment: string;
    }) => {
      if (data?.user?.id && comment.trim()) {
        await sendAdminMessage(data.user.id, comment, data.module, "deleted");
      }
      return deleteSkill(skillId);
    },
    onSuccess: () => {
      toast.success("Skill deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminSkills"] });
      queryClient.invalidateQueries({ queryKey: ["skill", skillId] });
      setDialogOpen(false);
      setComment("");
      // Navigate back to skills list
      router.push("/admin/skills");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error("Failed to delete skill. Please try again.");
    },
  });

  const approveSkillMutation = useMutation({
    mutationFn: () => {
      return approveSkill({ skillId, data: { status: "approved" } });
    },
    onSuccess: () => {
      toast.success("Skill approved successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminSkills"] });
      queryClient.invalidateQueries({ queryKey: ["skill", skillId] });
    },
    onError: (error) => {
      console.error("Approve error:", error);
      toast.error("Failed to approve skill. Please try again.");
    },
  });

  const rejectSkillMutation = useMutation({
    mutationFn: async ({
      skillId,
      comment,
    }: {
      skillId: string;
      comment: string;
    }) => {
      // Send admin message first if comment exists
      if (data?.user?.id && comment.trim()) {
        await sendAdminMessage(data.user.id, comment, data.module, "deleted");
      }

      return approveSkill({ skillId, data: { status: "rejected" } });
    },
    onSuccess: () => {
      toast.success("Skill rejected successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminSkills"] });
      queryClient.invalidateQueries({ queryKey: ["skill", skillId] });
      setDialogOpen(false);
      setComment("");
    },
    onError: (error) => {
      console.error("Reject error:", error);
      toast.error("Failed to reject skill. Please try again.");
    },
  });

  const handleApprove = () => {
    if (data?.status === "approved") {
      toast.info("Skill is already approved.");
      return;
    }
    approveSkillMutation.mutate();
  };

  const handleReject = () => {
    if (data?.status === "rejected") {
      toast.info("Skill is already rejected.");
      return;
    }
    setDialogType("reject");
    setDialogOpen(true);
  };

  const handleDelete = () => {
    setDialogType("delete");
    setDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge
        className={cn(
          "px-3 py-1 text-sm font-medium uppercase",
          status === "pending" &&
            "bg-orange-100 border-orange-300 text-orange-700 hover:bg-orange-200",
          status === "rejected" &&
            "bg-red-100 border-red-300 text-red-700 hover:bg-red-200",
          status === "approved" &&
            "bg-green-100 border-green-300 text-green-700 hover:bg-green-200"
        )}
      >
        {status}
      </Badge>
    );
  };

  return (
    <>
      <div className="px-4 lg:px-12 py-10">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6 justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          {data?.status && getStatusBadge(data.status)}
        </div>

        <div className="bg-background text-foreground rounded-lg overflow-hidden shadow-sm border">
          <div>
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row">
                <div className="flex-1 order-2 sm:order-1">
                  <div className="w-full relative aspect-[4/3] sm:max-h-[500px] cursor-pointer hover:scale-[1.02] transition-transform group bg-muted">
                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-muted text-muted-foreground group-hover:brightness-95 transition">
                      {(() => {
                        const cover = skillCovers.find(
                          (c) =>
                            c.value ===
                            data?.skill_category?.name?.toLowerCase()
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
                    {data?.module}
                  </h2>
                  <div className="flex flex-col md:flex-row gap-1 md:gap-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <SchoolIcon className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">
                        {data?.department?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <GraduationCapIcon className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">
                        {data?.degree?.name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-xl sm:text-2xl font-bold">
                    {data?.charge_per_hour}€
                  </span>
                </div>
              </div>

              {/* User Information */}
              {data?.user && (
                <div className="p-4 sm:p-6 border-t border-border">
                  <h3 className="text-lg font-semibold mb-3">Skill Provider</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {data.user.name?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{data.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {data.user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Weekly Availability */}
              <div className="p-4 sm:p-6 border-t border-border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CalendarDaysIcon className="w-5 h-5 text-muted-foreground" />
                  Weekly Availability
                </h3>
                {data?.available_time_week?.length > 0 ? (
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
                ) : (
                  <p className="text-muted-foreground">
                    No availability specified
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="p-4 sm:p-6 border-t border-border">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {data?.description || "No description provided"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row gap-2 mt-4 justify-end items-center w-full p-4 border-t border-border bg-gray-50">
                <Button
                  variant="outline"
                  className="flex flex-row gap-2 hover:bg-red-50 hover:border-red-300"
                  onClick={handleDelete}
                  disabled={deleteSkillMutation.isPending}
                >
                  <Trash2Icon className="w-4 h-4 text-red-500" />
                  {deleteSkillMutation.isPending ? "Deleting..." : "Delete"}
                </Button>

                <Button
                  variant="destructive"
                  className="flex flex-row gap-2"
                  onClick={handleReject}
                  disabled={
                    rejectSkillMutation.isPending || data?.status === "rejected"
                  }
                >
                  <XIcon className="w-4 h-4" />
                  {rejectSkillMutation.isPending ? "Rejecting..." : "Reject"}
                </Button>

                <Button
                  variant="default"
                  className="flex flex-row gap-2 bg-green-600 hover:bg-green-700"
                  onClick={handleApprove}
                  disabled={
                    approveSkillMutation.isPending ||
                    data?.status === "approved"
                  }
                >
                  <CheckIcon className="w-4 h-4" />
                  {approveSkillMutation.isPending ? "Approving..." : "Approve"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Dialog for reject and delete actions */}
      <CommentDialog
        listingType="skill"
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        dialogType={dialogType}
        selectedId={skillId}
        comment={comment}
        setComment={setComment}
        rejectMutation={rejectSkillMutation}
        deleteMutation={deleteSkillMutation}
      />
    </>
  );
};
