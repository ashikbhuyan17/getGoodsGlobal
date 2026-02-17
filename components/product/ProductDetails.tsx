/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import SizeCard from './SizeCard';
import { useProductStore } from '@/stores/useProductStore';

export default function ProductDetails({
  product,
  bulkQuantities,
}: {
  product: any;
  bulkQuantities?: any;
}) {
  const [image, setImage] = useState(
    `${process.env.NEXT_PUBLIC_IMG_URL}/${product?.data?.product?.image?.image}`,
  );

  const selectedColor = useProductStore((s) => s.selectedColor);
  const setSelectedColor = useProductStore((s) => s.setSelectedColor);
  const colorQty = useProductStore((s) => s.colorQty);
  // Subscribe to variants so color badge updates immediately when quantity changes
  useProductStore((s) => s.variants);

  return (
    <div className="p-2 flex flex-col xl:flex-row mt-4 gap-4 overflow-x-hidden justify-between border-border">
      {/* Left Section - Image Gallery */}
      <div className="flex xl:flex-col gap-2">
        <div
          onClick={() =>
            setImage(
              `${process.env.NEXT_PUBLIC_IMG_URL}/${product?.data?.product?.image?.image}`,
            )
          }
          className="w-17 h-17 rounded-md overflow-hidden border cursor-pointer"
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_IMG_URL}/${product?.data?.product?.image?.image}`}
            alt={product?.data?.product?.name}
            width={68}
            height={68}
            className="object-cover w-full h-full"
          />
        </div>
        {JSON.parse(product?.data?.product?.PostImage ?? '[]')?.map(
          (img: string) => (
            <div
              key={img}
              onClick={() =>
                setImage(
                  `${process.env.NEXT_PUBLIC_IMG_URL}/public/images/product/slider/${img}`,
                )
              }
              className="w-16 h-16 rounded-md overflow-hidden border cursor-pointer"
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_IMG_URL}/public/images/product/slider/${img}`}
                alt={product?.data?.product?.name}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
          ),
        )}
      </div>
      <div className="w-full">
        <div className="relative h-[200px] xl:h-[220px]  2xl:h-[400px] w-full ">
          <Dialog>
            <DialogTrigger asChild>
              <div className="absolute inset-0 flex items-center justify-center gap-1 text-sm bg-black/40 text-white cursor-pointer opacity-0 hover:opacity-100 transition-all duration-300 z-10">
                <Eye size={15} /> <span>Preview</span>
              </div>
            </DialogTrigger>

            <DialogContent className="aspect-square  max-2xl:w-[400px]">
              <DialogTitle className="sr-only">Image preview: {product?.data?.product?.name}</DialogTitle>
              <DialogDescription className="sr-only">Preview of product image</DialogDescription>
              <Image
                src={image}
                alt={product?.data?.product?.name}
                fill
                className="rounded-lg object-cover"
              />
            </DialogContent>
          </Dialog>
          <Image
            src={image}
            alt="main shoe"
            width={180}
            height={180}
            className="rounded-lg shadow-md object-contain lg:object-cover w-full h-full p-1"
          />
        </div>
      </div>

      {/* Right Section - Offer and Details */}
      <div className="w-full">
        <Card className="border-none shadow-none p-0">
          <CardContent className="p-0 shadow-none px-2 border-0 space-y-6">
            {bulkQuantities && (
              <div className="bg-gray-100 rounded-t-md overflow-hidden">
                <div className="grid grid-cols-3 gap-0">
                  {bulkQuantities?.data?.map(
                    (bulk: any, i: number) =>
                      i < 3 && (
                        <div
                          key={bulk?.id}
                          className={cn(
                            'relative px-4 py-6',
                            i === 0 ? 'bg-[#E7F2EF]' : 'bg-gray-100',
                          )}
                        >
                          <div className="flex flex-col items-center text-center">
                            <div className="flex flex-col items-center gap-1 space-y-2">
                              <p className="text-xl font-semibold text-gray-800">
                                ৳{bulk?.price}
                              </p>
                              {bulk?.old_price && (
                                <p className="text-sm text-gray-400 line-through">
                                  ৳{bulk?.old_price}
                                </p>
                              )}
                              <p className="text-sm text-[#777]">
                                {bulk?.title}
                              </p>
                            </div>
                          </div>
                          {i === 0 ? (
                            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 to-cyan-400" />
                          ) : (
                            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200" />
                          )}
                        </div>
                      ),
                  )}
                </div>
              </div>
            )}

            <div>
              <p className="font-medium text-gray-700 mb-2">
                Color :{' '}
                <span className="text-primary cursor-pointer">
                  {selectedColor?.colorName}
                </span>
              </p>
              <div className="flex relative flex-wrap gap-3">
                {product?.data?.productColors?.map((color: any) => (
                  <div
                    key={color?.color?.id}
                    onClick={() => {
                      setSelectedColor(color?.color);
                      setImage(
                        `${process.env.NEXT_PUBLIC_IMG_URL}/${color?.Image}`,
                      );
                    }}
                    className="w-14 h-14 rounded-md overflow-hidden cursor-pointer"
                  >
                    {(() => {
                      const qty = colorQty(String(color?.color?.id ?? ''));
                      return qty > 0 ? (
                        <span
                          className={cn(
                            'bg-primary text-white text-xs flex items-center justify-center absolute -mt-1 -ml-1',
                            qty <= 10
                              ? 'w-5 h-5 min-w-5 min-h-5 rounded-full'
                              : 'h-5 min-h-5 px-2 rounded-md',
                          )}
                        >
                          {qty}
                        </span>
                      ) : null;
                    })()}
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMG_URL}/${color?.Image}`}
                      alt="color1"
                      width={56}
                      height={56}
                      className={cn(
                        'object-cover p-0.5 rounded-md',
                        selectedColor?.id === color?.color?.id &&
                          'border-2 border-primary',
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
            <ScrollArea className="h-56 max-lg:w-full max-2xl:w-[320px]">
              <div className="mt-4 border-2 border-[#EEEEEE] rounded-md overflow-hidden">
                <div className="grid grid-cols-3 gap-3 p-1 py-2 border-gray-200">
                  <div className="text-start">
                    <span className="block w-full bg-[#F5F5F5]  font-medium px-3 py-2 rounded-md text-sm text-start">
                      Size
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="block w-full bg-[#F5F5F5]  font-medium px-3 py-2 rounded-md text-sm text-center">
                      Price
                    </span>
                  </div>
                  <div className="text-center ">
                    <span className="block w-full bg-[#F5F5F5]  font-medium px-3 py-2 rounded-md text-sm text-center">
                      Quantity
                    </span>
                  </div>
                </div>

                {product?.data?.productSizes?.map((size: any) => (
                  <SizeCard
                    key={size?.id}
                    colorId={String(selectedColor?.id ?? '')}
                    size={size?.size?.sizeName}
                    price={size?.SalePrice}
                    max={Number(size?.stock)}
                  />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
