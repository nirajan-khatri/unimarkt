import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  listingType: "product" | "skill" | "job";
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  dialogType: string | null;
  selectedId: string | null;
  rejectMutation: any;
  deleteMutation: any;
  comment: string;
  setComment: React.Dispatch<React.SetStateAction<string>>;
}

const CommentDialog = ({
  dialogOpen,
  setDialogOpen,
  dialogType,
  selectedId,
  rejectMutation,
  deleteMutation,
  comment,
  setComment,
  listingType,
}: Props) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {dialogType === "reject"
              ? `Reject  ${listingType === "skill" ? "Skill" : listingType === "job" ? "Job" : "Product"}`
              : `Delete  ${listingType === "skill" ? "Skill" : listingType === "job" ? "Job" : "Product"}`}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-1">
          <label htmlFor="comment" className="text-sm font-medium">
            Comment
          </label>
          <Textarea
            id="comment"
            placeholder="Enter a reason..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              if (!selectedId) return;

              const payload =
                listingType === "skill"
                  ? { skillId: selectedId, comment }
                  : listingType === "job"
                    ? { jobId: selectedId, comment }
                    : { productId: selectedId, comment };
              if (dialogType === "reject") {
                rejectMutation.mutate(payload);
              } else if (dialogType === "delete") {
                deleteMutation.mutate(payload);
              }
            }}
            disabled={rejectMutation.isPending || deleteMutation.isPending}
          >
            {dialogType === "reject" ? "Reject" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
