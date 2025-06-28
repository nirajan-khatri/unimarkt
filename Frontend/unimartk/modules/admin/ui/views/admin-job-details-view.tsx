"use client";

import {
  useMutation,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import {
  Lightbulb,
  GraduationCapIcon,
  SchoolIcon,
  CalendarDaysIcon,
  Trash2Icon,
  XIcon,
  CheckIcon,
  ArrowLeft,
  Microscope,
  User,
  PenToolIcon,
  FileText,
  Briefcase,
} from "lucide-react";
import { sortedAvailability, sendAdminMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { approveJob, deleteJob, fetchJobById } from "../../api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import CommentDialog from "../components/comment-dialog";

interface Props {
  jobId: string;
}

const jobTypes = [
  { value: "Engineering", label: "Engineering", icon: Microscope },
  { value: "Marketing", label: "Marketing", icon: User },
  { value: "Sales", label: "Sales", icon: PenToolIcon },
  { value: "Human Resources", label: "Human Resources", icon: FileText },
  { value: "Customer Support", label: "Customer Support", icon: Briefcase },
];

export const AdminJobDetailsView = ({ jobId }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Dialog state management
  const [dialogType, setDialogType] = useState<"reject" | "delete" | null>(
    null
  );
  const [comment, setComment] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, error, isLoading } = useSuspenseQuery({
    queryKey: ["job", jobId],
    queryFn: () => fetchJobById(jobId),
  });

  const deletejobMutation = useMutation({
    mutationFn: async ({
      jobId,
      comment,
    }: {
      jobId: string;
      comment: string;
    }) => {
      if (data?.user?.id && comment.trim()) {
        await sendAdminMessage(data.user.id, comment, data.title, "deleted");
      }
      return deleteJob(jobId);
    },
    onSuccess: () => {
      toast.success("job deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminJobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      setDialogOpen(false);
      setComment("");
      // Navigate back to jobs list
      router.push("/admin/jobs");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error("Failed to delete job. Please try again.");
    },
  });

  const approvejobMutation = useMutation({
    mutationFn: () => {
      return approveJob({ jobId, data: { status: "approved" } });
    },
    onSuccess: () => {
      toast.success("job approved successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminJobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
    },
    onError: (error) => {
      console.error("Approve error:", error);
      toast.error("Failed to approve job. Please try again.");
    },
  });

  const rejectjobMutation = useMutation({
    mutationFn: async ({
      jobId,
      comment,
    }: {
      jobId: string;
      comment: string;
    }) => {
      // Send admin message first if comment exists
      if (data?.user?.id && comment.trim()) {
        await sendAdminMessage(data.user.id, comment, data.title, "deleted");
      }

      return approveJob({ jobId, data: { status: "rejected" } });
    },
    onSuccess: () => {
      toast.success("job rejected successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminJobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      setDialogOpen(false);
      setComment("");
    },
    onError: (error) => {
      console.error("Reject error:", error);
      toast.error("Failed to reject job. Please try again.");
    },
  });

  const handleApprove = () => {
    if (data?.status === "approved") {
      toast.info("job is already approved.");
      return;
    }
    approvejobMutation.mutate();
  };

  const handleReject = () => {
    if (data?.status === "rejected") {
      toast.info("job is already rejected.");
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
                  <div className="w-full relative aspect-[4/3] sm:max-h-[400px] cursor-pointer hover:scale-[1.02] transition-transform group bg-muted">
                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-muted text-muted-foreground group-hover:brightness-95 transition">
                      {(() => {
                        const cover = jobTypes.find(
                          (c) => c.value === data?.category.name
                        );
                        const Icon = cover?.icon || Lightbulb;
                        return (
                          <>
                            <Icon className="w-16 h-16 mb-2" />
                            <span className="text-lg font-semibold">
                              {cover?.label || "job"}
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
                    {data?.title}
                  </h2>
                  <div className="flex flex-col md:flex-row gap-1 md:gap-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <GraduationCapIcon className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">
                        {data?.category.name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-xl sm:text-2xl font-bold">
                    {data?.salary_per_hour}€
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-border">
                <h3 className="text-lg font-semibold mb-3">Job Contact</h3>
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {data.contact_email}
                    </p>
                  </div>
                </div>
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
                  disabled={deletejobMutation.isPending}
                >
                  <Trash2Icon className="w-4 h-4 text-red-500" />
                  {deletejobMutation.isPending ? "Deleting..." : "Delete"}
                </Button>

                <Button
                  variant="destructive"
                  className="flex flex-row gap-2"
                  onClick={handleReject}
                  disabled={
                    rejectjobMutation.isPending || data?.status === "rejected"
                  }
                >
                  <XIcon className="w-4 h-4" />
                  {rejectjobMutation.isPending ? "Rejecting..." : "Reject"}
                </Button>

                <Button
                  variant="default"
                  className="flex flex-row gap-2 bg-green-600 hover:bg-green-700"
                  onClick={handleApprove}
                  disabled={
                    approvejobMutation.isPending || data?.status === "approved"
                  }
                >
                  <CheckIcon className="w-4 h-4" />
                  {approvejobMutation.isPending ? "Approving..." : "Approve"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Dialog for reject and delete actions */}
      <CommentDialog
        listingType="job"
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        dialogType={dialogType}
        selectedId={jobId}
        comment={comment}
        setComment={setComment}
        rejectMutation={rejectjobMutation}
        deleteMutation={deletejobMutation}
      />
    </>
  );
};

export const AdminDetailsViewSkeleton = () => {
  return (
    <div className="px-4 lg:px-12 py-10">
      <div className="border rounded-sm bg-white overflow-hidden">
        <div className="relative aspect-[3.9] border-b"></div>
      </div>
    </div>
  );
};
