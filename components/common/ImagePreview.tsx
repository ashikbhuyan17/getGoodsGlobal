'use client';

import Image from 'next/image';
import { Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ImagePreviewProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  previewWidth?: string;
  previewHeight?: string;
}

export default function ImagePreview({
  src,
  alt,
  width = 64,
  height = 64,
  className = '',
  previewWidth = 'max-w-md',
  previewHeight = 'aspect-square',
}: ImagePreviewProps) {
  // Default placeholder image
  const DEFAULT_IMAGE =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='12'%3ENo Image%3C/text%3E%3C/svg%3E";

  const imageUrl =
    !src || src === '/placeholder-product.png'
      ? DEFAULT_IMAGE
      : src.startsWith('http') || src.startsWith('data:')
        ? src
        : `${process.env.NEXT_PUBLIC_IMG_URL}/${src}`;

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Dialog>
        <DialogTrigger asChild>
          <div className="absolute inset-0 flex items-center justify-center gap-1 text-xs bg-black/40 text-white cursor-pointer opacity-0 hover:opacity-100 transition-all duration-300 z-10 rounded overflow-hidden">
            <Eye size={12} /> <span className="text-xs">Preview</span>
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
                    lg:max-w-[400px]
                  "
        >
          <DialogTitle className="sr-only">Image preview: {alt}</DialogTitle>
          <DialogDescription className="sr-only">
            Preview of {alt}
          </DialogDescription>
          <div className="relative w-full aspect-square">
            <Image
              src={imageUrl}
              alt={alt}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 1024px) 350px, 540px"
            />
          </div>
        </DialogContent>
      </Dialog>
      <Image
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full rounded shadow-md object-cover border border-gray-200"
      />
    </div>
  );
}
