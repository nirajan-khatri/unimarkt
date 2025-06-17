import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  onClose
}) => {
  const handleDelete = () => {
    console.log('Account deleted');
    // Here you would handle the actual deletion
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <DialogTitle className="text-red-600">Delete Account</DialogTitle>
          </div>
          <DialogDescription className="text-gray-600">
            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
          <h4 className="font-medium text-red-800 mb-2">This will permanently:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• Delete all your listings</li>
            <li>• Remove your profile information</li>
            <li>• Cancel any ongoing transactions</li>
            <li>• Lose access to your messages</li>
          </ul>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Yes, Delete Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
