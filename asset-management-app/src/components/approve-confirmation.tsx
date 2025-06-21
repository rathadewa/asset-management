"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose, 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import API_CONFIG from '@/config/api';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

interface ApproveConfirmationDialogProps {
  children: React.ReactNode; 
  onConfirm: () => void;      
}

export async function approveRequest(requestId: string) {
  const token = Cookies.get('token');

  if (!token) {
    toast.error("Otentikasi gagal", {
      description: "Token tidak ditemukan. Silakan login kembali.",
    });
    throw new Error('Token otentikasi tidak ditemukan.');
  }

  const apiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.request}`;

  const response = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ request_id: requestId })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `Error approved request. Status: ${response.status}`;

    throw new Error(errorMessage);
  }

  return await response.json();
}

export function ApproveConfirmationDialog({ children, onConfirm }: ApproveConfirmationDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false); 

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch (error) {
      console.error("Error approved request:", error);
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
          <DialogTitle>Are you sure approved this request?</DialogTitle>
          {/* <DialogDescription>
            This will permanently delete the asset data from the server. This action is irreversible.
          </DialogDescription> */}
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