'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useProductStore } from '@/stores/useProductStore';

interface AddToCartModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddToCartModal({ open, onClose }: AddToCartModalProps) {
  const router = useRouter();
  const reset = useProductStore((s) => s.reset);

  const handleContinueShopping = () => {
    reset();
    onClose();
  };

  const handleGoToCart = () => {
    reset();
    onClose();
    router.push('/cart');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-sm sm:max-w-md px-2 py-4">
        <DialogHeader>
          <DialogTitle className="text-base font-medium text-primary">
            Added to Cart
          </DialogTitle>
          <DialogDescription className="text-gray-800 text-sm font-medium mt-2">
            Product added to cart successfully
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-5 pt-1">
          <Button
            variant="outline"
            onClick={handleContinueShopping}
            className="border-gray-300 text-gray-700"
          >
            Continue Shopping
          </Button>
          <Button onClick={handleGoToCart} className="">
            Go to Cart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
