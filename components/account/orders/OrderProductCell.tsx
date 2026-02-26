'use client';

import Image from 'next/image';
import { Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';

const DEFAULT_PRODUCT_IMAGE = '/hero-1.jpg';

interface OrderProductCellProps {
  /** Product image URL – uses default placeholder when not provided */
  imageUrl?: string | null;
  /** Alt text for image */
  title?: string;
}

export default function OrderProductCell({
  imageUrl,
  title = 'Product',
}: OrderProductCellProps) {
  const src =
    (imageUrl != null && `${process.env.NEXT_PUBLIC_IMG_URL}/${imageUrl}`) ||
    DEFAULT_PRODUCT_IMAGE;

  return (
    <div className="w-12 h-12 shrink-0">
      <div className="relative w-12 h-12">
        <Dialog>
          <DialogTrigger asChild>
            <div className="absolute inset-0 flex items-center justify-center gap-1 text-xs bg-black/40 text-white cursor-pointer opacity-0 hover:opacity-100 transition-all duration-300 z-10 rounded overflow-hidden">
              <Eye size={14} /> <span>Preview</span>
            </div>
          </DialogTrigger>
          <DialogContent
            className="
                    p-0 
                    border-0 
                    bg-transparent 
                    w-[350px] 
                    max-w-[350px]
                    lg:w-[350px] 
                    lg:max-w-[350px]
                  "
          >
            <DialogTitle className="sr-only">
              Image preview: {title}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Preview of {title}
            </DialogDescription>

            <div className="relative w-full aspect-square">
              <Image
                src={src}
                alt={title}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 1024px) 350px, 540px"
              />
            </div>
          </DialogContent>

        </Dialog>
        <Image
          src={src}
          alt={title}
          width={48}
          height={48}
          className="w-full h-full rounded shadow-md object-cover border border-gray-100"
        />
      </div>
    </div>
  );
}
