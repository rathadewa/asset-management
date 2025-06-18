"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose, 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import API_CONFIG from '@/config/api';

interface DeleteConfirmationDialogProps {
  children: React.ReactNode; 
  onConfirm: () => void;      
}

export async function deleteAsset(assetId: string): Promise<boolean> {
  if (!assetId) {
    throw new Error("Asset ID is required for deletion.");
  }
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.assets}/${assetId}`;
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete the asset.');
    }
    return true;
  } catch (error) {
    console.error(`Error deleting asset with ID ${assetId}:`, error);
    throw error;
  }
}

export function DeleteConfirmationDialog({ children, onConfirm }: DeleteConfirmationDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false); 

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch (error) {
      console.error("Error deleted asset:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This will permanently delete the asset data from the server. This action is irreversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}