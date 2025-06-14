import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  type: "delete" | "revoke" | "make";
  title: string;
  buttonType: "default" | "destructive" | "secondary";
  subtitle?: string;
  selectedId: string | null;
  mutation: any;
  listingType?: "product" | "skill" | "user";
}

const ConfirmDialog = ({
  dialogOpen,
  setDialogOpen,
  type,
  buttonType,
  title,
  subtitle,
  selectedId,
  mutation,
  listingType,
}: Props) => {
  const handleConfirm = () => {
    if (!selectedId) return;

    const payload = listingType
      ? listingType === "skill"
        ? { skillId: selectedId }
        : listingType === "user"
          ? { userId: selectedId }
          : { productId: selectedId }
      : { id: undefined };

    mutation.mutate(payload);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {subtitle && (
            <DialogDescription className="text-sm text-muted-foreground">
              {subtitle}
            </DialogDescription>
          )}
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant={buttonType}
            onClick={handleConfirm}
            disabled={mutation?.isPending}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
