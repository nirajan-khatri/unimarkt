"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import Image from "next/image";
import React, { useState } from "react";

import {
  Lightbulb,
  GraduationCapIcon,
  Microscope,
  Briefcase,
  FileText,
  MapPinIcon,
  PenToolIcon,
  Scroll,
  User,
  Trash2Icon,
  ArchiveIcon,
  PencilIcon,
} from "lucide-react";
import { useAuth } from "@/modules/auth/contexts/authContext"; // Updated import

import { useRouter } from "next/navigation";
import { archiveJob, deleteJob } from "../../api";
import { toast } from "sonner";
import ConfirmDeleteDialog from "@/components/confirm-delete-dialog";
import { fetchJobById } from "@/modules/jobs/api";
import { Button } from "@/components/ui/button";

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

export const ProfileJobView = ({ jobId }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const { isAuthenticated, user, isInitialized } = useAuth();

  const { data, error, isLoading } = useSuspenseQuery({
    queryKey: ["job", jobId],
    queryFn: () => fetchJobById(jobId),
  });

  const deleteJobMutation = useMutation({
    mutationFn: async () => {
      return deleteJob(jobId);
    },
    onSuccess: () => {
      toast.success("Job deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["userJobs"],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      router.push("/profile?tab=jobs");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error("Failed to delete skill. Please try again.");
    },
  });

  const archiveJobMutation = useMutation({
    mutationFn: () => {
      return archiveJob({
        jobId,
        isArchived: data.isArchived,
      });
    },
    onSuccess: () => {
      toast.success(
        data.isArchived
          ? "Job unarchived successfully!"
          : "Job archived successfully!"
      );
      queryClient.invalidateQueries({
        queryKey: ["userJobs"],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
    },
    onError: (error) => {
      console.error("Job Archive error:", error);
      toast.error("Failed to archive job. Please try again.");
    },
  });

  const handleArchive = () => {
    archiveJobMutation.mutate();
  };

  return (
    <>
      <div className="px-4 lg:px-12 py-10">
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
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <GraduationCapIcon className="w-4 h-4" />
                        <span className="text-xs sm:text-sm">
                          {data?.category.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPinIcon className="w-4 h-4" />
                        <span className="text-xs sm:text-sm">
                          {data.location}
                        </span>
                      </div>
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
                <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                <div className="flex items-center gap-3 text-muted-foreground">
                  {/* <div className="flex items-center gap-1">
                    <Building2Icon className="w-4 h-4" />
                    <span className="text-xs sm:text-sm">
                      {data?.department.name}
                    </span>
                  </div> */}
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Scroll className="w-4 h-4" />
                    <span className="text-xs sm:text-sm">
                      {data?.degree ?? "any"}
                    </span>
                  </div>
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
            </div>
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
                disabled={archiveJobMutation.isPending}
              >
                <ArchiveIcon className="w-4 h-4" />
                {data.isArchived ? "Unarchive" : "Archive Job"}
              </Button>
            )}

            <Button
              variant="outline"
              className="flex flex-row gap-2"
              onClick={() => {
                router.push(`/profile/edit/job/${jobId}`);
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
      <ConfirmDeleteDialog
        confirmName={confirmName}
        setConfirmName={setConfirmName}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        deleteMutation={deleteJobMutation}
        itemName={data.title}
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
