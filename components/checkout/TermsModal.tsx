"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsModalProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
  /** HTML string from checkout API: order_condition */
  orderConditionHtml?: string;
}

export default function TermsModal({ open, onClose, onAccept, orderConditionHtml }: TermsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">Terms & Conditions</DialogTitle>
          <DialogDescription className="sr-only">Review order terms and conditions before proceeding</DialogDescription>
          {/* <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button> */}
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-6 py-4">
          {orderConditionHtml ? (
            <div
              className="prose max-w-none text-sm text-gray-700"
              dangerouslySetInnerHTML={{ __html: orderConditionHtml }}
            />
          ) : (
            <div className="text-sm text-gray-700">
              <p>No terms &amp; conditions available.</p>
            </div>
          )}
        </ScrollArea>

        {/* Action Buttons */}
        <div className="px-6 py-4 border-t flex gap-3">
          <Button
            onClick={onClose}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            Deny
          </Button>
          <Button
            onClick={onAccept}
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
          >
            Accept & Place Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
