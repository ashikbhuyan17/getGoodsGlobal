'use client';

import { Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import UpdateCartModal from './UpdateCartModal';
import Image from 'next/image';

interface CartItemRowProps {
  color: string;
  size?: string;
  colorImage?: string | undefined;
  qty: number;
  id: number | string;
  price: number;
  page?: 'cart' | 'checkout';
  onEdit?: () => void;
  onRemoveLoading?: (loading: boolean) => void;
}

export default function CartItemRow({
  color,
  size,
  qty,
  price,
  page = 'cart',
  id,
  onEdit,
  colorImage,
  onRemoveLoading,
}: CartItemRowProps) {
  const imageSrc = colorImage || '/placeholder-product.png';

  return (
    <div className="flex items-start gap-2.5 py-1.5 text-sm font-medium">
      <div className="size-12 shrink-0 sm:size-16">
        <div className="relative size-12 sm:size-16">
          <Dialog>
            <DialogTrigger asChild>
              <div className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center gap-1 bg-black/40 text-sm text-white opacity-0 transition-all duration-300 hover:opacity-100">
                <Eye size={15} /> <span>Preview</span>
              </div>
            </DialogTrigger>

            <DialogContent className="aspect-square max-2xl:w-[400px] max-2xl:h-[400px]">
              <DialogTitle className="sr-only">Image preview: {color}</DialogTitle>
              <DialogDescription className="sr-only">Preview of {color}</DialogDescription>
              <Image
                src={imageSrc}
                alt={color}
                fill
                className="object-cover rounded-lg"
              />
            </DialogContent>
          </Dialog>
          <Image
            src={imageSrc}
            alt={color}
            width={64}
            height={64}
            className="h-full w-full rounded object-cover shadow-md"
          />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate">Color: {color}</p>
            {size && <p className="truncate">Size: {size}</p>}
          </div>
          {page === 'cart' && (
            <UpdateCartModal
              id={id}
              size={size}
              color={color}
              qty={qty}
              price={price}
              onRemoveLoading={onRemoveLoading}
            >
              <button
                onClick={onEdit}
                className="shrink-0 rounded bg-primary px-2 py-0.5 text-xs text-white sm:text-sm"
              >
                Edit
              </button>
            </UpdateCartModal>
          )}
        </div>
        <div className="mt-1 flex items-center justify-between gap-3">
          <span className="shrink-0 text-neutral-600">
            {qty} x ৳{price}
          </span>
          <span className="shrink-0">৳{qty * price}</span>
        </div>
      </div>
    </div>
  );
}
