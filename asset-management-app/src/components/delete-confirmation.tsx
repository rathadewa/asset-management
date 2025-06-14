// src/components/delete-confirmation-dialog.tsx

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
  DialogClose, // Kita gunakan DialogClose untuk tombol Batal
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// Definisikan props yang dibutuhkan oleh komponen kita
interface DeleteConfirmationDialogProps {
  children: React.ReactNode; // Ini akan menjadi tombol/menu item yang memicu dialog
  onConfirm: () => void;      // Fungsi yang akan dijalankan saat tombol "Hapus" diklik
}

export function DeleteConfirmationDialog({ children, onConfirm }: DeleteConfirmationDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false); // State untuk mengontrol dialog

  // Fungsi yang dipanggil saat tombol konfirmasi diklik
  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      // Jalankan fungsi hapus yang sebenarnya
      await onConfirm();
      // Jika berhasil, tutup dialog
      setOpen(false);
    } catch (error) {
      console.error("Gagal melakukan penghapusan:", error);
      // Anda bisa menambahkan notifikasi error di sini
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Kita gunakan 'controlled' dialog agar bisa ditutup secara manual setelah aksi selesai
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apakah Anda Yakin?</DialogTitle>
          <DialogDescription>
            Tindakan ini tidak dapat diurungkan. Data aset akan dihapus secara permanen dari server.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {/* Tombol Batal, otomatis menutup dialog */}
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          {/* Tombol Hapus, memanggil fungsi handleConfirm */}
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Menghapus..." : "Ya, Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}