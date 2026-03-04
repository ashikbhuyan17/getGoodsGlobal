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
    <div className="flex items-center justify-between py-1 text-sm font-medium">
      <div className="flex items-center gap-x-3">
        <div className="w-16 h-16 flex-shrink-0">
          <div className="relative w-16 h-16">
            <Dialog>
              <DialogTrigger asChild>
                <div className="absolute inset-0 flex items-center justify-center gap-1 text-sm bg-black/40 text-white cursor-pointer opacity-0 hover:opacity-100 transition-all duration-300 z-10">
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
              className="w-full h-full rounded shadow-md object-cover"
            />
          </div>
        </div>
        <div>
          <p>Color: {color}</p>
          {size && <p>Size: {size}</p>}
        </div>
      </div>
      <div>
        {qty} x ৳{price}
      </div>
      <div className="flex items-center gap-4">
        <span>৳{qty * price}</span>

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
              // size="sm"
              // variant="outline"
              onClick={onEdit}
              className="border-primary py-[2px]  rounded text-white  px-2 text-sm bg-primary"
            >
              Edit
            </button>
          </UpdateCartModal>
        )}
      </div>
    </div>
  );
}
