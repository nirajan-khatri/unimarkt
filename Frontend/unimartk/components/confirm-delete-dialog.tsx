import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface Props {
  showDeleteDialog: boolean;
  setShowDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  confirmName: string;
  setConfirmName: React.Dispatch<React.SetStateAction<string>>;
  deleteMutation: any;
  itemName: string;
}

const ConfirmDeleteDialog = ({
  confirmName,
  deleteMutation,
  itemName,
  setConfirmName,
  showDeleteDialog,
  setShowDeleteDialog,
}: Props) => {
  return (
    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            This action is permanent. Please type <strong>{itemName}</strong> to
            confirm deletion.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Type your name"
          value={confirmName}
          onChange={(e) => setConfirmName(e.target.value)}
        />
        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              setShowDeleteDialog(false);
              setConfirmName("");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              deleteMutation.mutate();
              setShowDeleteDialog(false);
            }}
            disabled={
              confirmName.trim().toLowerCase() !== itemName.trim().toLowerCase()
            }
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
