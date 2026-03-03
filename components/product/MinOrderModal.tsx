"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MinOrderModalProps {
  open: boolean;
  onClose: () => void;
  /** Specific error message. Default: সর্বনিম্ন 1 টি পণ্য অর্ডার করতে হবে */
  message?: string;
}

export default function MinOrderModal({ open, onClose, message }: MinOrderModalProps) {
  const defaultMessage = "সর্বনিম্ন 1 টি পণ্য অর্ডার করতে হবে";
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-sm sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Minimum Order Quantity 1
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-center py-2">
            {message ?? defaultMessage}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-2">
          <Button onClick={onClose} className="bg-[#279ACE] hover:bg-[#1b8cbf]">
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
